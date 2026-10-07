import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { CategoryCard } from '../../shared/components/category-card/category-card';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { SectionHeader } from '../../shared/components/section-header/section-header';
import { HeroSearch } from './components/hero-search/hero-search';

@Component({
  selector: 'app-home',
  imports: [HeroSearch, SectionHeader, CategoryCard, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  protected readonly stats = toSignal(this.productService.getHomeStats(), { initialValue: [] });
  protected readonly categories = toSignal(this.productService.getCategories(), { initialValue: [] });
  protected readonly featured = toSignal(this.productService.getFeaturedProducts(), { initialValue: [] });

  onSearch(term: string): void {
    this.router.navigate(['/catalogo'], { queryParams: term ? { q: term } : {} });
  }
}
