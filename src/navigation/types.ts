export type RootStackParamList = {
  MainTabs: undefined;
  DashboardMenu: undefined;
  DashboardStats: undefined;
  MoneyDetail: { transactionId: string };
  TimeDetail: { appointmentId: string };
  AddExpense: undefined;
  AddAppointment: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Money: undefined;
  Time: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
