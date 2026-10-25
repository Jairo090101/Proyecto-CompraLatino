import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ADMIN_USERS } from '../../../mocks/admin-panel.mock';
import { AdminUserStatus } from '../../../models/admin-panel.model';
import { downloadCsv } from '../../../shared/utils/csv';
import { normalizeText } from '../../../shared/utils/text';
import { KpiCard } from '../components/kpi-card/kpi-card';

type UserFilter = 'todos' | AdminUserStatus;

@Component({
  selector: 'app-admin-usuarios',
  imports: [KpiCard],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUsuarios {
  protected readonly users = computed(() => ADMIN_USERS);
  protected readonly activeCount = computed(() => this.users().filter((user) => user.status === 'activo').length);
  protected readonly suspendedCount = computed(() => this.users().length - this.activeCount());
  protected readonly query = signal('');
  protected readonly status = signal<UserFilter>('todos');
  protected readonly filters: { id: UserFilter; label: string }[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'activo', label: 'Activo' },
    { id: 'suspendido', label: 'Suspendido' },
  ];

  protected readonly filtered = computed(() => {
    const term = normalizeText(this.query());
    const status = this.status();
    return this.users().filter(
      (user) =>
        (status === 'todos' || user.status === status) &&
        (!term || normalizeText(`${user.name} ${user.email}`).includes(term)),
    );
  });

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected exportCsv(): void {
    downloadCsv(
      'usuarios-compralatino.csv',
      ['ID', 'Nombre', 'Email', 'País', 'Órdenes', 'Estado'],
      this.filtered().map((user) => [user.id, user.name, user.email, user.country, String(user.orders), user.status]),
    );
  }
}
