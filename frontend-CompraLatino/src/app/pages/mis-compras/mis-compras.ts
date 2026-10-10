import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-mis-compras',
  imports: [CurrencyPipe],
  templateUrl: './mis-compras.html',
})
export class MisCompras {
  readonly orders = inject(OrdersService);
  data: Order[] = [];
  ngOnInit(): void { this.orders.list().subscribe((response) => this.data = response.data); }
}
