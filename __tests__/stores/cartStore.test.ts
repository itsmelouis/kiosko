/**
 * Tests unitaires - stores/cartStore.ts
 * Vérifie le store Zustand du panier
 */

import { Product, SelectedOptionJson } from '@/types';

// Mock du module uuid AVANT d'importer le store
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

// Mock du service haptics pour éviter les erreurs
jest.mock('@/services/hapticsService', () => ({
  successFeedback: jest.fn(),
  selectionFeedback: jest.fn(),
}));

// Import du store APRÈS les mocks
import { useCartStore } from '@/stores/cartStore';

// Produit mock pour les tests
const mockProduct: Product = {
  id: 'prod-1',
  category_id: 'cat-1',
  name: 'Pizza Margherita',
  description: 'Tomate, mozzarella, basilic',
  base_price: 12.00,
  image_url: null,
  is_available: true,
};

const mockOptions: SelectedOptionJson[] = [
  { option_id: 'opt-1', label: 'Grande', price_delta: 3 },
];

describe('stores/cartStore', () => {
  // Reset le store avant chaque test
  beforeEach(() => {
    useCartStore.setState({ 
      items: [], 
      user: null, 
      isCartOpen: false, 
      dineMode: null 
    });
  });

  // ============================================
  // État initial
  // ============================================
  describe('état initial', () => {
    it('le panier est vide au départ', () => {
      const { items } = useCartStore.getState();
      expect(items).toEqual([]);
    });

    it('le nombre d\'articles est 0', () => {
      const count = useCartStore.getState().getItemCount();
      expect(count).toBe(0);
    });

    it('le total est 0', () => {
      const total = useCartStore.getState().getTotal();
      expect(total).toBe(0);
    });
  });

  // ============================================
  // addItem
  // ============================================
  describe('addItem', () => {
    it('ajoute un article au panier', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 1, []);
      
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].product.name).toBe('Pizza Margherita');
    });

    it('calcule le prix unitaire correctement', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 1, mockOptions);
      
      const { items } = useCartStore.getState();
      expect(items[0].unitPrice).toBe(15); // 12 + 3
    });

    it('calcule le prix total avec la quantité', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 2, mockOptions);
      
      const { items } = useCartStore.getState();
      expect(items[0].totalPrice).toBe(30); // (12 + 3) * 2
    });

    it('met à jour le nombre d\'articles', () => {
      const { addItem } = useCartStore.getState();
      
      addItem(mockProduct, 3, []);
      
      const count = useCartStore.getState().getItemCount();
      expect(count).toBe(3);
    });
  });

  // ============================================
  // removeItem
  // ============================================
  describe('removeItem', () => {
    it('supprime un article du panier', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, []);
      
      const { items, removeItem } = useCartStore.getState();
      const itemId = items[0].id;
      
      removeItem(itemId);
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('ne fait rien si l\'ID n\'existe pas', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, []);
      
      const { removeItem } = useCartStore.getState();
      removeItem('id-inexistant');
      
      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  // ============================================
  // updateQuantity
  // ============================================
  describe('updateQuantity', () => {
    it('met à jour la quantité d\'un article', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, []);
      
      const { items, updateQuantity } = useCartStore.getState();
      updateQuantity(items[0].id, 5);
      
      const updatedItems = useCartStore.getState().items;
      expect(updatedItems[0].quantity).toBe(5);
    });

    it('recalcule le prix total', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, mockOptions); // unitPrice = 15
      
      const { items, updateQuantity } = useCartStore.getState();
      updateQuantity(items[0].id, 3);
      
      const updatedItems = useCartStore.getState().items;
      expect(updatedItems[0].totalPrice).toBe(45); // 15 * 3
    });

    it('supprime l\'article si quantité <= 0', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, []);
      
      const { items, updateQuantity } = useCartStore.getState();
      updateQuantity(items[0].id, 0);
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  // ============================================
  // clearCart
  // ============================================
  describe('clearCart', () => {
    it('vide le panier', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct, 1, []);
      addItem(mockProduct, 2, []);
      
      const { clearCart } = useCartStore.getState();
      clearCart();
      
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  // ============================================
  // getTotal
  // ============================================
  describe('getTotal', () => {
    it('calcule le total de plusieurs articles', () => {
      const { addItem } = useCartStore.getState();
      
      // Pizza 12€ x 2 = 24€
      addItem(mockProduct, 2, []);
      
      // Pizza 15€ x 1 = 15€ (avec option)
      addItem(mockProduct, 1, mockOptions);
      
      const total = useCartStore.getState().getTotal();
      expect(total).toBe(39);
    });
  });

  // ============================================
  // setDineMode
  // ============================================
  describe('setDineMode', () => {
    it('définit le mode sur place', () => {
      const { setDineMode } = useCartStore.getState();
      
      setDineMode('dine-in');
      
      expect(useCartStore.getState().dineMode).toBe('dine-in');
    });

    it('définit le mode à emporter', () => {
      const { setDineMode } = useCartStore.getState();
      
      setDineMode('takeaway');
      
      expect(useCartStore.getState().dineMode).toBe('takeaway');
    });
  });
});
