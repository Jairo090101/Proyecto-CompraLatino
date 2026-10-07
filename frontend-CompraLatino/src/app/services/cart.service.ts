import { Injectable, computed, signal } from '@angular/core';

import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'compralatino.cart';
const MAX_QUANTITY = 99;

/**
 * Client-side cart persisted in localStorage.
 * Signals keep the navbar badge and cart views in sync without manual subscriptions.
 * When the backend is ready, mutations can be mirrored to the Laravel API here.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>(this.load());

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() => this.itemsState().reduce((sum, i) => sum + i.quantity, 0));
  readonly subtotal = computed(() =>
    this.itemsState().reduce((sum, i) => sum + i.priceUsd * i.quantity, 0),
  );

  add(product: Product, quantity = 1): void {
    this.itemsState.update((items) => {
      const existing = items.find((i) => i.productId === product.id);
      if (existing) {
        return items.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY) }
            : i,
        );
      }
      return [
        ...items,
        {
          productId: product.id,
          name: product.name,
          image: product.image,
          categoryName: product.category.name,
          priceUsd: product.priceUsd,
          quantity: Math.min(quantity, MAX_QUANTITY),
        },
      ];
    });
    this.persist();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.remove(productId);
      return;
    }
    this.itemsState.update((items) =>
      items.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, MAX_QUANTITY) } : i,
      ),
    );
    this.persist();
  }

  remove(productId: number): void {
    this.itemsState.update((items) => items.filter((i) => i.productId !== productId));
    this.persist();
  }

  clear(): void {
    this.itemsState.set([]);
    this.persist();
  }

  private load(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  }

  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsState()));
    } catch {
      // Storage may be unavailable (private mode / quota); the cart still works in memory.
    }
  }
}
