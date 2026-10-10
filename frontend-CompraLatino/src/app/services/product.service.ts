import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { HOME_STATS } from '../mocks/home.mock';
import { REVIEWS } from '../mocks/reviews.mock';
import { Category } from '../models/category.model';
import { HomeStat } from '../models/home-stat.model';
import { Product } from '../models/product.model';
import { Review } from '../models/review.model';
import { API_URL } from './auth.service';

interface ApiProduct {
  id: number; name: string; description: string; category: { id: string; name: string };
  price_usd: string; original_price_usd?: string; status: Product['status']; image?: string;
  condition?: string; featured: boolean;
}

/**
 * Product catalog data source.
 * Currently backed by local mocks; each method returns an Observable so it can be
 * swapped for HttpClient calls to the Laravel REST API without touching components.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<{ data: ApiProduct[] }>(`${API_URL}/products`).pipe(map(({ data }) => data.map((product) => this.mapProduct(product))));
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.http.get<ApiProduct>(`${API_URL}/products/${id}`).pipe(map((product) => this.mapProduct(product)));
  }

  getFeaturedProducts(limit = 4): Observable<Product[]> {
    return this.http.get<{ data: ApiProduct[] }>(`${API_URL}/products?featured=1&per_page=${limit}`).pipe(map(({ data }) => data.map((product) => this.mapProduct(product))));
  }

  /** Same-category products first, then others, excluding the current one. */
  getRelatedProducts(product: Product, limit = 4): Observable<Product[]> {
    return this.http.get<{ data: ApiProduct[] }>(`${API_URL}/products?category=${product.category.id}&per_page=${limit}`).pipe(map(({ data }) => data.filter((item) => item.id !== product.id).map((item) => this.mapProduct(item))));
  }

  getProductReviews(_productId: number): Observable<Review[]> {
    return of(REVIEWS);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${API_URL}/categories`);
  }

  getHomeStats(): Observable<HomeStat[]> {
    return of(HOME_STATS);
  }

  private mapProduct(product: ApiProduct): Product {
    return {
      id: product.id, name: product.name, description: product.description, category: product.category,
      priceUsd: Number(product.price_usd), originalPriceUsd: product.original_price_usd ? Number(product.original_price_usd) : undefined,
      status: product.status, image: product.image ?? '', gallery: [], condition: product.condition ?? 'Nuevo',
      rating: 0, reviewCount: 0, seller: { name: 'CompraLatino', rating: 0, sales: 0 }, specs: [], featured: product.featured,
    };
  }
}
