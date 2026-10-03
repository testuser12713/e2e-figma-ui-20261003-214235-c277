import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { AppDataProvider } from '../src/store/AppDataContext';
import TimeScreen from '../src/screens/TimeScreen';
import TimeDetailScreen from '../src/screens/TimeDetailScreen';

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

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: View };
});

jest.setTimeout(30000);

function makeNavigation(overrides: Record<string, unknown> = {}) {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    canGoBack: () => false,
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

function renderTimeScreen(navigation: ReturnType<typeof makeNavigation>) {
  return render(
    <AppDataProvider>
      <TimeScreen
        navigation={navigation as never}
        route={{ key: 'Time-key', name: 'Time' } as never}
      />
    </AppDataProvider>,
  );
}

function renderTimeDetail(
  navigation: ReturnType<typeof makeNavigation>,
  appointmentId: string,
) {
  return render(
    <AppDataProvider>
      <TimeDetailScreen
        navigation={navigation as never}
        route={
          {
            key: 'TimeDetail-key',
            name: 'TimeDetail',
            params: { appointmentId },
          } as never
        }
      />
    </AppDataProvider>,
  );
}

describe('TimeScreen (Time Management list)', () => {
  it('lists upcoming appointments with title and formatted date', async () => {
    await renderTimeScreen(makeNavigation());
    expect(screen.getByTestId('screen-time')).toBeTruthy();
    expect(screen.getByText('Dentist - Clara Odding')).toBeTruthy();
    expect(screen.getByText('09/04/2020')).toBeTruthy();
    expect(screen.getByText('Health · 10 AM')).toBeTruthy();
  });

  it('shows past appointments after selecting the Past tab', async () => {
    await renderTimeScreen(makeNavigation());
    await fireEvent.press(screen.getByTestId('time-tab-past'));
    expect(screen.getByText('Gym Session')).toBeTruthy();
    expect(screen.queryByText('Dentist - Clara Odding')).toBeNull();
  });

  it('filters the list through the search field', async () => {
    await renderTimeScreen(makeNavigation());
    await fireEvent.changeText(screen.getByTestId('time-search-input'), 'Cardio');
    expect(screen.getByText('Cardiologist - Steven Pauliner')).toBeTruthy();
    expect(screen.queryByText('Dentist - Clara Odding')).toBeNull();
  });

  it('opens the detail view for a tapped row', async () => {
    const navigation = makeNavigation();
    await renderTimeScreen(navigation);
    await fireEvent.press(screen.getByTestId('time-row-ap-2001'));
    expect(navigation.navigate).toHaveBeenCalledWith('TimeDetail', { appointmentId: 'ap-2001' });
  });

  it('opens the add form from the floating add button and the add button', async () => {
    const navigation = makeNavigation();
    await renderTimeScreen(navigation);
    await fireEvent.press(screen.getByTestId('time-fab-add'));
    await fireEvent.press(screen.getByTestId('time-add-appointment'));
    expect(navigation.navigate).toHaveBeenCalledWith('AddAppointment');
    expect(navigation.navigate).toHaveBeenCalledTimes(2);
  });

  it('marks unwired controls as disabled', async () => {
    await renderTimeScreen(makeNavigation());
    expect(screen.getByTestId('time-modify-ap-2001').props.accessibilityState.disabled).toBe(true);
    expect(screen.getByTestId('time-overview').props.accessibilityState.disabled).toBe(true);
  });
});

describe('TimeDetailScreen (Time Management - 2)', () => {
  it('renders the passed appointment with its category and time range', async () => {
    await renderTimeDetail(makeNavigation(), 'ap-2001');
    expect(screen.getByTestId('screen-time-detail')).toBeTruthy();
    expect(screen.getByText('Dentist - Clara Odding')).toBeTruthy();
    expect(screen.getByText('Health')).toBeTruthy();
    expect(screen.getByText('10AM - 11AM')).toBeTruthy();
    expect(screen.getByTestId('time-detail-card-ap-2001')).toBeTruthy();
  });

  it('pops the screen from the back chevron', async () => {
    const navigation = makeNavigation();
    await renderTimeDetail(navigation, 'ap-2001');
    await fireEvent.press(screen.getByTestId('time-detail-back'));
    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('falls back to an empty state for an unknown appointment', async () => {
    await renderTimeDetail(makeNavigation(), 'missing-id');
    expect(screen.getByTestId('screen-time-detail')).toBeTruthy();
    expect(screen.getByText('No appointments on this day.')).toBeTruthy();
  });
});
