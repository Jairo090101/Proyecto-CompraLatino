export type CatalogSort = 'popular' | 'recent' | 'price-asc' | 'price-desc' | 'rating';

export type CatalogView = 'grid' | 'list';

export const CATALOG_SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: 'popular', label: 'Más populares' },
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor valorados' },
];
