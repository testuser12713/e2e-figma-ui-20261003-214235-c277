import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  Appointment,
  Category,
  MonthlyStats,
  NewAppointment,
  NewTransaction,
  Transaction,
  UserProfile,
} from '../data/types';
import { categories as seedCategories } from '../data/categories';
import { transactions as seedTransactions } from '../data/transactions';
import { appointments as seedAppointments } from '../data/appointments';
import { statistics as seedStatistics } from '../data/statistics';
import { profile as seedProfile } from '../data/profile';

export interface AppDataContextValue {
  profile: UserProfile;
  transactions: Transaction[];
  appointments: Appointment[];
  categories: Category[];
  monthlyStats: MonthlyStats;
  addTransaction(input: NewTransaction): void;
  addAppointment(input: NewAppointment): void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

let idCounter = 0;

function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);

  const addTransaction = useCallback((input: NewTransaction) => {
    setTransactions((previous) => [{ ...input, id: nextId('tx') }, ...previous]);
  }, []);

  const addAppointment = useCallback((input: NewAppointment) => {
    setAppointments((previous) => [{ ...input, id: nextId('ap'), status: 'upcoming' }, ...previous]);
  }, []);

  const value = useMemo<AppDataContextValue>(
    () => ({
      profile: seedProfile,
      transactions,
      appointments,
      categories: seedCategories,
      monthlyStats: seedStatistics,
      addTransaction,
      addAppointment,
    }),
    [transactions, appointments, addTransaction, addAppointment],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

export default AppDataContext;
