import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { CartLine } from '../../shared/components/cart-line/cart-line';
import { COMMISSION_RATE, priceBreakdown } from '../../shared/utils/pricing';
import { apiErrorMessage } from '../../services/api-error';

@Component({
  selector: 'app-confirmacion',
  imports: [RouterLink, CurrencyPipe, CartLine],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css',
})
export class Confirmacion {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly totals = () => priceBreakdown(this.cart.subtotal());
  readonly commissionPercent = COMMISSION_RATE * 100;
  private readonly idempotencyKey = crypto.randomUUID();

  updateQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  submit(): void {
    if (!this.cart.items().length || this.loading()) return;
    this.error.set('');
    this.loading.set(true);
    this.orders.create(
      this.cart.items().map((item) => ({ product_id: item.productId, quantity: item.quantity })),
      this.idempotencyKey,
    ).subscribe({
      next: (order) => {
        this.cart.clear();
        this.router.navigate(['/mis-compras'], { queryParams: { nuevo: order.id } });
      },
      error: (error) => {
        this.error.set(
          error.status === 422
            ? 'Algún producto ya no está disponible. Revisa tu carrito.'
            : apiErrorMessage(error, 'No se pudo crear el pedido. Intenta nuevamente.'),
        );
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }
}
