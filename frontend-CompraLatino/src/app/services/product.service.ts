import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { CATEGORIES } from '../mocks/categories.mock';
import { HOME_STATS } from '../mocks/home.mock';
import { PRODUCTS } from '../mocks/products.mock';
import { REVIEWS } from '../mocks/reviews.mock';
import { Category } from '../models/category.model';
import { HomeStat } from '../models/home-stat.model';
import { Product } from '../models/product.model';
import { Review } from '../models/review.model';
import { API_URL } from './api.config';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  category: { id: string; name: string };
  price_usd: string;
  original_price_usd?: string | null;
  status: Product['status'];
  image?: string | null;
  condition?: string | null;
  featured: boolean;
}

interface ApiCategory {
  id: string;
  name: string;
  image?: string | null;
  item_count: number;
}

interface ApiPage<T> {
  data: T[];
}

/**
 * Product catalog data source backed by the Laravel API.
 * If the API is unreachable or fails, every catalog method falls back to the local mocks
 * so the storefront keeps rendering a basic layout.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<ApiPage<ApiProduct>>(`${API_URL}/products`).pipe(
      map(({ data }) => data.map((product) => this.mapProduct(product))),
      catchError(() => of(PRODUCTS)),
    );
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${API_URL}/products/${id}`).pipe(
      map((product) => this.mapProduct(product)),
      catchError(() => of(PRODUCTS.find((p) => p.id === id))),
    );
  }

  getFeaturedProducts(limit = 4): Observable<Product[]> {
    return this.http
      .get<ApiPage<ApiProduct>>(`${API_URL}/products`, { params: { featured: 1, per_page: limit } })
      .pipe(
        map(({ data }) => data.map((product) => this.mapProduct(product))),
        catchError(() => of(PRODUCTS.filter((p) => p.featured).slice(0, limit))),
      );
  }

  /** Same-category products first, then others, excluding the current one. */
  getRelatedProducts(product: Product, limit = 4): Observable<Product[]> {
    return this.http
      .get<ApiPage<ApiProduct>>(`${API_URL}/products`, {
        params: { category: product.category.id, per_page: limit + 1 },
      })
      .pipe(
        map(({ data }) =>
          data
            .filter((item) => item.id !== product.id)
            .slice(0, limit)
            .map((item) => this.mapProduct(item)),
        ),
        catchError(() => of(this.mockRelated(product, limit))),
      );
  }

  getProductReviews(_productId: number): Observable<Review[]> {
    return of(REVIEWS);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<ApiCategory[]>(`${API_URL}/categories`).pipe(
      map((categories) => categories.map((category) => this.mapCategory(category))),
      catchError(() => of(CATEGORIES)),
    );
  }

  getHomeStats(): Observable<HomeStat[]> {
    return of(HOME_STATS);
  }

  private mockRelated(product: Product, limit: number): Product[] {
    const others = PRODUCTS.filter((p) => p.id !== product.id);
    const sameCategory = others.filter((p) => p.category.id === product.category.id);
    const rest = others.filter((p) => p.category.id !== product.category.id);
    return [...sameCategory, ...rest].slice(0, limit);
  }

  /** The API has no images for categories yet; reuse the mock image with the same id. */
  private mapCategory(category: ApiCategory): Category {
    return {
      id: category.id,
      name: category.name,
      image: category.image ?? this.mockCategoryImage(category.id),
      itemCount: category.item_count,
    };
  }

  private mapProduct(product: ApiProduct): Product {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.category,
      priceUsd: Number(product.price_usd),
      originalPriceUsd: product.original_price_usd ? Number(product.original_price_usd) : undefined,
      status: product.status,
      image: product.image ?? this.mockCategoryImage(product.category.id),
      gallery: [],
      condition: product.condition ?? 'Nuevo',
      rating: 0,
      reviewCount: 0,
      seller: { name: 'CompraLatino', rating: 0, sales: 0 },
      specs: [],
      featured: product.featured,
    };
  }

  private mockCategoryImage(categoryId: string): string {
    return CATEGORIES.find((c) => c.id === categoryId)?.image ?? '';
  }
}
