/**
 * Utilitaires pour les calculs de prix
 * Fonctions pour calculer total panier, prix avec options, formatage
 */

import { CartItem, Product, SelectedOptionJson } from '@/types';

/**
 * Formate un prix en euros (ex: 12.50 €)
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} €`;
}

/**
 * Calcule le prix unitaire d'un produit avec ses options
 */
export function calculateUnitPrice(
  basePrice: number,
  selectedOptions: SelectedOptionJson[]
): number {
  const optionsTotal = selectedOptions.reduce((sum, opt) => sum + opt.price_delta, 0);
  return basePrice + optionsTotal;
}

/**
 * Calcule le prix total d'un item (prix unitaire × quantité)
 */
export function calculateItemTotal(
  basePrice: number,
  selectedOptions: SelectedOptionJson[],
  quantity: number
): number {
  const unitPrice = calculateUnitPrice(basePrice, selectedOptions);
  return unitPrice * quantity;
}

/**
 * Calcule le total du panier
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.totalPrice, 0);
}

/**
 * Calcule le nombre total d'articles dans le panier
 */
export function calculateCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Calcule les points de fidélité (1 point par euro dépensé)
 */
export function calculateLoyaltyPoints(totalAmount: number): number {
  return Math.floor(totalAmount);
}
