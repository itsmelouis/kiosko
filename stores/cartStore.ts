/**
 * Store global du panier (Zustand)
 * Architecture MVVM - État partagé entre les écrans
 */
import { successFeedback } from '@/services/hapticsService';
import { CartItem, DineMode, Product, SelectedOptionJson, User } from '@/types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

// ============================================
// TYPES DU STORE
// ============================================
interface CartState {
  // État
  items: CartItem[];
  user: User | null;
  isCartOpen: boolean;
  dineMode: DineMode | null;

  // Getters (computed)
  getItemCount: () => number;
  getTotal: () => number;

  // Actions
  addItem: (product: Product, quantity: number, selectedOptions: SelectedOptionJson[]) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setUser: (user: User | null) => void;
  setCartOpen: (isOpen: boolean) => void;
  setDineMode: (mode: DineMode) => void;
}

// ============================================
// HELPERS
// ============================================

/**
 * Calcule le prix unitaire d'un item avec ses options
 */
function calculateUnitPrice(product: Product, selectedOptions: SelectedOptionJson[]): number {
  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price_delta, 0);
  return product.base_price + optionsPrice;
}

// ============================================
// STORE
// ============================================
export const useCartStore = create<CartState>((set, get) => ({
  // État initial
  items: [],
  user: null,
  isCartOpen: false,
  dineMode: null,

  // Getters
  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.totalPrice, 0);
  },

  // Actions
  addItem: (product, quantity, selectedOptions) => {
    const unitPrice = calculateUnitPrice(product, selectedOptions);
    const newItem: CartItem = {
      id: uuidv4(),
      product,
      quantity,
      selectedOptions,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    set((state) => ({
      items: [...state.items, newItem],
    }));

    successFeedback();
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
          : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  setUser: (user) => {
    set({ user });
  },

  setCartOpen: (isOpen) => {
    set({ isCartOpen: isOpen });
  },

  setDineMode: (mode) => {
    set({ dineMode: mode });
  },
}));

// Export du hook pour utilisation dans les composants
export default useCartStore;
