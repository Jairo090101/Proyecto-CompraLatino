import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { CartDrawerService } from '../../services/cart-drawer.service';
import { CartService } from '../../services/cart.service';

interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cartDrawer = inject(CartDrawerService);

  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly userName = computed(() => this.auth.user()?.name ?? '');
  protected readonly links = computed<NavLink[]>(() => {
    const items: NavLink[] = [
      { label: 'Inicio', path: '/', exact: true },
      { label: 'Catálogo', path: '/catalogo' },
    ];

    if (this.auth.isLoggedIn()) {
      items.push({ label: 'Mis Compras', path: '/mis-compras' });
    }

    // El apartado Admin queda oculto hasta que exista un panel real.
    // items.push({ label: 'Admin', path: '/admin' });

    return items;
  });

  protected readonly cartCount = inject(CartService).count;
  protected readonly menuOpen = signal(false);

  openCart(): void {
    this.closeMenu();
    this.cartDrawer.open();
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    void this.auth.logout().finally(() => {
      this.closeMenu();
      if (this.router.url.startsWith('/mis-compras')) {
        void this.router.navigateByUrl('/');
      }
    });
  }
}
