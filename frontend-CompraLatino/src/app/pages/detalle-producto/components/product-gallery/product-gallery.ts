import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';

import { ImgFallbackDirective } from '../../../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-product-gallery',
  imports: [ImgFallbackDirective],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGallery {
  readonly images = input.required<string[]>();
  readonly alt = input('');

  /** Resets to the first image whenever a different product's images arrive. */
  protected readonly selectedIndex = linkedSignal({ source: this.images, computation: () => 0 });
  protected readonly selected = computed(() => this.images()[this.selectedIndex()] ?? this.images()[0]);

  select(index: number): void {
    this.selectedIndex.set(index);
  }
}
