/**
 * Types TypeScript pour l'application Kiosko
 * Alignés sur le schéma de base de données PostgreSQL
 */

// ============================================
// MODE DE RESTAURATION
// ============================================
export type DineMode = 'dine-in' | 'takeaway';

// ============================================
// CATÉGORIES (table: categories)
// ============================================
export interface Category {
  id: string;
  name: string;
  slug: string | null;
  position: number;
  icon_name?: string;
}

// ============================================
// PRODUITS (table: products)
// ============================================
export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  is_available: boolean;
  // Relation chargée côté frontend
  options?: ProductOption[];
}

// ============================================
// OPTIONS PRODUIT (table: product_options)
// ============================================
export type OptionKind = 'size' | 'extra' | 'sauce' | 'cooking' | 'side';

export interface ProductOption {
  id: string;
  product_id: string;
  label: string;
  kind: OptionKind;
  price_delta: number;
  is_default: boolean;
}

// ============================================
// COMMANDES (table: orders)
// ============================================
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  table_number: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  user_id: string | null;
}

// ============================================
// ITEMS COMMANDE (table: order_items)
// ============================================
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  options: SelectedOptionJson[]; // JSONB dans la DB
  line_total: number;
}

// Format JSONB pour les options sélectionnées
export interface SelectedOptionJson {
  option_id: string;
  label: string;
  price_delta: number;
}

// ============================================
// UTILISATEURS (table: users)
// ============================================
export interface User {
  id: string;
  loyalty_qr: string;
  firstname: string | null;
  lastname: string | null;
  points: number;
  created_at: string;
}

// ============================================
// HISTORIQUE FIDÉLITÉ (table: loyalty_history)
// ============================================
export interface LoyaltyHistory {
  id: string;
  user_id: string;
  order_id: string;
  points_change: number;
  created_at: string;
}

// ============================================
// TYPES FRONTEND (non DB)
// ============================================

// Item dans le panier (frontend only)
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOptionJson[];
  unitPrice: number;
  totalPrice: number;
}

// Résultat paiement mock
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Navigation Expo Router
export type RootStackParamList = {
  index: undefined;
  'loyalty/index': undefined;
  'loyalty/scan': undefined;
  'menu/index': undefined;
  'product/[id]': { id: string };
  'payment/index': undefined;
  'confirmation/index': { orderNumber: string };
};
