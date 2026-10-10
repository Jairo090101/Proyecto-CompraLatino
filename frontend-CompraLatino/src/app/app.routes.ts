import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard, guestGuard } from './services/auth.guards';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        title: 'CompraLatino | Lo mejor de Japón, en tu país',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'catalogo',
        title: 'Catálogo | CompraLatino',
        loadComponent: () => import('./pages/catalogo/catalogo').then((m) => m.Catalogo),
      },
      {
        path: 'producto/:id',
        title: 'Detalle del producto | CompraLatino',
        loadComponent: () =>
          import('./pages/detalle-producto/detalle-producto').then((m) => m.DetalleProducto),
      },
    ],
  },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registro', canActivate: [guestGuard], loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  { path: 'confirmacion', canActivate: [authGuard], loadComponent: () => import('./pages/confirmacion/confirmacion').then((m) => m.Confirmacion) },
  { path: 'mis-compras', canActivate: [authGuard], loadComponent: () => import('./pages/mis-compras/mis-compras').then((m) => m.MisCompras) },
  // Screens not implemented yet fall back to the home page.
  { path: '**', redirectTo: '' },
];
