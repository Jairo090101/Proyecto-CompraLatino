import { Component, inject, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CardPaymentRequest } from '../../models/payment.model';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { PaymentService } from '../../services/payment.service';
import { apiErrorMessage } from '../../services/api-error';
import { CartLine } from '../../shared/components/cart-line/cart-line';
import { COMMISSION_RATE, priceBreakdown } from '../../shared/utils/pricing';
import { CardPaymentForm } from './components/card-payment-form/card-payment-form';

@Component({
  selector: 'app-confirmacion',
  imports: [RouterLink, CurrencyPipe, CartLine, CardPaymentForm],
  templateUrl: './confirmacion.html',
  styleUrl: './confirmacion.css',
})
export class Confirmacion {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly payment = inject(PaymentService);
  private readonly router = inject(Router);
  private readonly cardForm = viewChild(CardPaymentForm);
  readonly error = signal('');
  readonly loading = signal(false);
  readonly totals = () => priceBreakdown(this.cart.subtotal());
  readonly commissionPercent = COMMISSION_RATE * 100;
  private readonly idempotencyKey = crypto.randomUUID();

  updateQuantity(productId: number, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }

  pay(card: CardPaymentRequest): void {
    if (!this.cart.items().length || this.loading()) return;
    this.error.set('');
    this.loading.set(true);
    const items = this.cart.items().map((item) => ({ product_id: item.productId, quantity: item.quantity }));
    this.payment.authorize(card, this.totals().total).subscribe((result) => {
      if (!result.approved) {
        this.error.set(result.message);
        if (result.reason === 'rejected') this.cardForm()?.clearSensitive();
        this.loading.set(false);
        return;
      }
      this.placeOrder(items);
    });
  }

  private placeOrder(items: Array<{ product_id: number; quantity: number }>): void {
    this.orders.create(items, this.idempotencyKey).subscribe({
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
