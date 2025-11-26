/**
 * Modèle représentant une catégorie de produits
 */
export interface Category {
  id: string;
  name: string;
  slug?: string;
  position: number;
}
