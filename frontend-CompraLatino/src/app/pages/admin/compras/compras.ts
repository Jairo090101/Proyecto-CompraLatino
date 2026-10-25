import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { AdminOrderStatus, ORDER_STATUS_LABEL } from '../../../models/admin-panel.model';
import { ADMIN_ORDERS, formatMoney } from '../../../mocks/admin-panel.mock';
import { downloadCsv } from '../../../shared/utils/csv';
import { normalizeText } from '../../../shared/utils/text';
import { KpiCard } from '../components/kpi-card/kpi-card';

type OrderFilter = 'todos' | AdminOrderStatus;

@Component({
  selector: 'app-admin-compras',
  imports: [KpiCard],
  templateUrl: './compras.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminCompras {
  protected readonly orders = ADMIN_ORDERS;
  protected readonly labels = ORDER_STATUS_LABEL;
  protected readonly money = formatMoney;
  protected readonly delivered = ADMIN_ORDERS.filter((order) => order.status === 'entregado').length;
  protected readonly moving = ADMIN_ORDERS.filter(
    (order) => order.status === 'en-transito' || order.status === 'procesando',
  ).length;
  protected readonly cancelled = ADMIN_ORDERS.filter((order) => order.status === 'cancelado').length;

  protected readonly query = signal('');
  protected readonly status = signal<OrderFilter>('todos');
  protected readonly openId = signal<string | null>(null);
  protected readonly filters: { id: OrderFilter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'entregado', label: 'Entregado' },
    { id: 'en-transito', label: 'En tránsito' },
    { id: 'procesando', label: 'Procesando' },
    { id: 'cancelado', label: 'Cancelado' },
  ];

  protected readonly filtered = computed(() => {
    const term = normalizeText(this.query());
    const status = this.status();
    return this.orders.filter(
      (order) =>
        (status === 'todos' || order.status === status) &&
        (!term || normalizeText(`${order.id} ${order.customer} ${order.product}`).includes(term)),
    );
  });

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected toggle(id: string): void {
    this.openId.update((current) => (current === id ? null : id));
  }

  protected statusClass(status: AdminOrderStatus): string {
    const map: Record<AdminOrderStatus, string> = {
      entregado: 'badge badge-success',
      'en-transito': 'badge badge-warning',
      procesando: 'badge badge-info',
      cancelado: 'badge badge-danger',
    };
    return map[status];
  }

  protected exportCsv(): void {
    downloadCsv(
      'compras-compralatino.csv',
      ['Orden', 'Cliente', 'Email', 'Producto', 'Fecha', 'Total MXN', 'Estado'],
      this.filtered().map((order) => [
        order.id,
        order.customer,
        order.email,
        order.product,
        order.dateLabel,
        String(order.totalMxn),
        ORDER_STATUS_LABEL[order.status],
      ]),
    );
  }
}
