import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import DashboardMenuScreen from '../src/screens/DashboardMenuScreen';
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

function makeRoute() {
  return { key: 'DashboardMenu-key', name: 'DashboardMenu', params: undefined };
}

async function renderMenu() {
  const navigation = makeNavigation();
  await render(
    <AppDataProvider>
      <DashboardMenuScreen navigation={navigation as never} route={makeRoute() as never} />
    </AppDataProvider>,
  );
  return navigation;
}

describe('DashboardMenuScreen', () => {
  it('shows the profile header from the store', async () => {
    await renderMenu();
    expect(screen.getByText('Sophie Garnier')).toBeTruthy();
    expect(screen.getByText('Luxembourg')).toBeTruthy();
  });

  it('lists every menu row', async () => {
    await renderMenu();
    expect(screen.getByTestId('dashboard-menu-stats')).toBeTruthy();
    expect(screen.getByTestId('dashboard-menu-account')).toBeTruthy();
    expect(screen.getByTestId('dashboard-menu-help')).toBeTruthy();
    expect(screen.getByTestId('dashboard-menu-logout')).toBeTruthy();
  });

  it('navigates to DashboardStats from the Statistics row', async () => {
    const navigation = await renderMenu();
    await fireEvent.press(screen.getByTestId('dashboard-menu-stats'));
    expect(navigation.navigate).toHaveBeenCalledWith('DashboardStats');
  });

  it('leaves the screen from the close control', async () => {
    const navigation = await renderMenu();
    await fireEvent.press(screen.getByTestId('dashboard-menu-close'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('marks rows without a feature as disabled and coming soon', async () => {
    await renderMenu();
    expect(screen.getAllByText('coming soon')).toHaveLength(3);
    expect(screen.getByTestId('dashboard-menu-account').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });
});
