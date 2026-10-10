import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-mis-compras',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css',
})
export class MisCompras {
  readonly orders = inject(OrdersService);
  private readonly route = inject(ActivatedRoute);
  data: Order[] = [];
  loading = true;
  error = '';
  readonly highlightedId = Number(this.route.snapshot.queryParamMap.get('nuevo'));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.orders.list().subscribe({
      next: (response) => this.data = response.data,
      error: () => {
        this.error = 'No se pudieron cargar tus compras. Intenta nuevamente.';
        this.loading = false;
      },
      complete: () => this.loading = false,
    });
  }

  statusLabel(status: string): string {
    return ({ submitted: 'Enviado a YAuctions', pending: 'Pendiente', failed: 'Fallido' }[status] ?? status);
  }

  statusClass(status: string): string {
    return status === 'submitted' ? 'badge-success' : status === 'failed' ? 'badge-danger' : 'badge-warning';
  }
}
