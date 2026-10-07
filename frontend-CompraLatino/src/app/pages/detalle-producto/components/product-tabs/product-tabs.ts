import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { Product } from '../../../../models/product.model';
import { Review } from '../../../../models/review.model';
import { StarRating } from '../../../../shared/components/star-rating/star-rating';

type TabId = 'descripcion' | 'especificaciones' | 'resenas';

@Component({
  selector: 'app-product-tabs',
  imports: [DatePipe, StarRating],
  templateUrl: './product-tabs.html',
  styleUrl: './product-tabs.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTabs {
  readonly product = input.required<Product>();
  readonly reviews = input<Review[]>([]);

  protected readonly active = signal<TabId>('descripcion');

  protected readonly tabs = computed<{ id: TabId; label: string }[]>(() => [
    { id: 'descripcion', label: 'Descripción' },
    { id: 'especificaciones', label: 'Especificaciones' },
    { id: 'resenas', label: `Reseñas (${this.product().reviewCount})` },
  ]);
}
