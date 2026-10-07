import { Category } from '../models/category.model';
import { unsplash as img } from './mock-utils';

export const CATEGORIES: Category[] = [
  { id: 'electronica', name: 'Electrónica', image: img('1518770660439-4636190af475'), itemCount: 12400 },
  { id: 'automoviles', name: 'Automóviles', image: img('1542282088-fe8426682b8f'), itemCount: 8320 },
  { id: 'coleccionables', name: 'Coleccionables', image: img('1566576912321-d58ddd7a6088'), itemCount: 5870 },
  { id: 'moda', name: 'Moda', image: img('1445205170230-053b83016050'), itemCount: 9600 },
  { id: 'hogar', name: 'Hogar', image: img('1555041469-a586c61ea9bc'), itemCount: 7450 },
  { id: 'juguetes-anime', name: 'Juguetes & Anime', image: img('1622979135225-d2ba269cf1ac'), itemCount: 6200 },
];
