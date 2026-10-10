import { Component, inject, signal } from '@angular/core';
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
  readonly data = signal<Order[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly highlightedId = Number(this.route.snapshot.queryParamMap.get('nuevo'));

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.orders.list().subscribe({
      next: (response) => this.data.set(response.data),
      error: () => {
        this.error.set('No se pudieron cargar tus compras. Intenta nuevamente.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false),
    });
  }

  statusLabel(status: string): string {
    return ({ submitted: 'Enviado a YAuctions', pending: 'Pendiente', failed: 'Fallido' }[status] ?? status);
  }

  statusClass(status: string): string {
    return status === 'submitted' ? 'badge-success' : status === 'failed' ? 'badge-danger' : 'badge-warning';
  }
}
