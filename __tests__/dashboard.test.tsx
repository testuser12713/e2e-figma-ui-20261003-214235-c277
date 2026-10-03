import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import DashboardScreen from '../src/screens/DashboardScreen';

jest.setTimeout(30000);

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

const navigate = jest.fn();
const parentNavigate = jest.fn();

function renderDashboard() {
  const navigation = {
    navigate,
    getParent: () => ({ navigate: parentNavigate }),
  };
  return render(
    <DashboardScreen
      navigation={navigation as never}
      route={{ key: 'Dashboard-key', name: 'Dashboard' } as never}
    />,
  );
}

describe('DashboardScreen', () => {
  beforeEach(() => {
    navigate.mockClear();
    parentNavigate.mockClear();
  });

  it('renders the frame title, search field and the four entries', async () => {
    await renderDashboard();
    expect(screen.getByText('Dashboard')).toBeTruthy();
    expect(screen.getByTestId('dashboard-search-input')).toBeTruthy();
    expect(screen.getByText('Time Management')).toBeTruthy();
    expect(screen.getByText('Money Management')).toBeTruthy();
    expect(screen.getByText('App Management')).toBeTruthy();
    expect(screen.getByText('Food Management')).toBeTruthy();
  });

  it('opens the Dashboard Menu from the menu control', async () => {
    await renderDashboard();
    await fireEvent.press(screen.getByTestId('dashboard-menu-button'));
    expect(parentNavigate).toHaveBeenCalledWith('DashboardMenu');
  });

  it('opens the Time and Money tabs from their entry cards', async () => {
    await renderDashboard();
    await fireEvent.press(screen.getByTestId('dashboard-card-time'));
    expect(navigate).toHaveBeenCalledWith('Time');

    await fireEvent.press(screen.getByTestId('dashboard-card-money'));
    expect(navigate).toHaveBeenCalledWith('Money');
  });

  it('marks the out-of-scope entries visibly as coming soon', async () => {
    await renderDashboard();
    expect(screen.getByTestId('dashboard-card-app').props.accessibilityState).toEqual({
      disabled: true,
    });
    expect(screen.getByTestId('dashboard-card-food').props.accessibilityState).toEqual({
      disabled: true,
    });
    expect(screen.getAllByText('coming soon')).toHaveLength(2);
  });

  it('filters the entries by the search query', async () => {
    await renderDashboard();
    await fireEvent.changeText(screen.getByTestId('dashboard-search-input'), 'Money');
    expect(screen.getByText('Money Management')).toBeTruthy();
    expect(screen.queryByText('Time Management')).toBeNull();
  });
});
