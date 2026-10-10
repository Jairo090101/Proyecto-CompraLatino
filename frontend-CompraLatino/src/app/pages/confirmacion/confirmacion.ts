import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-confirmacion',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './confirmacion.html',
})
export class Confirmacion {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrdersService);
  private readonly router = inject(Router);
  error = '';
  submit(): void {
    this.orders.create(this.cart.items().map((item) => ({ product_id: item.productId, quantity: item.quantity }))).subscribe({
      next: () => { this.cart.clear(); this.router.navigateByUrl('/mis-compras'); },
      error: () => { this.error = 'No se pudo crear el pedido. Intenta nuevamente.'; },
    });
  }
}
