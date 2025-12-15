/**
 * Tests unitaires - utils/validators.ts
 * Vérifie les fonctions de validation
 */

import {
  isValidTableNumber,
  isValidLoyaltyQR,
  isValidQuantity,
  sanitizeString,
} from '@/utils/validators';

describe('utils/validators', () => {
  // ============================================
  // isValidTableNumber
  // ============================================
  describe('isValidTableNumber', () => {
    it('accepte le format TABLE_X', () => {
      expect(isValidTableNumber('TABLE_1')).toBe(true);
      expect(isValidTableNumber('TABLE_5')).toBe(true);
    });

    it('accepte le format TABLE_XX', () => {
      expect(isValidTableNumber('TABLE_10')).toBe(true);
      expect(isValidTableNumber('TABLE_99')).toBe(true);
    });

    it('accepte A-EMPORTER', () => {
      expect(isValidTableNumber('A-EMPORTER')).toBe(true);
    });

    it('accepte SUR-PLACE', () => {
      expect(isValidTableNumber('SUR-PLACE')).toBe(true);
    });

    it('rejette TABLE_0', () => {
      expect(isValidTableNumber('TABLE_0')).toBe(false);
    });

    it('rejette TABLE_100 et plus', () => {
      expect(isValidTableNumber('TABLE_100')).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidTableNumber('')).toBe(false);
    });

    it('rejette un format invalide', () => {
      expect(isValidTableNumber('table_5')).toBe(false);
      expect(isValidTableNumber('TABLE 5')).toBe(false);
      expect(isValidTableNumber('5')).toBe(false);
    });
  });

  // ============================================
  // isValidLoyaltyQR
  // ============================================
  describe('isValidLoyaltyQR', () => {
    it('accepte un UUID v4 valide', () => {
      expect(isValidLoyaltyQR('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d')).toBe(true);
      expect(isValidLoyaltyQR('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('accepte UUID en majuscules', () => {
      expect(isValidLoyaltyQR('A1B2C3D4-E5F6-4A7B-8C9D-0E1F2A3B4C5D')).toBe(true);
    });

    it('rejette un UUID v1 (pas v4)', () => {
      // UUID v1 a un "1" en 13e position
      expect(isValidLoyaltyQR('550e8400-e29b-11d4-a716-446655440000')).toBe(false);
    });

    it('rejette une chaîne vide', () => {
      expect(isValidLoyaltyQR('')).toBe(false);
    });

    it('rejette un format invalide', () => {
      expect(isValidLoyaltyQR('not-a-uuid')).toBe(false);
      expect(isValidLoyaltyQR('12345')).toBe(false);
    });
  });

  // ============================================
  // isValidQuantity
  // ============================================
  describe('isValidQuantity', () => {
    it('accepte 1', () => {
      expect(isValidQuantity(1)).toBe(true);
    });

    it('accepte 99', () => {
      expect(isValidQuantity(99)).toBe(true);
    });

    it('accepte les valeurs intermédiaires', () => {
      expect(isValidQuantity(5)).toBe(true);
      expect(isValidQuantity(50)).toBe(true);
    });

    it('rejette 0', () => {
      expect(isValidQuantity(0)).toBe(false);
    });

    it('rejette les nombres négatifs', () => {
      expect(isValidQuantity(-1)).toBe(false);
    });

    it('rejette 100 et plus', () => {
      expect(isValidQuantity(100)).toBe(false);
    });

    it('rejette les décimaux', () => {
      expect(isValidQuantity(1.5)).toBe(false);
    });
  });

  // ============================================
  // sanitizeString
  // ============================================
  describe('sanitizeString', () => {
    it('supprime les espaces au début et à la fin', () => {
      expect(sanitizeString('  hello  ')).toBe('hello');
    });

    it('réduit les espaces multiples à un seul', () => {
      expect(sanitizeString('hello    world')).toBe('hello world');
    });

    it('gère les tabulations et retours à la ligne', () => {
      expect(sanitizeString('hello\t\nworld')).toBe('hello world');
    });

    it('retourne une chaîne vide si que des espaces', () => {
      expect(sanitizeString('   ')).toBe('');
    });
  });
});
