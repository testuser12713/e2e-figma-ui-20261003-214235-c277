import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { AppDataProvider, useAppData } from '../src/store/AppDataContext';
import AddExpenseScreen from '../src/screens/AddExpenseScreen';

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

jest.setTimeout(30000);

function makeNavigation(overrides: Record<string, unknown> = {}) {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: () => true,
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    dispatch: jest.fn(),
    reset: jest.fn(),
    isFocused: () => true,
    getParent: () => undefined,
    getState: () => ({}),
    setParams: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    popToTop: jest.fn(),
    ...overrides,
  };
}

function makeRoute() {
  return { key: 'AddExpense-key', name: 'AddExpense' };
}

function Probe() {
  const { transactions } = useAppData();
  const last = transactions[0];
  return (
    <>
      <Text testID="probe-count">{String(transactions.length)}</Text>
      <Text testID="probe-last">
        {last ? `${last.title}|${last.categoryId}|${last.date}|${last.amount}` : 'none'}
      </Text>
    </>
  );
}

function renderScreen(navigation: ReturnType<typeof makeNavigation>) {
  return render(
    <AppDataProvider>
      <AddExpenseScreen navigation={navigation as never} route={makeRoute() as never} />
      <Probe />
    </AppDataProvider>,
  );
}

function count(): number {
  return Number(screen.getByTestId('probe-count').props.children);
}

describe('AddExpenseScreen (Money Management 3)', () => {
  it('renders the form fields and the confirm control', async () => {
    await renderScreen(makeNavigation());
    expect(screen.getByTestId('screen-add-expense')).toBeTruthy();
    expect(screen.getByTestId('add-expense-name')).toBeTruthy();
    expect(screen.getByTestId('add-expense-description')).toBeTruthy();
    expect(screen.getByTestId('add-expense-amount')).toBeTruthy();
    expect(screen.getByTestId('add-expense-date')).toBeTruthy();
    expect(screen.getByTestId('add-expense-submit')).toBeTruthy();
    expect(screen.getByTestId('add-expense-close')).toBeTruthy();
  });

  it('adds the transaction to the store and closes the modal on a valid submit', async () => {
    const navigation = makeNavigation();
    await renderScreen(navigation);
    const before = count();

    await fireEvent.changeText(screen.getByTestId('add-expense-name'), 'Coffee');
    await fireEvent.changeText(screen.getByTestId('add-expense-amount'), '12,50');
    await fireEvent.changeText(screen.getByTestId('add-expense-date'), '2020-04-09');
    await fireEvent.press(screen.getByTestId('add-expense-submit'));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(count()).toBe(before + 1);
    expect(screen.getByTestId('probe-last').props.children).toBe('Coffee|home|2020-04-09|12.5');
  });

  it('starts neutral and only reports errors after a submit attempt', async () => {
    const navigation = makeNavigation();
    await renderScreen(navigation);

    expect(screen.queryByText('Please enter a name.')).toBeNull();

    await fireEvent.press(screen.getByTestId('add-expense-submit'));

    expect(screen.getByText('Please enter a name.')).toBeTruthy();
    expect(screen.getByText('Please enter an amount.')).toBeTruthy();
    expect(screen.getByText('Please select a date.')).toBeTruthy();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('rejects an invalid amount and date without closing', async () => {
    const navigation = makeNavigation();
    await renderScreen(navigation);
    const before = count();

    await fireEvent.changeText(screen.getByTestId('add-expense-name'), 'Train');
    await fireEvent.changeText(screen.getByTestId('add-expense-amount'), 'abc');
    await fireEvent.changeText(screen.getByTestId('add-expense-date'), 'not-a-date');
    await fireEvent.press(screen.getByTestId('add-expense-submit'));

    expect(screen.getByText('Please enter a valid amount.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid date (YYYY-MM-DD).')).toBeTruthy();
    expect(navigation.goBack).not.toHaveBeenCalled();
    expect(count()).toBe(before);
  });

  it('closes without adding anything from the close control', async () => {
    const navigation = makeNavigation();
    await renderScreen(navigation);
    const before = count();

    await fireEvent.press(screen.getByTestId('add-expense-close'));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
    expect(count()).toBe(before);
  });
});
