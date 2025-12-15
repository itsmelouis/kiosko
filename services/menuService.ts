/**
 * Service Menu - Frontend uniquement
 * TODO: Remplacer par appels API/Supabase quand backend prêt
 */
import { Category, Product } from '@/types';
import { MOCK_CATEGORIES, getProductsWithOptions } from './mockData';

// ============================================
// FONCTIONS DU SERVICE
// ============================================

/**
 * Récupère toutes les catégories
 * TODO: Remplacer par appel Supabase
 */
export async function getCategories(): Promise<Category[]> {
  // Simule un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CATEGORIES;
}

/**
 * Récupère tous les produits disponibles
 * TODO: Remplacer par appel Supabase
 */
export async function getProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getProductsWithOptions().filter((p) => p.is_available);
}

/**
 * Récupère les produits d'une catégorie
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.category_id === categoryId);
}

/**
 * Récupère un produit par son ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.id === productId) || null;
}
