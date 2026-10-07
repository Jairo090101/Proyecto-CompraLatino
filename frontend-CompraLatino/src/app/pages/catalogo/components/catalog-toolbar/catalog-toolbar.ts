import { ChangeDetectionStrategy, Component, computed, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CATALOG_SORT_OPTIONS, CatalogSort, CatalogView } from '../../../../models/catalog-filters.model';

/**
 * Search / sort / view / advanced filters for the catalog.
 * State lives in the parent page via two-way model() bindings so filtering stays in one place.
 */
@Component({
  selector: 'app-catalog-toolbar',
  imports: [FormsModule],
  templateUrl: './catalog-toolbar.html',
  styleUrl: './catalog-toolbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogToolbar {
  readonly search = model('');
  readonly sort = model<CatalogSort>('popular');
  readonly view = model<CatalogView>('grid');
  readonly minPrice = model<number | null>(null);
  readonly maxPrice = model<number | null>(null);
  readonly onlyAvailable = model(false);

  readonly clearFilters = output<void>();

  protected readonly sortOptions = CATALOG_SORT_OPTIONS;
  protected readonly filtersOpen = signal(false);

  protected readonly activeFilters = computed(
    () =>
      Number(this.minPrice() !== null) + Number(this.maxPrice() !== null) + Number(this.onlyAvailable()),
  );

  toggleFilters(): void {
    this.filtersOpen.update((open) => !open);
  }

  /** Empty number inputs come through as null/'' and should not filter. */
  protected toPrice(value: number | string | null): number | null {
    return value === null || value === '' ? null : Math.max(0, Number(value));
  }
}
