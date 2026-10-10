import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api.config';

export interface Order {
  id: number; status: string; subtotal: string; commission: string; total: string;
  created_at: string;
  yauctions_reference?: string | null;
  items: Array<{
    product_name: string;
    quantity: number;
    unit_price: string;
    line_total: string;
    product?: { image?: string | null } | null;
  }>;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly http = inject(HttpClient);
  list() { return this.http.get<{ data: Order[] }>(`${API_URL}/orders`); }
  create(items: Array<{ product_id: number; quantity: number }>, idempotencyKey: string) {
    return this.http.post<Order>(
      `${API_URL}/orders`,
      { items },
      { headers: { 'Idempotency-Key': idempotencyKey } },
    );
  }
}
