/**
 * Tests unitaires - utils/price.ts
 * Vérifie les calculs de prix et formatage
 */

import {
  formatPrice,
  calculateUnitPrice,
  calculateItemTotal,
  calculateCartTotal,
  calculateCartItemCount,
  calculateLoyaltyPoints,
} from '@/utils/price';
import { CartItem, SelectedOptionJson } from '@/types';

describe('utils/price', () => {
  // ============================================
  // formatPrice
  // ============================================
  describe('formatPrice', () => {
    it('formate un prix entier correctement', () => {
      expect(formatPrice(10)).toBe('10.00 €');
    });

    it('formate un prix décimal correctement', () => {
      expect(formatPrice(12.5)).toBe('12.50 €');
    });

    it('arrondit à 2 décimales', () => {
      expect(formatPrice(12.999)).toBe('13.00 €');
    });

    it('gère le prix zéro', () => {
      expect(formatPrice(0)).toBe('0.00 €');
    });
  });

  // ============================================
  // calculateUnitPrice
  // ============================================
  describe('calculateUnitPrice', () => {
    it('retourne le prix de base si pas d\'options', () => {
      const basePrice = 10;
      const options: SelectedOptionJson[] = [];
      
      expect(calculateUnitPrice(basePrice, options)).toBe(10);
    });

    it('ajoute le prix des options', () => {
      const basePrice = 10;
      const options: SelectedOptionJson[] = [
        { option_id: '1', label: 'Grande', price_delta: 2 },
        { option_id: '2', label: 'Extra fromage', price_delta: 1.5 },
      ];
      
      expect(calculateUnitPrice(basePrice, options)).toBe(13.5);
    });

    it('gère les options avec prix négatif (réduction)', () => {
      const basePrice = 10;
      const options: SelectedOptionJson[] = [
        { option_id: '1', label: 'Petite', price_delta: -2 },
      ];
      
      expect(calculateUnitPrice(basePrice, options)).toBe(8);
    });
  });

  // ============================================
  // calculateItemTotal
  // ============================================
  describe('calculateItemTotal', () => {
    it('calcule le total pour quantité 1', () => {
      const total = calculateItemTotal(10, [], 1);
      expect(total).toBe(10);
    });

    it('multiplie par la quantité', () => {
      const total = calculateItemTotal(10, [], 3);
      expect(total).toBe(30);
    });

    it('inclut les options dans le calcul', () => {
      const options: SelectedOptionJson[] = [
        { option_id: '1', label: 'Grande', price_delta: 2 },
      ];
      const total = calculateItemTotal(10, options, 2);
      expect(total).toBe(24); // (10 + 2) * 2
    });
  });

  // ============================================
  // calculateCartTotal
  // ============================================
  describe('calculateCartTotal', () => {
    it('retourne 0 pour un panier vide', () => {
      expect(calculateCartTotal([])).toBe(0);
    });

    it('calcule le total de plusieurs items', () => {
      const items: CartItem[] = [
        {
          id: '1',
          product: { id: 'p1', category_id: 'c1', name: 'Pizza', description: null, base_price: 10, image_url: null, is_available: true },
          quantity: 2,
          selectedOptions: [],
          unitPrice: 10,
          totalPrice: 20,
        },
        {
          id: '2',
          product: { id: 'p2', category_id: 'c1', name: 'Boisson', description: null, base_price: 3, image_url: null, is_available: true },
          quantity: 1,
          selectedOptions: [],
          unitPrice: 3,
          totalPrice: 3,
        },
      ];
      
      expect(calculateCartTotal(items)).toBe(23);
    });
  });

  // ============================================
  // calculateCartItemCount
  // ============================================
  describe('calculateCartItemCount', () => {
    it('retourne 0 pour un panier vide', () => {
      expect(calculateCartItemCount([])).toBe(0);
    });

    it('compte les quantités totales', () => {
      const items: CartItem[] = [
        {
          id: '1',
          product: { id: 'p1', category_id: 'c1', name: 'Pizza', description: null, base_price: 10, image_url: null, is_available: true },
          quantity: 2,
          selectedOptions: [],
          unitPrice: 10,
          totalPrice: 20,
        },
        {
          id: '2',
          product: { id: 'p2', category_id: 'c1', name: 'Boisson', description: null, base_price: 3, image_url: null, is_available: true },
          quantity: 3,
          selectedOptions: [],
          unitPrice: 3,
          totalPrice: 9,
        },
      ];
      
      expect(calculateCartItemCount(items)).toBe(5);
    });
  });

  // ============================================
  // calculateLoyaltyPoints
  // ============================================
  describe('calculateLoyaltyPoints', () => {
    it('retourne 1 point par euro', () => {
      expect(calculateLoyaltyPoints(10)).toBe(10);
    });

    it('arrondit vers le bas', () => {
      expect(calculateLoyaltyPoints(10.99)).toBe(10);
    });

    it('retourne 0 pour moins de 1€', () => {
      expect(calculateLoyaltyPoints(0.5)).toBe(0);
    });
  });
});
