import {
  AdminOrder,
  AdminProduct,
  AdminReport,
  AdminUser,
  CategoryStat,
  MonthStat,
} from '../models/admin-panel.model';
import { unsplash } from './mock-utils';

/**
 * September 2026 snapshot from the admin designs. Amounts are MXN on purpose:
 * the public catalog stays in USD until the backend is the single source.
 */
export const DASHBOARD_PERIOD = 'Septiembre 2026';

export const MONTHLY_ORDERS: MonthStat[] = [
  { month: 'Abr', orders: 180 },
  { month: 'May', orders: 220 },
  { month: 'Jun', orders: 195 },
  { month: 'Jul', orders: 260 },
  { month: 'Ago', orders: 310 },
  { month: 'Sep', orders: 342 },
];

export const CATEGORY_STATS: CategoryStat[] = [
  { name: 'Electrónica', orders: 154, color: '#e8304a' },
  { name: 'Coleccionables', orders: 103, color: '#f59e0b' },
  { name: 'Moda', orders: 51, color: '#8b9bb4' },
  { name: 'Hogar', orders: 34, color: '#5c6b84' },
];

export const ADMIN_USERS: AdminUser[] = [
  { id: 'U-001', name: 'María García', email: 'mariag@ejemplo.com', countryCode: 'mx', country: 'México', orders: 8, status: 'activo', color: '#e8304a' },
  { id: 'U-002', name: 'Carlos Mendez', email: 'cmendez@mail.co', countryCode: 'co', country: 'Colombia', orders: 5, status: 'activo', color: '#f59e0b' },
  { id: 'U-003', name: 'Valentina Torres', email: 'vtorres@web.ar', countryCode: 'ar', country: 'Argentina', orders: 12, status: 'activo', color: '#a78bfa' },
  { id: 'U-004', name: 'Diego Ramírez', email: 'dramirez@net.pe', countryCode: 'pe', country: 'Perú', orders: 2, status: 'activo', color: '#38bdf8' },
  { id: 'U-005', name: 'Laura Castillo', email: 'lcastillo@cl.cl', countryCode: 'cl', country: 'Chile', orders: 6, status: 'activo', color: '#22c55e' },
  { id: 'U-006', name: 'Andrés Morales', email: 'amorales@ec.com', countryCode: 'ec', country: 'Ecuador', orders: 3, status: 'activo', color: '#fb7185' },
  { id: 'U-007', name: 'Gabriela Ríos', email: 'grios@gt.mx', countryCode: 'gt', country: 'Guatemala', orders: 1, status: 'suspendido', color: '#94a3b8' },
];

export const ADMIN_PRODUCTS: AdminProduct[] = [
  { id: 'P-001', catalogId: 1, name: 'Sony WH-1000XM5 Audífonos NC', category: 'Electrónica', priceMxn: 4200, stock: 23, sales: 89, image: unsplash('1505740420928-5e560c06d30e', 96) },
  { id: 'P-002', catalogId: 2, name: 'Nintendo Switch OLED Blanca', category: 'Electrónica', priceMxn: 7800, stock: 8, sales: 67, image: unsplash('1578303512597-81e6cc155b3e', 96) },
  { id: 'P-003', catalogId: 3, name: 'Nendoroid Tanjiro Kamado', category: 'Coleccionables', priceMxn: 1200, stock: 45, sales: 134, image: unsplash('1608889175123-8ee362201f81', 96) },
  { id: 'P-004', catalogId: 4, name: 'Canon EOS R50 Kit 18-45mm', category: 'Electrónica', priceMxn: 18900, stock: 3, sales: 28, image: unsplash('1502920917128-1aa500764cbd', 96) },
  { id: 'P-005', catalogId: 9, name: 'Pokémon TCG Booster Box S&V', category: 'Coleccionables', priceMxn: 6800, stock: 0, sales: 201, image: unsplash('1613771404721-1f92d799e49f', 96) },
  { id: 'P-006', catalogId: 6, name: 'Kimono Tradicional Floral Azul', category: 'Moda', priceMxn: 3400, stock: 12, sales: 47, image: unsplash('1528360983277-13d401cdc186', 96) },
  { id: 'P-007', catalogId: 8, name: 'PS5 DualSense Controller Negro', category: 'Electrónica', priceMxn: 2400, stock: 19, sales: 156, image: unsplash('1607853202273-797f1c22a38e', 96) },
];

export const ADMIN_ORDERS: AdminOrder[] = [
  { id: 'CL-2026-08341', customer: 'María García', email: 'mariag@ejemplo.com', countryCode: 'mx', product: 'Sony WH-1000XM5', dateLabel: '2 Sep 2026', totalMxn: 4620, status: 'entregado' },
  { id: 'CL-2026-08290', customer: 'Carlos Mendez', email: 'cmendez@mail.co', countryCode: 'co', product: 'Nintendo Switch OLED', dateLabel: '1 Sep 2026', totalMxn: 8580, status: 'en-transito' },
  { id: 'CL-2026-08281', customer: 'Valentina Torres', email: 'vtorres@web.ar', countryCode: 'ar', product: 'Canon EOS R50 Kit', dateLabel: '29 Ago 2026', totalMxn: 20790, status: 'procesando' },
  { id: 'CL-2026-08134', customer: 'Laura Castillo', email: 'lcastillo@cl.cl', countryCode: 'cl', product: 'Pokémon TCG Booster Box', dateLabel: '28 Ago 2026', totalMxn: 7480, status: 'entregado' },
  { id: 'CL-2026-08012', customer: 'Diego Ramírez', email: 'dramirez@net.pe', countryCode: 'pe', product: 'Nendoroid Tanjiro x2', dateLabel: '25 Ago 2026', totalMxn: 2640, status: 'cancelado' },
  { id: 'CL-2026-07983', customer: 'Andrés Morales', email: 'amorales@ec.com', countryCode: 'ec', product: 'PS5 DualSense Negro', dateLabel: '22 Ago 2026', totalMxn: 2640, status: 'entregado' },
];

export const ADMIN_REPORTS: AdminReport[] = [
  { id: 'ventas', title: 'Ventas Mensuales', description: 'Ingresos totales, volumen de órdenes y comisiones por mes.', period: 'Últ. Sep 2026', summary: 'Septiembre cerró en $284,500 USD y 342 órdenes, 18.3% sobre agosto.' },
  { id: 'usuarios', title: 'Reporte de Usuarios', description: 'Registros nuevos, retención por mes y actividad por país.', period: 'Últ. Sep 2026', summary: '1,284 usuarios activos. México, Colombia y Argentina concentran la mayoría de las órdenes.' },
  { id: 'top', title: 'Productos Top 50', description: 'Los 50 artículos más comprados del periodo seleccionado.', period: 'Últ. Ago 2026', summary: 'Pokémon TCG, DualSense y Nendoroid Tanjiro lideran las unidades vendidas.' },
  { id: 'envios', title: 'Análisis de Envíos', description: 'Tiempos de entrega, incidencias y satisfacción post-entrega.', period: 'Últ. Sep 2026', summary: '3 entregas cerradas en la muestra reciente y 2 órdenes todavía en tránsito o proceso.' },
  { id: 'cancelaciones', title: 'Reporte de Cancelaciones', description: 'Órdenes canceladas, motivos y tasa de cancelación.', period: 'Últ. Sep 2026', summary: '1 orden cancelada en la muestra (CL-2026-08012). La tasa del mes se mantiene bajo el 1%.' },
  { id: 'financiero', title: 'Reporte Financiero', description: 'Estado de ingresos, márgenes y proyección de ingresos.', period: 'Últ. Sep 2026', summary: 'Comisiones generadas: $28,450 USD, el 10% del GMV de septiembre.' },
];

export const PRODUCT_CATEGORIES = ['Electrónica', 'Coleccionables', 'Moda'];

export function formatMoney(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

export function stockState(stock: number): 'activo' | 'bajo' | 'agotado' {
  if (stock <= 0) {
    return 'agotado';
  }
  if (stock <= 5) {
    return 'bajo';
  }
  return 'activo';
}
