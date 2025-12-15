import { Product } from './Product';

/**
 * Format JSONB pour les options sélectionnées
 */
export interface SelectedOptionJson {
  option_id: string;
  label: string;
  price_delta: number;
}

/**
 * Modèle représentant un article dans le panier (local)
 */
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedOptions: SelectedOptionJson[];
  unitPrice: number;
  totalPrice: number;
  subtotal: number; // Alias pour totalPrice (compatibilité orderService)
}
