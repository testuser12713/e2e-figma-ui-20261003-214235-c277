import type { Category } from './types';

export const categories: Category[] = [
  {
    id: 'home',
    label: 'Home',
    image: require('../../design/figma/assets/illustration-53x53.png'),
  },
  {
    id: 'food',
    label: 'Food',
    image: require('../../design/figma/assets/illustration-53x53-2.png'),
  },
  {
    id: 'travel',
    label: 'Travel',
    image: require('../../design/figma/assets/illustration-53x53-3.png'),
  },
  {
    id: 'shopping',
    label: 'Shopping',
    image: require('../../design/figma/assets/illustration-53x53-4.png'),
  },
  {
    id: 'movie',
    label: 'Movie',
    image: require('../../design/figma/assets/image-69x69.png'),
  },
  {
    id: 'health',
    label: 'Health',
    image: require('../../design/figma/assets/fc8cc65f046eeb0b9efb159aad932e2b.png'),
  },
];

export default categories;
