export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string | null;
  country?: string | null;
  created_at?: string;
}
