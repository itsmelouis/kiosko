/**
 * Service commandes - Frontend uniquement
 * TODO: Remplacer par appels API/Supabase quand backend prêt
 */
import { CartItem, Order, OrderItem } from '@/types';

// Type étendu pour l'affichage (inclut order_number pour le frontend)
export interface OrderWithNumber extends Order {
  order_number: string;
}

// Store temporaire des commandes (frontend only)
const ordersStore: Order[] = [];

/**
 * Génère un numéro de commande unique (ex: A-042)
 */
function generateOrderNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const letter = letters[Math.floor(Math.random() * letters.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${letter}-${number.toString().padStart(3, '0')}`;
}

/**
 * Génère un UUID simple
 */
function generateId(): string {
  return `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Convertit les items du panier en items de commande
 */
function cartItemsToOrderItems(cartItems: CartItem[], orderId: string): OrderItem[] {
  return cartItems.map((item, index) => ({
    id: `item-${orderId}-${index}`,
    order_id: orderId,
    product_id: item.product.id,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    options: item.selectedOptions,
    line_total: item.totalPrice,
  }));
}

/**
 * Crée une nouvelle commande
 * TODO: Remplacer par appel Supabase
 */
export async function createOrder(
  cartItems: CartItem[],
  total: number,
  userId?: string | null,
  tableNumber: string = 'BORNE-1'
): Promise<OrderWithNumber> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const orderId = generateId();
  const orderNumber = generateOrderNumber();

  const newOrder: Order = {
    id: orderId,
    table_number: tableNumber,
    total_amount: total,
    status: 'pending',
    created_at: new Date().toISOString(),
    user_id: userId || null,
  };

  // Store pour simulation
  ordersStore.push(newOrder);
  
  console.log(`📦 Mock: Commande ${orderNumber} créée`, {
    items: cartItemsToOrderItems(cartItems, orderId),
    total,
  });

  return { ...newOrder, order_number: orderNumber };
}

/**
 * Récupère une commande par son ID
 * TODO: Remplacer par appel Supabase
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return ordersStore.find((o) => o.id === orderId) || null;
}

// Export du numéro de commande pour le ViewModel
export { generateOrderNumber };
