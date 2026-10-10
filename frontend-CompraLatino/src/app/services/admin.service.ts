import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminMetrics, AdminProduct, AdminProductPage } from '../models/admin.model';
import { API_URL } from './api.config';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getMetrics(): Observable<AdminMetrics> {
    return this.http.get<AdminMetrics>(`${API_URL}/admin/metrics`);
  }

  getProducts(search = '', page = 1): Observable<AdminProductPage> {
    const params = new HttpParams({ fromObject: { search, page, per_page: 15 } });
    return this.http.get<AdminProductPage>(`${API_URL}/admin/products`, { params });
  }

  createProduct(product: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${API_URL}/admin/products`, product);
  }

  updateProduct(id: number, product: Partial<AdminProduct>): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${API_URL}/admin/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${API_URL}/admin/products/${id}`);
  }
}
