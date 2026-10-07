import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { COMMISSION_RATE, discountPercent, priceBreakdown } from '../../../../shared/utils/pricing';

/** Price box: unit price, discount and the commission breakdown for the selected quantity. */
@Component({
  selector: 'app-price-summary',
  imports: [CurrencyPipe],
  templateUrl: './price-summary.html',
  styleUrl: './price-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceSummary {
  readonly price = input.required<number>();
  readonly originalPrice = input<number | undefined>(undefined);
  readonly quantity = input(1);

  protected readonly commissionPercent = COMMISSION_RATE * 100;
  protected readonly discount = computed(() => discountPercent(this.price(), this.originalPrice()));
  protected readonly breakdown = computed(() => priceBreakdown(this.price(), this.quantity()));
}
