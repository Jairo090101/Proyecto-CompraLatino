import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

/**
 * compact: single star + rating + (count), used in product cards.
 * full: five stars + rating + (count reseñas), used in the product detail.
 */
@Component({
  selector: 'app-star-rating',
  imports: [DecimalPipe],
  templateUrl: './star-rating.html',
  styleUrl: './star-rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  readonly rating = input.required<number>();
  readonly count = input<number | null>(null);
  readonly compact = input(false, { transform: booleanAttribute });

  protected readonly stars = computed(() => {
    const filled = Math.floor(this.rating());
    return [1, 2, 3, 4, 5].map((n) => n <= filled);
  });
}
