import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Category } from '../../../models/category.model';
import { ImgFallbackDirective } from '../../directives/img-fallback.directive';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink, DecimalPipe, ImgFallbackDirective],
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCard {
  readonly category = input.required<Category>();
}
