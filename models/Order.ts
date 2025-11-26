/**
 * Modèle représentant une commande
 */
export interface Order {
  id: string;
  user_id?: string;
  table_number: string;
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  created_at?: string;
}

/**
 * Modèle représentant un item d'une commande
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  options: any; // JSONB array
  line_total: number;
}
