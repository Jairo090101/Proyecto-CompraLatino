import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CATEGORIES } from '../mocks/categories.mock';
import { HOME_STATS } from '../mocks/home.mock';
import { PRODUCTS } from '../mocks/products.mock';
import { REVIEWS } from '../mocks/reviews.mock';
import { Category } from '../models/category.model';
import { HomeStat } from '../models/home-stat.model';
import { Product } from '../models/product.model';
import { Review } from '../models/review.model';

/**
 * Product catalog data source.
 * Currently backed by local mocks; each method returns an Observable so it can be
 * swapped for HttpClient calls to the Laravel REST API without touching components.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  getProducts(): Observable<Product[]> {
    return of(PRODUCTS);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(PRODUCTS.find((p) => p.id === id));
  }

  getFeaturedProducts(limit = 4): Observable<Product[]> {
    return of(PRODUCTS.filter((p) => p.featured).slice(0, limit));
  }

  /** Same-category products first, then others, excluding the current one. */
  getRelatedProducts(product: Product, limit = 4): Observable<Product[]> {
    const others = PRODUCTS.filter((p) => p.id !== product.id);
    const sameCategory = others.filter((p) => p.category.id === product.category.id);
    const rest = others.filter((p) => p.category.id !== product.category.id);
    return of([...sameCategory, ...rest].slice(0, limit));
  }

  getProductReviews(_productId: number): Observable<Review[]> {
    return of(REVIEWS);
  }

  getCategories(): Observable<Category[]> {
    return of(CATEGORIES);
  }

  getHomeStats(): Observable<HomeStat[]> {
    return of(HOME_STATS);
  }
}
