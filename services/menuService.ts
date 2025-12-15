import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { supabase } from './supabaseClient';

/**
 * Service pour gérer le menu (US1 - Parcourir le menu)
 */

/**
 * Récupère tous les produits disponibles
 */
export async function getMenu(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching menu:', error);
    throw error;
  }
}

/**
 * Alias pour getMenu - utilisé par le ViewModel
 */
export const getProducts = getMenu;

/**
 * Récupère toutes les catégories
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position'); // Tri par position

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Récupère les produits d'une catégorie spécifique
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_available', true)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}
