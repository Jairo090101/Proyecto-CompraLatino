import { CurrencyPipe, DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

import { CartDrawerService } from '../../services/cart-drawer.service';
import { CartService } from '../../services/cart.service';
import { CartLine } from '../../shared/components/cart-line/cart-line';
import { COMMISSION_RATE, priceBreakdown } from '../../shared/utils/pricing';

@Component({
  selector: 'app-cart-drawer',
  imports: [RouterLink, CurrencyPipe, CartLine],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'close()' },
})
export class CartDrawer {
  private readonly drawer = inject(CartDrawerService);
  private readonly cart = inject(CartService);
  private readonly document = inject(DOCUMENT);

  private readonly closeBtn = viewChild<ElementRef<HTMLButtonElement>>('closeBtn');

  protected readonly isOpen = this.drawer.isOpen;
  protected readonly items = this.cart.items;
  protected readonly commissionPercent = COMMISSION_RATE * 100;
  protected readonly totals = computed(() => priceBreakdown(this.cart.subtotal()));

  constructor() {
    // Lock page scroll while open and move focus into the panel for keyboard users.
    effect(() => {
      const open = this.isOpen();
      this.document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        setTimeout(() => this.closeBtn()?.nativeElement.focus());
      }
    });

    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.close());
  }

  close(): void {
    if (this.isOpen()) {
      this.drawer.close();
    }
  }

  removeItem(productId: number): void {
    this.cart.remove(productId);
  }

  clearCart(): void {
    this.cart.clear();
  }
}
