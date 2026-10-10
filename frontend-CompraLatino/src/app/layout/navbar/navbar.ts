import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartDrawerService } from '../../services/cart-drawer.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

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
  protected readonly links: NavLink[] = [
    { label: 'Inicio', path: '/', exact: true },
    { label: 'Catálogo', path: '/catalogo' },
    { label: 'Mis Compras', path: '/historial' },
    { label: 'Admin', path: '/admin' },
  ];

  private readonly cartDrawer = inject(CartDrawerService);

  protected readonly cartCount = inject(CartService).count;
  protected readonly menuOpen = signal(false);
  protected readonly auth = inject(AuthService);

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
    this.auth.logout().subscribe();
    this.closeMenu();
  }
}
