import { supabase } from './supabaseClient';
import { Order, OrderItem } from '../models/Order';
import { CartItem } from '../models/CartItem';

/**
 * Service pour gérer les commandes (US5 - Valider commande)
 */

/**
 * Crée une nouvelle commande avec ses items
 */
export async function createOrder(
  tableNumber: string,
  cartItems: CartItem[],
  userId?: string
): Promise<Order> {
  try {
    // Calculer le total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

    // Créer la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        table_number: tableNumber,
        total_amount: totalAmount,
        status: 'pending',
        // Retiré payment_status car la colonne n'existe pas
      })
      .select()
      .single();

    if (orderError) throw orderError;
    if (!order) throw new Error('Failed to create order');

    // Créer les items de la commande
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.base_price,
      options: item.selectedOptions.map((opt) => opt.id),
      line_total: item.subtotal, // Changé de subtotal à line_total
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Récupère une commande par son ID avec ses items
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

/**
 * Met à jour le statut d'une commande
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<void> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * Met à jour le statut de paiement d'une commande
 * NOTE: payment_status n'existe pas dans le schéma actuel
 * Cette fonction est désactivée
 */
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: string
): Promise<void> {
  console.warn('updatePaymentStatus: La colonne payment_status n\'existe pas dans le schéma actuel');
  // Fonction désactivée car payment_status n'existe pas dans la table orders
}
