import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../models/product.model';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CurrencyPipe, ImgFallbackDirective, StarRating],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  /** 'list' renders a horizontal card for the catalog list view. */
  readonly layout = input<'grid' | 'list'>('grid');
}
