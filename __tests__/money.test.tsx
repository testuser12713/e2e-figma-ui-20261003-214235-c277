import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { AppDataProvider } from '../src/store/AppDataContext';
import MoneyScreen from '../src/screens/MoneyScreen';
import MoneyDetailScreen from '../src/screens/MoneyDetailScreen';
import { formatCurrency } from '../src/lib/format';

jest.setTimeout(30000);

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaInsetsContext: {
      Consumer: ({ children }: { children: (value: typeof inset) => React.ReactNode }) =>
        children(inset),
    },
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 414, height: 896 }),
    initialWindowMetrics: { insets: inset, frame: { x: 0, y: 0, width: 414, height: 896 } },
  };
});

function makeNavigation() {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    dispatch: jest.fn(),
    reset: jest.fn(),
    isFocused: () => true,
    canGoBack: () => false,
    getId: () => undefined,
    getParent: () => undefined,
    getState: () => ({}),
    setParams: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
  };
}

const moneyRoute = { key: 'Money-key', name: 'Money' } as never;

describe('Money Management list', () => {
  it('renders the summary area and bookings with formatted amounts', async () => {
    await render(
      <AppDataProvider>
        <MoneyScreen navigation={makeNavigation() as never} route={moneyRoute} />
      </AppDataProvider>,
    );

    expect(screen.getByTestId('screen-money')).toBeTruthy();
    expect(screen.getByText('MONTHLY EXPENSES')).toBeTruthy();
    expect(screen.getByText('QUICK CATEGORIES')).toBeTruthy();
    expect(screen.getByText('Spend On Fun Mall Cinema')).toBeTruthy();
    expect(screen.getByText(formatCurrency(23))).toBeTruthy();
    expect(screen.getAllByText('02- Thursday').length).toBeGreaterThan(0);
    expect(screen.getByTestId('money-row-tx-1001')).toBeTruthy();
  });

  it('opens the variant detail view when a booking row is pressed', async () => {
    const navigation = makeNavigation();
    await render(
      <AppDataProvider>
        <MoneyScreen navigation={navigation as never} route={moneyRoute} />
      </AppDataProvider>,
    );

    await fireEvent.press(screen.getByTestId('money-row-tx-1001'));
    expect(navigation.navigate).toHaveBeenCalledWith('MoneyDetail', { transactionId: 'tx-1001' });
  });

  it('opens the add expense form from the floating add button', async () => {
    const navigation = makeNavigation();
    await render(
      <AppDataProvider>
        <MoneyScreen navigation={navigation as never} route={moneyRoute} />
      </AppDataProvider>,
    );

    await fireEvent.press(screen.getByTestId('fab-add-expense'));
    expect(navigation.navigate).toHaveBeenCalledWith('AddExpense');
  });
});

describe('Money detail variant', () => {
  it('renders the weekly report for the transaction and pops on back', async () => {
    const navigation = makeNavigation();
    await render(
      <AppDataProvider>
        <MoneyDetailScreen
          navigation={navigation as never}
          route={
            {
              key: 'MoneyDetail-key',
              name: 'MoneyDetail',
              params: { transactionId: 'tx-1001' },
            } as never
          }
        />
      </AppDataProvider>,
    );

    expect(screen.getByTestId('screen-money-detail')).toBeTruthy();
    expect(screen.getByText('WEEKLY REPORT')).toBeTruthy();
    expect(screen.getByText('Spend On Fun Mall Cinema')).toBeTruthy();

    await fireEvent.press(screen.getByTestId('money-detail-back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('renders the variant even without a surrounding data provider', async () => {
    const navigation = makeNavigation();
    await render(
      <MoneyDetailScreen
        navigation={navigation as never}
        route={
          {
            key: 'MoneyDetail-key',
            name: 'MoneyDetail',
            params: { transactionId: 'tx-1002' },
          } as never
        }
      />,
    );

    expect(screen.getByTestId('screen-money-detail')).toBeTruthy();
  });
});
