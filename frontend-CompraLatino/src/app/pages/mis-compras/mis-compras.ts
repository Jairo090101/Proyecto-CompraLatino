import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { OrdersService } from '../../services/orders.service';
import { ImgFallbackDirective } from '../../shared/directives/img-fallback.directive';

@Component({
  selector: 'app-mis-compras',
  imports: [CurrencyPipe, RouterLink, ImgFallbackDirective],
  templateUrl: './mis-compras.html',
  styleUrl: './mis-compras.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisCompras {
  private readonly auth = inject(AuthService);
  private readonly ordersService = inject(OrdersService);

  protected readonly email = computed(() => this.auth.user()?.email ?? '');
  protected readonly orders = computed(() => this.ordersService.forEmail(this.email()));

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
