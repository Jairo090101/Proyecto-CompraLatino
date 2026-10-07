import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

/** Reusable -/+ quantity control (detail page now, cart page later). Supports [(value)]. */
@Component({
  selector: 'app-quantity-stepper',
  templateUrl: './quantity-stepper.html',
  styleUrl: './quantity-stepper.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityStepper {
  readonly value = model(1);
  readonly min = input(1);
  readonly max = input(99);
  readonly disabled = input(false);

  decrease(): void {
    this.value.update((v) => Math.max(this.min(), v - 1));
  }

  increase(): void {
    this.value.update((v) => Math.min(this.max(), v + 1));
  }
}
