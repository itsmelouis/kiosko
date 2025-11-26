import { Product, ProductOption } from './Product';

/**
 * Modèle représentant un article dans le panier (local)
 */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions: ProductOption[];
  subtotal: number; // Prix calculé avec options
}
