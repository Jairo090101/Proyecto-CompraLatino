import { Category } from './category.model';

export interface AdminProduct {
  id: number;
  category_id: string;
  category: Category;
  name: string;
  description: string;
  price_usd: string;
  original_price_usd?: string | null;
  status: 'disponible' | 'subasta' | 'agotado';
  image?: string | null;
  condition?: string | null;
  yauctions_item_id?: string | null;
  featured: boolean;
}

export interface AdminProductPayload {
  category_id: string;
  name: string;
  description: string;
  price_usd: number;
  original_price_usd: number | null;
  status: AdminProduct['status'];
  image: string;
  condition: string;
  yauctions_item_id: string;
  featured: boolean;
}

export interface AdminMetrics {
  totals: {
    sales: number;
    orders: number;
    commission: number;
    average_order: number;
    customers: number;
    products: number;
  };
  sales_by_day: { date: string; total: number; orders: number }[];
  orders_by_status: { status: string; count: number }[];
  top_products: { product_name: string; quantity: number }[];
}

export interface AdminProductPage {
  data: AdminProduct[];
  current_page: number;
  last_page: number;
}
