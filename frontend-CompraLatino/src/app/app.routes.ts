import { Routes } from '@angular/router';

import { MainLayout } from './layout/main-layout/main-layout';
import { adminGuard, authGuard, guestGuard } from './services/auth.guards';

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
        path: 'confirmacion',
        title: 'Confirmar compra | CompraLatino',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/confirmacion/confirmacion').then((m) => m.Confirmacion),
      },
      {
        path: 'mis-compras',
        title: 'Mis compras | CompraLatino',
        canActivate: [authGuard],
        loadComponent: () => import('./pages/mis-compras/mis-compras').then((m) => m.MisCompras),
      },
      {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./pages/admin/admin-shell').then((m) => m.AdminShell),
        children: [
          {
            path: '',
            title: 'Dashboard | Admin CompraLatino',
            loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.AdminDashboard),
          },
          {
            path: 'usuarios',
            title: 'Usuarios | Admin CompraLatino',
            loadComponent: () => import('./pages/admin/usuarios/usuarios').then((m) => m.AdminUsuarios),
          },
          {
            path: 'productos',
            title: 'Productos | Admin CompraLatino',
            loadComponent: () => import('./pages/admin/productos/productos').then((m) => m.AdminProductos),
          },
          {
            path: 'compras',
            title: 'Compras | Admin CompraLatino',
            loadComponent: () => import('./pages/admin/compras/compras').then((m) => m.AdminCompras),
          },
          {
            path: 'reportes',
            title: 'Reportes | Admin CompraLatino',
            loadComponent: () => import('./pages/admin/reportes/reportes').then((m) => m.AdminReportes),
          },
        ],
      },
    ],
  },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
  { path: 'registro', canActivate: [guestGuard], loadComponent: () => import('./pages/registro/registro').then((m) => m.Registro) },
  // Screens not implemented yet fall back to the home page.
  { path: '**', redirectTo: '' },
];
