import type { Transaction } from './types';

export const transactions: Transaction[] = [
  {
    id: 'tx-1001',
    title: 'Spend On Fun Mall Cinema',
    categoryId: 'movie',
    date: '2020-04-02',
    amount: 23.0,
  },
  {
    id: 'tx-1002',
    title: 'Spend On Starbucks',
    categoryId: 'food',
    date: '2020-04-02',
    amount: 13.0,
  },
  {
    id: 'tx-1003',
    title: 'Spend On Super Market',
    categoryId: 'shopping',
    date: '2020-04-01',
    amount: 43.0,
  },
  {
    id: 'tx-1004',
    title: 'Spend On Super Market',
    categoryId: 'shopping',
    date: '2020-03-29',
    amount: 25.0,
  },
  {
    id: 'tx-1005',
    title: 'Rent April',
    categoryId: 'home',
    date: '2020-03-28',
    amount: 780.0,
  },
  {
    id: 'tx-1006',
    title: 'Train Ticket Luxembourg',
    categoryId: 'travel',
    date: '2020-03-26',
    amount: 56.5,
  },
  {
    id: 'tx-1007',
    title: 'Pharmacy Refill',
    categoryId: 'health',
    date: '2020-03-24',
    amount: 18.4,
  },
  {
    id: 'tx-1008',
    title: 'Dinner With Friends',
    categoryId: 'food',
    date: '2020-03-22',
    amount: 64.3,
  },
  {
    id: 'tx-1009',
    title: 'Electricity Bill',
    categoryId: 'home',
    date: '2020-03-20',
    amount: 92.15,
  },
  {
    id: 'tx-1010',
    title: 'Book Store',
    categoryId: 'shopping',
    date: '2020-03-18',
    amount: 34.99,
  },
];

export default transactions;
