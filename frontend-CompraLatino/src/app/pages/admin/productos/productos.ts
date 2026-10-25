import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ADMIN_PRODUCTS, PRODUCT_CATEGORIES, formatMoney, stockState } from '../../../mocks/admin-panel.mock';
import { ImgFallbackDirective } from '../../../shared/directives/img-fallback.directive';
import { downloadCsv } from '../../../shared/utils/csv';
import { normalizeText } from '../../../shared/utils/text';
import { KpiCard } from '../components/kpi-card/kpi-card';

@Component({
  selector: 'app-admin-productos',
  imports: [RouterLink, ImgFallbackDirective, KpiCard],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductos {
  protected readonly products = ADMIN_PRODUCTS;
  protected readonly categories = PRODUCT_CATEGORIES;
  protected readonly money = formatMoney;
  protected readonly stockState = stockState;
  protected readonly lowOrOut = ADMIN_PRODUCTS.filter((product) => product.stock <= 5).length;
  protected readonly monthSales = ADMIN_PRODUCTS.reduce((sum, product) => sum + product.sales, 0);

  protected readonly query = signal('');
  protected readonly category = signal<string | null>(null);
  protected readonly synced = signal(false);

  private syncTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.syncTimer));
  }

  protected readonly filtered = computed(() => {
    const term = normalizeText(this.query());
    const category = this.category();
    return this.products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!term || normalizeText(`${product.name} ${product.id}`).includes(term)),
    );
  });

  protected onSearch(value: string): void {
    this.query.set(value);
  }

  protected sync(): void {
    this.synced.set(true);
    clearTimeout(this.syncTimer);
    this.syncTimer = setTimeout(() => this.synced.set(false), 2000);
  }

  protected exportCsv(): void {
    downloadCsv(
      'productos-compralatino.csv',
      ['ID', 'Producto', 'Categoría', 'Precio MXN', 'Stock', 'Ventas', 'Estado'],
      this.filtered().map((product) => [
        product.id,
        product.name,
        product.category,
        String(product.priceMxn),
        String(product.stock),
        String(product.sales),
        stockState(product.stock),
      ]),
    );
  }
}
