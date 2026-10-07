import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';

import { CartDrawerService } from '../../services/cart-drawer.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Breadcrumb, BreadcrumbItem } from '../../shared/components/breadcrumb/breadcrumb';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { QuantityStepper } from '../../shared/components/quantity-stepper/quantity-stepper';
import { StarRating } from '../../shared/components/star-rating/star-rating';
import { PriceSummary } from './components/price-summary/price-summary';
import { ProductGallery } from './components/product-gallery/product-gallery';
import { ProductTabs } from './components/product-tabs/product-tabs';

const ADDED_FEEDBACK_MS = 2500;

@Component({
  selector: 'app-detalle-producto',
  imports: [
    RouterLink,
    DecimalPipe,
    Breadcrumb,
    StarRating,
    QuantityStepper,
    PriceSummary,
    ProductGallery,
    ProductTabs,
    ProductCard,
    SectionHeader,
  ],
  templateUrl: './detalle-producto.html',
  styleUrl: './detalle-producto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleProducto {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly cartDrawer = inject(CartDrawerService);

  private readonly productId$ = inject(ActivatedRoute).paramMap.pipe(map((p) => Number(p.get('id'))));
  private readonly product$ = this.productId$.pipe(
    switchMap((id) => this.productService.getProductById(id)),
  );

  protected readonly product = toSignal(this.product$);
  protected readonly related = toSignal(
    this.product$.pipe(
      switchMap((p) => (p ? this.productService.getRelatedProducts(p) : of([]))),
    ),
    { initialValue: [] },
  );
  protected readonly reviews = toSignal(
    this.productId$.pipe(switchMap((id) => this.productService.getProductReviews(id))),
    { initialValue: [] },
  );

  protected readonly images = computed(() => {
    const p = this.product();
    return p ? [p.image, ...(p.gallery ?? [])] : [];
  });

  protected readonly breadcrumb = computed<BreadcrumbItem[]>(() => [
    { label: 'Inicio', url: '/' },
    { label: 'Catálogo', url: '/catalogo' },
    { label: this.product()?.name ?? 'Producto' },
  ]);

  protected readonly soldOut = computed(() => this.product()?.status === 'agotado');

  // Reset per-product UI state when navigating between products.
  protected readonly quantity = linkedSignal({ source: this.product, computation: () => 1 });
  protected readonly favorite = linkedSignal({ source: this.product, computation: () => false });
  protected readonly justAdded = signal(false);

  private feedbackTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.feedbackTimer));
  }

  addToCart(): void {
    const product = this.product();
    if (!product || this.soldOut()) {
      return;
    }
    this.cart.add(product, this.quantity());
    this.cartDrawer.open();

    this.justAdded.set(true);
    clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => this.justAdded.set(false), ADDED_FEEDBACK_MS);
  }

  toggleFavorite(): void {
    this.favorite.update((fav) => !fav);
  }
}
