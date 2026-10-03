import React from 'react';
import { Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { AppDataProvider, useAppData } from '../src/store/AppDataContext';
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

jest.setTimeout(30000);

function makeNavigation() {
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
  };
}

function Harness({ navigation }: { navigation: ReturnType<typeof makeNavigation> }) {
  const { appointments } = useAppData();
  return (
    <>
      <AddAppointmentScreen
        navigation={navigation as never}
        route={{ key: 'AddAppointment-key', name: 'AddAppointment' } as never}
      />
      <Text testID="appointment-titles">
        {appointments.map((appointment) => appointment.title).join('|')}
      </Text>
    </>
  );
}

function renderForm(navigation: ReturnType<typeof makeNavigation>) {
  return render(
    <AppDataProvider>
      <Harness navigation={navigation} />
    </AppDataProvider>,
  );
}

function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

describe('AddAppointmentScreen (Time Management - 3)', () => {
  it('renders the appointment form', async () => {
    await renderForm(makeNavigation());
    expect(screen.getByTestId('screen-add-appointment')).toBeTruthy();
    expect(screen.getByTestId('add-appointment-name')).toBeTruthy();
    expect(screen.getByTestId('add-appointment-description')).toBeTruthy();
    expect(screen.getByTestId('add-appointment-date')).toBeTruthy();
    expect(screen.getByTestId('add-appointment-submit')).toBeTruthy();
    expect(screen.getByText('Quick Adds')).toBeTruthy();
  });

  it('adds the appointment and closes without a reload', async () => {
    const navigation = makeNavigation();
    await renderForm(navigation);

    await fireEvent.changeText(screen.getByTestId('add-appointment-name'), 'Yoga Class');
    await fireEvent.press(screen.getByTestId('add-appointment-submit'));

    expect(navigation.goBack).toHaveBeenCalled();
    expect(screen.getByText(/Yoga Class/)).toBeTruthy();
  });

  it('returns to the Time screen without adding when cancelled', async () => {
    const navigation = makeNavigation();
    await renderForm(navigation);

    await fireEvent.changeText(screen.getByTestId('add-appointment-name'), 'Cancelled Entry');
    await fireEvent.press(screen.getByTestId('add-appointment-cancel'));

    expect(navigation.goBack).toHaveBeenCalled();
    expect(screen.queryByText(/Cancelled Entry/)).toBeNull();
  });

  it('picks a quick-add preset into the form', async () => {
    await renderForm(makeNavigation());

    await fireEvent.press(screen.getByTestId('add-appointment-quickadd-gym'));

    expect(screen.getByTestId('add-appointment-name').props.value).toBe('Gym');
  });

  it('selects a date through the date picker', async () => {
    const navigation = makeNavigation();
    await renderForm(navigation);

    await fireEvent.changeText(screen.getByTestId('add-appointment-name'), 'With Date');
    await fireEvent.press(screen.getByTestId('add-appointment-date'));
    await fireEvent.press(
      screen.getByTestId(`add-appointment-date-day-${todayIso()}`),
    );
    await fireEvent.press(screen.getByTestId('add-appointment-submit'));

    expect(navigation.goBack).toHaveBeenCalled();
  });

  it('shows an error and does not close when the name is empty', async () => {
    const navigation = makeNavigation();
    await renderForm(navigation);

    await fireEvent.press(screen.getByTestId('add-appointment-submit'));

    expect(screen.getByTestId('add-appointment-error')).toBeTruthy();
    expect(navigation.goBack).not.toHaveBeenCalled();
  });

  it('marks the unwired controls as disabled and coming soon', async () => {
    await renderForm(makeNavigation());

    expect(screen.getByTestId('add-appointment-filter').props.accessibilityState.disabled).toBe(
      true,
    );
    expect(
      screen.getByTestId('add-appointment-quickadd-menu-gym').props.accessibilityState.disabled,
    ).toBe(true);
    expect(screen.getAllByText('coming soon').length).toBeGreaterThan(0);
  });
});
