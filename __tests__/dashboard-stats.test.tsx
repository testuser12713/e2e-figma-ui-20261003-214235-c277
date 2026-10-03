import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import DashboardStatsScreen from '../src/screens/DashboardStatsScreen';
import { AppDataProvider } from '../src/store/AppDataContext';

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

function renderScreen(navigation = makeNavigation()) {
  return render(
    <AppDataProvider>
      <DashboardStatsScreen
        navigation={navigation as never}
        route={{ key: 'DashboardStats-key', name: 'DashboardStats' } as never}
      />
    </AppDataProvider>,
  );
}

describe('DashboardStatsScreen', () => {
  it('renders the statistics screen with the seeded values', async () => {
    await renderScreen();

    expect(screen.getByTestId('screen-dashboard-stats')).toBeTruthy();
    expect(screen.getByText('Statistics')).toBeTruthy();
    expect(screen.getByText(/Since 21\. Dec/)).toBeTruthy();
    expect(screen.getByText('Dec 2024 - Jan 2024')).toBeTruthy();
    expect(screen.getByText(/Top Run: 20 Days/)).toBeTruthy();
  });

  it('returns to the previous screen when the back control is pressed', async () => {
    const navigation = makeNavigation();
    await renderScreen(navigation);

    await fireEvent.press(screen.getByTestId('stats-back-button'));

    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('disables the period switch and marks it as coming soon', async () => {
    await renderScreen();

    const control = screen.getByTestId('stats-period-switch');
    expect(control.props.accessibilityState?.disabled).toBe(true);
    expect(screen.getByText(/coming soon/i)).toBeTruthy();
  });
});
