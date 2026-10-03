import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList, MainTabParamList } from './types';
import DashboardScreen from '../screens/DashboardScreen';
import MoneyScreen from '../screens/MoneyScreen';
import TimeScreen from '../screens/TimeScreen';
import DashboardMenuScreen from '../screens/DashboardMenuScreen';
import DashboardStatsScreen from '../screens/DashboardStatsScreen';
import MoneyDetailScreen from '../screens/MoneyDetailScreen';
import TimeDetailScreen from '../screens/TimeDetailScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import AddAppointmentScreen from '../screens/AddAppointmentScreen';
import { colors, fonts, shadows, tabBarHeight } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof MainTabParamList, { active: IoniconName; inactive: IoniconName }> = {
  Dashboard: { active: 'home', inactive: 'home-outline' },
  Money: { active: 'wallet', inactive: 'wallet-outline' },
  Time: { active: 'calendar', inactive: 'calendar-outline' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.fg,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          const icons = TAB_ICONS[route.name];
          return <Ionicons name={focused ? icons.active : icons.inactive} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarButtonTestID: 'tab-dashboard',
          tabBarAccessibilityLabel: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Money"
        component={MoneyScreen}
        options={{
          title: 'Money Management',
          tabBarButtonTestID: 'tab-money',
          tabBarAccessibilityLabel: 'Money Management',
        }}
      />
      <Tab.Screen
        name="Time"
        component={TimeScreen}
        options={{
          title: 'Time Management',
          tabBarButtonTestID: 'tab-time',
          tabBarAccessibilityLabel: 'Time Management',
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="DashboardMenu" component={DashboardMenuScreen} />
        <Stack.Screen name="DashboardStats" component={DashboardStatsScreen} />
        <Stack.Screen name="MoneyDetail" component={MoneyDetailScreen} />
        <Stack.Screen name="TimeDetail" component={TimeDetailScreen} />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="AddAppointment"
          component={AddAppointmentScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: tabBarHeight,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    paddingBottom: 6,
    paddingTop: 6,
    ...shadows.tabBar,
  },
  tabLabel: {
    fontFamily: fonts.aleo,
    fontSize: 7,
    lineHeight: 9,
  },
});
