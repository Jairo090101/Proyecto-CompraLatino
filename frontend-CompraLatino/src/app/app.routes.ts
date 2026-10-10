import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './services/auth.service';

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
      {
        path: 'login',
        title: 'Ingresar | CompraLatino',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'mis-compras',
        title: 'Mis compras | CompraLatino',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/mis-compras/mis-compras').then((m) => m.MisCompras),
      },
    ],
  },
  // Screens not implemented yet fall back to the home page.
  { path: '**', redirectTo: '' },
];
