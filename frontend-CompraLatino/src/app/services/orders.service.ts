import { Injectable, signal } from '@angular/core';

import { CartItem } from '../models/cart-item.model';
import { Order } from '../models/order.model';

const STORAGE_KEY = 'compralatino.orders';

/** Purchases saved in the browser, shown later in Mis Compras for that email. */
@Injectable({ providedIn: 'root' })
export class OrdersService {
  private readonly ordersState = signal<Order[]>(this.read());

  readonly orders = this.ordersState.asReadonly();

  forEmail(email: string): Order[] {
    return this.ordersState().filter((order) => order.email === email);
  }

  place(email: string, items: CartItem[], total: number): Order {
    const order: Order = {
      id: `CL-${Date.now().toString().slice(-6)}`,
      email,
      createdAt: new Date().toISOString(),
      total,
      lines: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        priceUsd: item.priceUsd,
        image: item.image,
      })),
    };
    this.ordersState.update((orders) => [order, ...orders]);
    this.persist();
    return order;
  }

  private read(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Order[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.ordersState()));
    } catch {
      // History stays in memory for this tab if storage is blocked.
    }
  }
}
