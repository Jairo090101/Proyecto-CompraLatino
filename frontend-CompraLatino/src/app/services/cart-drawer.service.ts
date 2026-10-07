import { Injectable, signal } from '@angular/core';

/**
 * UI state of the slide-in cart panel.
 * Kept apart from CartService so cart data logic stays independent from presentation.
 */
@Injectable({ providedIn: 'root' })
export class CartDrawerService {
  private readonly openState = signal(false);

  readonly isOpen = this.openState.asReadonly();

  open(): void {
    this.openState.set(true);
  }

  close(): void {
    this.openState.set(false);
  }
}
