/**
 * Modèle représentant un produit du menu
 */
export interface Product {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  base_price: number; // Changé de 'price' à 'base_price'
  image_url?: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Modèle représentant une option de produit (taille, extras...)
 */
export interface ProductOption {
  id: string;
  product_id: string;
  label: string;
  kind: string; // Type d'option (size, extra, etc.)
  price_delta: number;
  is_default: boolean;
}
