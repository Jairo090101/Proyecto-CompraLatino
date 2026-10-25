import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ADMIN_REPORTS } from '../../../mocks/admin-panel.mock';
import { downloadCsv } from '../../../shared/utils/csv';
import { KpiCard } from '../components/kpi-card/kpi-card';

@Component({
  selector: 'app-admin-reportes',
  imports: [KpiCard],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReportes {
  protected readonly reports = ADMIN_REPORTS;
  protected readonly openId = signal<string | null>(null);

  protected toggle(id: string): void {
    this.openId.update((current) => (current === id ? null : id));
  }

  protected exportReport(id: string): void {
    const report = this.reports.find((item) => item.id === id);
    if (!report) {
      return;
    }
    downloadCsv(
      `${report.id}-compralatino.csv`,
      ['Reporte', 'Periodo', 'Resumen'],
      [[report.title, report.period, report.summary]],
    );
  }
}
