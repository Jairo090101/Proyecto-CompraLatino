import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../services/auth.service';

interface AdminLink {
  label: string;
  path: string;
  exact?: boolean;
  icon: 'dashboard' | 'users' | 'box' | 'cart' | 'chart';
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminShell {
  private readonly auth = inject(AuthService);
  protected readonly account = computed(() => {
    const user = this.auth.user();
    return {
      name: user?.name ?? 'Admin',
      email: user?.email ?? '',
      role: 'Super Admin',
    };
  });
  protected readonly initial = computed(() => this.account().name.charAt(0).toUpperCase());
  protected readonly links: AdminLink[] = [
    { label: 'Dashboard', path: '/admin', exact: true, icon: 'dashboard' },
    { label: 'Usuarios', path: '/admin/usuarios', icon: 'users' },
    { label: 'Productos', path: '/admin/productos', icon: 'box' },
    { label: 'Compras', path: '/admin/compras', icon: 'cart' },
    { label: 'Reportes', path: '/admin/reportes', icon: 'chart' },
  ];
}
