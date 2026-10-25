import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CATEGORY_STATS, DASHBOARD_PERIOD, MONTHLY_ORDERS, ADMIN_ORDERS, formatMoney } from '../../../mocks/admin-panel.mock';
import { KpiCard } from '../components/kpi-card/kpi-card';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboard {
  protected readonly period = DASHBOARD_PERIOD;
  protected readonly months = MONTHLY_ORDERS;
  protected readonly categories = CATEGORY_STATS;
  protected readonly recent = ADMIN_ORDERS.slice(0, 4);
  protected readonly maxOrders = Math.max(...MONTHLY_ORDERS.map((month) => month.orders));
  protected readonly maxCategory = Math.max(...CATEGORY_STATS.map((category) => category.orders));
  protected readonly money = formatMoney;
}
