import { Review } from '../models/review.model';

/** Generic sample reviews shown for any product until the API provides real ones. */
export const REVIEWS: Review[] = [
  {
    id: 1,
    author: 'María G.',
    rating: 5,
    date: '2026-09-18',
    comment: 'Llegó en 12 días a Guadalajara, perfectamente empacado. El seguimiento fue muy claro.',
  },
  {
    id: 2,
    author: 'Carlos R.',
    rating: 5,
    date: '2026-09-02',
    comment: 'Producto original y en excelente estado. Volveré a comprar por CompraLatino.',
  },
  {
    id: 3,
    author: 'Lucía P.',
    rating: 4,
    date: '2026-08-21',
    comment: 'Todo bien, solo tardó un poco más en aduana. La atención por chat fue rápida.',
  },
];
