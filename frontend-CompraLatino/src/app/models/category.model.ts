export interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

/** Minimal category data embedded in other entities (e.g. Product). */
export type CategoryRef = Pick<Category, 'id' | 'name'>;
