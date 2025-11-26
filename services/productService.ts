import { supabase } from './supabaseClient';
import { Product, ProductOption } from '../models/Product';

/**
 * Service pour gérer les produits et leurs options
 */

/**
 * Récupère un produit par son ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Récupère toutes les options disponibles pour un produit
 */
export async function getOptions(productId: string): Promise<ProductOption[]> {
  try {
    const { data, error } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', productId);
      // Retiré order('type') car la colonne n'existe pas

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching product options:', error);
    throw error;
  }
}

/**
 * Récupère les options d'un produit filtrées par type (kind)
 */
export async function getOptionsByType(
  productId: string,
  kind: string
): Promise<ProductOption[]> {
  try {
    const { data, error } = await supabase
      .from('product_options')
      .select('*')
      .eq('product_id', productId)
      .eq('kind', kind); // Changé de 'type' à 'kind'

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching options by kind:', error);
    throw error;
  }
}
