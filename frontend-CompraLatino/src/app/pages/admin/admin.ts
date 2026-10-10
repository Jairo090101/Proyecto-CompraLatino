import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { AdminProduct } from '../../models/admin.model';
import { Category } from '../../models/category.model';
import { AdminService } from '../../services/admin.service';
import { ProductService } from '../../services/product.service';
import { apiErrorMessage } from '../../services/api-error';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly productsApi = inject(ProductService);
  private readonly fb = inject(FormBuilder);

  readonly tab = signal<'dashboard' | 'products'>('dashboard');
  readonly metrics = signal<any>(null);
  readonly products = signal<AdminProduct[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly editing = signal<AdminProduct | null>(null);
  readonly error = signal('');
  readonly saved = signal('');
  readonly search = signal('');
  readonly page = signal(1);
  readonly form = this.fb.nonNullable.group({
    category_id: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    price_usd: [0, [Validators.required, Validators.min(0.01)]],
    original_price_usd: [null as number | null],
    status: ['disponible' as AdminProduct['status'], Validators.required],
    image: [''],
    condition: ['Nuevo'],
    yauctions_item_id: [''],
    featured: [false],
  });

  ngOnInit(): void {
    this.loadMetrics();
    this.loadProducts();
    this.productsApi.getCategories().subscribe((categories) => this.categories.set(categories));
  }

  loadMetrics(): void {
    this.admin.getMetrics().subscribe({ next: (value) => this.metrics.set(value), error: (e) => this.error.set(apiErrorMessage(e, 'No se pudieron cargar las métricas.')) });
  }

  loadProducts(): void {
    this.admin.getProducts(this.search(), this.page()).subscribe({
      next: (value) => this.products.set(value.data),
      error: (e) => this.error.set(apiErrorMessage(e, 'No se pudieron cargar los productos.')),
    });
  }

  setTab(tab: 'dashboard' | 'products'): void {
    this.tab.set(tab);
    if (tab === 'products') this.loadProducts();
  }

  edit(product: AdminProduct): void {
    this.editing.set(product);
    this.form.patchValue({
      category_id: product.category_id,
      name: product.name,
      description: product.description,
      price_usd: Number(product.price_usd),
      original_price_usd: product.original_price_usd ? Number(product.original_price_usd) : null,
      status: product.status,
      image: product.image ?? '',
      condition: product.condition ?? '',
      yauctions_item_id: product.yauctions_item_id ?? '',
      featured: product.featured,
    });
    this.setTab('products');
  }

  cancelEdit(): void {
    this.editing.set(null);
    this.form.reset({ category_id: '', name: '', description: '', price_usd: 0, original_price_usd: null, status: 'disponible', image: '', condition: 'Nuevo', yauctions_item_id: '', featured: false });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.error.set('');
    const request = this.editing()
      ? this.admin.updateProduct(this.editing()!.id, this.form.getRawValue())
      : this.admin.createProduct(this.form.getRawValue());
    request.subscribe({
      next: () => { this.saved.set('Producto guardado correctamente.'); this.cancelEdit(); this.loadProducts(); this.loadMetrics(); },
      error: (e) => this.error.set(apiErrorMessage(e, 'No se pudo guardar el producto.')),
    });
  }

  remove(product: AdminProduct): void {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    this.admin.deleteProduct(product.id).subscribe({
      next: () => this.loadProducts(),
      error: (e) => this.error.set(apiErrorMessage(e, 'No se pudo eliminar el producto.')),
    });
  }

  searchProducts(value: string): void {
    this.search.set(value);
    this.page.set(1);
    this.loadProducts();
  }
}
