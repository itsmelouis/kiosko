/**
 * Modèle représentant une catégorie de produits
 */
export interface Category {
  id: string;
  name: string;
  slug: string | null;
  position: number;
  icon_name?: string;
}
