import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

import { CartItem } from '../../../models/cart-item.model';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';
import { QuantityStepper } from '../quantity-stepper/quantity-stepper';

/** One product row of the cart (drawer now, purchase confirmation later). */
@Component({
  selector: 'app-cart-line',
  imports: [CurrencyPipe, ImgFallbackDirective, QuantityStepper],
  templateUrl: './cart-line.html',
  styleUrl: './cart-line.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartLine {
  readonly item = input.required<CartItem>();
  readonly removable = input(false, { transform: booleanAttribute });
  readonly editable = input(false, { transform: booleanAttribute });

  readonly remove = output<number>();
  readonly quantityChange = output<number>();
}
