import type { ImageSourcePropType } from 'react-native';

export interface Category {
  id: string;
  label: string;
  image: ImageSourcePropType;
}

export interface Transaction {
  id: string;
  title: string;
  categoryId: string;
  date: string;
  amount: number;
}

export type NewTransaction = Omit<Transaction, 'id'>;

export interface Appointment {
  id: string;
  title: string;
  categoryId: string;
  date: string;
  time: string;
  durationMin: number;
  status: 'upcoming' | 'past';
}

export type NewAppointment = Omit<Appointment, 'id' | 'status'>;

export interface UserProfile {
  name: string;
  location: string;
  avatar: ImageSourcePropType;
}

export interface MonthlyStatsPoint {
  month: string;
  value: number;
}

export interface MonthlyStats {
  since: string;
  range: string;
  days: number;
  points: MonthlyStatsPoint[];
}
