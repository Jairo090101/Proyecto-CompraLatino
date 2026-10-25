export type AdminUserStatus = 'activo' | 'suspendido';
export type AdminOrderStatus = 'entregado' | 'en-transito' | 'procesando' | 'cancelado';
export type KpiTone = 'default' | 'success' | 'warning' | 'danger';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  countryCode: string;
  country: string;
  orders: number;
  status: AdminUserStatus;
  color: string;
}

export interface AdminProduct {
  id: string;
  catalogId: number;
  name: string;
  category: string;
  priceMxn: number;
  stock: number;
  sales: number;
  image: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  countryCode: string;
  product: string;
  dateLabel: string;
  totalMxn: number;
  status: AdminOrderStatus;
}

export interface MonthStat {
  month: string;
  orders: number;
}

export interface CategoryStat {
  name: string;
  orders: number;
  color: string;
}

export interface AdminReport {
  id: string;
  title: string;
  description: string;
  period: string;
  summary: string;
}

export const ORDER_STATUS_LABEL: Record<AdminOrderStatus, string> = {
  entregado: 'Entregado',
  'en-transito': 'En tránsito',
  procesando: 'Procesando',
  cancelado: 'Cancelado',
};
