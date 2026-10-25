import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { KpiTone } from '../../../../models/admin-panel.model';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly trend = input<string | null>(null);
  readonly trendUp = input(true);
  readonly tone = input<KpiTone>('default');
  readonly icon = input<string | null>(null);
}
