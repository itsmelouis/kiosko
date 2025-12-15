/**
 * ViewModel pour le panier (Architecture MVVM)
 * Wrapper autour du store Zustand pour logique additionnelle
 */
import { selectionFeedback } from '@/services/hapticsService';
import { createOrder } from '@/services/orderService';
import { useCartStore } from '@/stores/cartStore';
import { CartItem, Product, SelectedOptionJson } from '@/types';
import { useCallback } from 'react';

interface CartViewModel {
  // État
  items: CartItem[];
  itemCount: number;
  total: number;
  isCartOpen: boolean;

  // Actions
  addToCart: (product: Product, quantity: number, options: SelectedOptionJson[]) => void;
  removeFromCart: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  submitOrder: () => Promise<string>; // Retourne le numéro de commande
}

/**
 * Hook ViewModel pour le panier
 */
export function useCartViewModel(): CartViewModel {
  const store = useCartStore();

  const items = store.items;
  const itemCount = store.getItemCount();
  const total = store.getTotal();
  const isCartOpen = store.isCartOpen;

  const addToCart = useCallback(
    (product: Product, quantity: number, options: SelectedOptionJson[]) => {
      store.addItem(product, quantity, options);
    },
    [store]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      store.removeItem(itemId);
    },
    [store]
  );

  const updateItemQuantity = useCallback(
    (itemId: string, quantity: number) => {
      store.updateQuantity(itemId, quantity);
    },
    [store]
  );

  const incrementQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        selectionFeedback();
        store.updateQuantity(itemId, item.quantity + 1);
      }
    },
    [items, store]
  );

  const decrementQuantity = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item && item.quantity > 1) {
        selectionFeedback();
        store.updateQuantity(itemId, item.quantity - 1);
      } else if (item) {
        store.removeItem(itemId);
      }
    },
    [items, store]
  );

  const clearCart = useCallback(() => {
    store.clearCart();
  }, [store]);

  const openCart = useCallback(() => {
    store.setCartOpen(true);
  }, [store]);

  const closeCart = useCallback(() => {
    store.setCartOpen(false);
  }, [store]);

  const submitOrder = useCallback(async (): Promise<string> => {
    // Convertit les items frontend vers le format attendu par orderService
    const cartItemsForOrder = items.map((item) => ({
      ...item,
      subtotal: item.totalPrice,
    }));
    
    // Crée la commande avec tableNumber par défaut (mode borne)
    const tableNumber = store.dineMode === 'dine-in' ? 'SUR-PLACE' : 'A-EMPORTER';
    const order = await createOrder(tableNumber, cartItemsForOrder, store.user?.id);
    store.clearCart();
    
    // Retourne l'ID de commande (les 8 premiers caractères pour affichage)
    return order.id.substring(0, 8).toUpperCase();
  }, [items, store]);

  return {
    items,
    itemCount,
    total,
    isCartOpen,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    openCart,
    closeCart,
    submitOrder,
  };
}
