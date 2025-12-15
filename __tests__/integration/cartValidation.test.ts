/**
 * Test d'intégration - Validation du panier
 * Simule le parcours complet: ajout produits → personnalisation → validation commande
 */

import { Product, SelectedOptionJson } from '@/types';
import {
  calculateUnitPrice,
  calculateItemTotal,
  calculateCartTotal,
  calculateLoyaltyPoints,
} from '@/utils/price';
import { isValidTableNumber, isValidQuantity } from '@/utils/validators';

// Mock uuid avant import du store
jest.mock('uuid', () => ({
  v4: jest.fn()
    .mockReturnValueOnce('cart-item-1')
    .mockReturnValueOnce('cart-item-2')
    .mockReturnValueOnce('cart-item-3'),
}));

// Mock haptics
jest.mock('@/services/hapticsService', () => ({
  successFeedback: jest.fn(),
  selectionFeedback: jest.fn(),
}));

// Import store après les mocks
import { useCartStore } from '@/stores/cartStore';

// ============================================
// DONNÉES DE TEST
// ============================================

const pizzaMargherita: Product = {
  id: 'prod-pizza-1',
  category_id: 'cat-pizzas',
  name: 'Pizza Margherita',
  description: 'Tomate, mozzarella, basilic',
  base_price: 12.00,
  image_url: null,
  is_available: true,
};

const pizzaRegina: Product = {
  id: 'prod-pizza-2',
  category_id: 'cat-pizzas',
  name: 'Pizza Regina',
  description: 'Tomate, mozzarella, jambon, champignons',
  base_price: 14.00,
  image_url: null,
  is_available: true,
};

const boisson: Product = {
  id: 'prod-boisson-1',
  category_id: 'cat-boissons',
  name: 'Coca-Cola 33cl',
  description: null,
  base_price: 3.50,
  image_url: null,
  is_available: true,
};

const optionGrande: SelectedOptionJson = {
  option_id: 'opt-size-l',
  label: 'Grande',
  price_delta: 3.00,
};

const optionExtraFromage: SelectedOptionJson = {
  option_id: 'opt-extra-cheese',
  label: 'Extra fromage',
  price_delta: 1.50,
};

// ============================================
// TEST D'INTÉGRATION
// ============================================

describe('Intégration - Validation du panier', () => {
  beforeEach(() => {
    // Reset du store avant chaque test
    useCartStore.setState({
      items: [],
      user: null,
      isCartOpen: false,
      dineMode: null,
    });
  });

  it('simule un parcours complet de commande', () => {
    const store = useCartStore.getState();

    // ========================================
    // ÉTAPE 1: Sélection du mode (sur place)
    // ========================================
    store.setDineMode('dine-in');
    expect(useCartStore.getState().dineMode).toBe('dine-in');

    // ========================================
    // ÉTAPE 2: Ajout d'une pizza avec options
    // ========================================
    const pizzaOptions = [optionGrande, optionExtraFromage];
    
    // Vérification du calcul de prix unitaire
    const pizzaUnitPrice = calculateUnitPrice(pizzaMargherita.base_price, pizzaOptions);
    expect(pizzaUnitPrice).toBe(16.50); // 12 + 3 + 1.5

    // Validation de la quantité
    expect(isValidQuantity(2)).toBe(true);

    // Ajout au panier
    store.addItem(pizzaMargherita, 2, pizzaOptions);

    // Vérification
    let state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].product.name).toBe('Pizza Margherita');
    expect(state.items[0].quantity).toBe(2);
    expect(state.items[0].unitPrice).toBe(16.50);
    expect(state.items[0].totalPrice).toBe(33.00); // 16.50 * 2

    // ========================================
    // ÉTAPE 3: Ajout d'une deuxième pizza (sans options)
    // ========================================
    store.addItem(pizzaRegina, 1, []);

    state = useCartStore.getState();
    expect(state.items).toHaveLength(2);
    expect(state.items[1].unitPrice).toBe(14.00);
    expect(state.items[1].totalPrice).toBe(14.00);

    // ========================================
    // ÉTAPE 4: Ajout d'une boisson
    // ========================================
    store.addItem(boisson, 3, []);

    state = useCartStore.getState();
    expect(state.items).toHaveLength(3);
    expect(state.items[2].totalPrice).toBe(10.50); // 3.50 * 3

    // ========================================
    // ÉTAPE 5: Vérification du panier complet
    // ========================================
    const itemCount = state.getItemCount();
    expect(itemCount).toBe(6); // 2 + 1 + 3

    const total = state.getTotal();
    expect(total).toBe(57.50); // 33 + 14 + 10.50

    // Vérification avec notre fonction utilitaire
    const calculatedTotal = calculateCartTotal(state.items);
    expect(calculatedTotal).toBe(total);

    // ========================================
    // ÉTAPE 6: Modification de quantité
    // ========================================
    const pizzaItemId = state.items[0].id;
    store.updateQuantity(pizzaItemId, 1); // Réduire à 1 pizza

    state = useCartStore.getState();
    expect(state.items[0].quantity).toBe(1);
    expect(state.items[0].totalPrice).toBe(16.50);

    // Nouveau total
    const newTotal = state.getTotal();
    expect(newTotal).toBe(41.00); // 16.50 + 14 + 10.50

    // ========================================
    // ÉTAPE 7: Validation pré-commande
    // ========================================
    
    // Vérification du numéro de table pour sur place
    const tableNumber = 'SUR-PLACE';
    expect(isValidTableNumber(tableNumber)).toBe(true);

    // Calcul des points de fidélité
    const loyaltyPoints = calculateLoyaltyPoints(newTotal);
    expect(loyaltyPoints).toBe(41); // 1 point par euro

    // ========================================
    // ÉTAPE 8: Simulation de la commande
    // ========================================
    
    // Données finales de la commande
    const orderData = {
      tableNumber,
      items: state.items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        options: item.selectedOptions,
        lineTotal: item.totalPrice,
      })),
      totalAmount: newTotal,
      loyaltyPoints,
      dineMode: state.dineMode,
    };

    // Vérifications finales
    expect(orderData.items).toHaveLength(3);
    expect(orderData.totalAmount).toBe(41.00);
    expect(orderData.loyaltyPoints).toBe(41);
    expect(orderData.dineMode).toBe('dine-in');

    // Vérification de la structure de chaque item
    expect(orderData.items[0]).toEqual({
      productId: 'prod-pizza-1',
      productName: 'Pizza Margherita',
      quantity: 1,
      unitPrice: 16.50,
      options: pizzaOptions,
      lineTotal: 16.50,
    });

    // ========================================
    // ÉTAPE 9: Vider le panier après commande
    // ========================================
    store.clearCart();

    state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
    expect(state.getItemCount()).toBe(0);
    expect(state.getTotal()).toBe(0);
  });

  it('gère correctement le mode à emporter', () => {
    const store = useCartStore.getState();

    store.setDineMode('takeaway');
    store.addItem(pizzaMargherita, 1, []);

    const state = useCartStore.getState();
    expect(state.dineMode).toBe('takeaway');
    expect(isValidTableNumber('A-EMPORTER')).toBe(true);
  });

  it('empêche les quantités invalides', () => {
    expect(isValidQuantity(0)).toBe(false);
    expect(isValidQuantity(-1)).toBe(false);
    expect(isValidQuantity(100)).toBe(false);
    expect(isValidQuantity(1.5)).toBe(false);
  });

  it('calcule correctement les totaux avec options multiples', () => {
    const options = [optionGrande, optionExtraFromage];
    
    // Prix unitaire avec 2 options
    const unitPrice = calculateUnitPrice(pizzaMargherita.base_price, options);
    expect(unitPrice).toBe(16.50);

    // Total pour 3 pizzas
    const itemTotal = calculateItemTotal(pizzaMargherita.base_price, options, 3);
    expect(itemTotal).toBe(49.50);
  });

  it('supprime un article quand la quantité passe à 0', () => {
    const store = useCartStore.getState();

    store.addItem(pizzaMargherita, 1, []);
    expect(useCartStore.getState().items).toHaveLength(1);

    const itemId = useCartStore.getState().items[0].id;
    store.updateQuantity(itemId, 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
