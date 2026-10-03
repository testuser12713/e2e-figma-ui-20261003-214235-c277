import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import App from '../App';
import DashboardMenuScreen from '../src/screens/DashboardMenuScreen';
import DashboardStatsScreen from '../src/screens/DashboardStatsScreen';
import MoneyDetailScreen from '../src/screens/MoneyDetailScreen';
import TimeDetailScreen from '../src/screens/TimeDetailScreen';
import AddExpenseScreen from '../src/screens/AddExpenseScreen';
import AddAppointmentScreen from '../src/screens/AddAppointmentScreen';

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
    canGoBack: () => true,
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

function makeRoute(name: string, params?: object) {
  return { key: `${name}-key`, name, params };
}

describe('App shell', () => {
  it('renders the Dashboard tab as the start screen', async () => {
    await render(<App />);
    expect(screen.getByTestId('screen-dashboard')).toBeTruthy();
  });

  it('exposes a tab button for every main screen', async () => {
    await render(<App />);
    expect(screen.getByTestId('tab-dashboard')).toBeTruthy();
    expect(screen.getByTestId('tab-money')).toBeTruthy();
    expect(screen.getByTestId('tab-time')).toBeTruthy();
  });

  it('switches to Money Management when its tab is tapped', async () => {
    await render(<App />);
    await fireEvent.press(screen.getByTestId('tab-money'));
    expect(screen.getByTestId('screen-money')).toBeTruthy();
  });

  it('switches to Time Management when its tab is tapped', async () => {
    await render(<App />);
    await fireEvent.press(screen.getByTestId('tab-time'));
    expect(screen.getByTestId('screen-time')).toBeTruthy();
  });
});

describe('Registered stack screens render', () => {
  it('renders DashboardMenu', async () => {
    await render(
      <DashboardMenuScreen navigation={makeNavigation() as never} route={makeRoute('DashboardMenu') as never} />,
    );
    expect(screen.getByTestId('screen-dashboard-menu')).toBeTruthy();
  });

  it('renders DashboardStats', async () => {
    await render(
      <DashboardStatsScreen navigation={makeNavigation() as never} route={makeRoute('DashboardStats') as never} />,
    );
    expect(screen.getByTestId('screen-dashboard-stats')).toBeTruthy();
  });

  it('renders MoneyDetail with a transaction id', async () => {
    await render(
      <MoneyDetailScreen
        navigation={makeNavigation() as never}
        route={makeRoute('MoneyDetail', { transactionId: 'tx-1001' }) as never}
      />,
    );
    expect(screen.getByTestId('screen-money-detail')).toBeTruthy();
  });

  it('renders TimeDetail with an appointment id', async () => {
    await render(
      <TimeDetailScreen
        navigation={makeNavigation() as never}
        route={makeRoute('TimeDetail', { appointmentId: 'ap-2001' }) as never}
      />,
    );
    expect(screen.getByTestId('screen-time-detail')).toBeTruthy();
  });

  it('renders AddExpense', async () => {
    await render(
      <AddExpenseScreen navigation={makeNavigation() as never} route={makeRoute('AddExpense') as never} />,
    );
    expect(screen.getByTestId('screen-add-expense')).toBeTruthy();
  });

  it('renders AddAppointment', async () => {
    await render(
      <AddAppointmentScreen navigation={makeNavigation() as never} route={makeRoute('AddAppointment') as never} />,
    );
    expect(screen.getByTestId('screen-add-appointment')).toBeTruthy();
  });
});
