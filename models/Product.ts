/**
 * Modèle représentant un produit du menu
 */
export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
  options?: ProductOption[];
}

/**
 * Type d'option (size, extra, sauce, cooking, side)
 */
export type OptionKind = 'size' | 'extra' | 'sauce' | 'cooking' | 'side';

/**
 * Modèle représentant une option de produit (taille, extras...)
 */
export interface ProductOption {
  id: string;
  product_id: string;
  label: string;
  kind: OptionKind;
  price_delta: number;
  is_default: boolean;
}
