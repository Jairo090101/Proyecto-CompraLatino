import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { CatalogSort, CatalogView } from '../../models/catalog-filters.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Breadcrumb, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { normalizeText } from '../../shared/utils/text';
import { CatalogToolbar } from './components/catalog-toolbar/catalog-toolbar';

const SORTERS: Record<CatalogSort, (a: Product, b: Product) => number> = {
  popular: (a, b) => b.reviewCount - a.reviewCount,
  recent: (a, b) => b.id - a.id,
  'price-asc': (a, b) => a.priceUsd - b.priceUsd,
  'price-desc': (a, b) => b.priceUsd - a.priceUsd,
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

@Component({
  selector: 'app-catalogo',
  imports: [Breadcrumb, CatalogToolbar, ProductCard],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalogo {
  private readonly productService = inject(ProductService);
  private readonly queryParams = inject(ActivatedRoute).snapshot.queryParamMap;

  protected readonly breadcrumb: BreadcrumbItem[] = [
    { label: 'Inicio', url: '/' },
    { label: 'Catálogo' },
  ];

  protected readonly products = toSignal(this.productService.getProducts(), { initialValue: [] });
  protected readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });

  // Initial values come from the home page links (?q= / ?categoria=).
  protected readonly search = signal(this.queryParams.get('q') ?? '');
  protected readonly category = signal<string | null>(this.queryParams.get('categoria'));
  protected readonly sort = signal<CatalogSort>('popular');
  protected readonly view = signal<CatalogView>('grid');
  protected readonly minPrice = signal<number | null>(null);
  protected readonly maxPrice = signal<number | null>(null);
  protected readonly onlyAvailable = signal(false);

  protected readonly filtered = computed(() => {
    const term = normalizeText(this.search());
    const category = this.category();
    const min = this.minPrice();
    const max = this.maxPrice();
    const onlyAvailable = this.onlyAvailable();

    return this.products()
      .filter(
        (p) =>
          (!category || p.category.id === category) &&
          (!term || normalizeText(`${p.name} ${p.category.name}`).includes(term)) &&
          (min === null || p.priceUsd >= min) &&
          (max === null || p.priceUsd <= max) &&
          (!onlyAvailable || p.status === 'disponible'),
      )
      .sort(SORTERS[this.sort()]);
  });

  selectCategory(id: string | null): void {
    this.category.set(id);
  }

  clearFilters(): void {
    this.search.set('');
    this.category.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.onlyAvailable.set(false);
  }
}
