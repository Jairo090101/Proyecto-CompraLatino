import { CategoryRef } from './category.model';

export type ProductStatus = 'disponible' | 'subasta' | 'agotado';

export type ProductBadge = 'Popular' | 'Oferta' | 'Nuevo' | 'Top' | 'Hot';

export interface Seller {
  name: string;
  rating: number;
  sales: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: CategoryRef;
  priceUsd: number;
  /** Price before discount; when present the UI shows it struck through. */
  originalPriceUsd?: number;
  status: ProductStatus;
  image: string;
  /** Additional images for the detail gallery (main image is always first). */
  gallery?: string[];
  condition: string;
  rating: number;
  reviewCount: number;
  seller: Seller;
  specs: ProductSpec[];
  badge?: ProductBadge;
  featured?: boolean;
}
