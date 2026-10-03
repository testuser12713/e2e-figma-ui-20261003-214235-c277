import type { Appointment } from './types';

export const appointments: Appointment[] = [
  {
    id: 'ap-2001',
    title: 'Dentist - Clara Odding',
    categoryId: 'health',
    date: '2020-04-09',
    time: '10:00',
    durationMin: 60,
    status: 'upcoming',
  },
  {
    id: 'ap-2002',
    title: 'Cardiologist - Steven Pauliner',
    categoryId: 'health',
    date: '2020-04-21',
    time: '12:00',
    durationMin: 45,
    status: 'upcoming',
  },
  {
    id: 'ap-2003',
    title: 'Dermatologist - Noemi Shinte',
    categoryId: 'health',
    date: '2020-06-18',
    time: '15:00',
    durationMin: 30,
    status: 'upcoming',
  },
  {
    id: 'ap-2004',
    title: 'Gym Session',
    categoryId: 'home',
    date: '2020-04-18',
    time: '10:00',
    durationMin: 60,
    status: 'past',
  },
  {
    id: 'ap-2005',
    title: 'Team Meeting',
    categoryId: 'home',
    date: '2020-04-17',
    time: '11:00',
    durationMin: 90,
    status: 'past',
  },
  {
    id: 'ap-2006',
    title: 'Weekend Trip Planning',
    categoryId: 'travel',
    date: '2020-04-11',
    time: '09:30',
    durationMin: 120,
    status: 'past',
  },
  {
    id: 'ap-2007',
    title: 'Birthday Dinner',
    categoryId: 'food',
    date: '2020-05-02',
    time: '19:00',
    durationMin: 180,
    status: 'upcoming',
  },
];

export default appointments;
