/**
 * Bottom Sheet du panier
 * Affiche le contenu du panier avec possibilité de modifier
 */
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { useCartViewModel } from '@/viewmodels/CartViewModel';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { CartItemComponent } from './CartItem';

const { height } = Dimensions.get('window');

export function CartSheet() {
  const router = useRouter();
  const {
    items,
    itemCount,
    total,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCartViewModel();

  const handleCheckout = () => {
    closeCart();
    router.push('/payment');
  };

  if (!isCartOpen) return null;

  return (
    <Modal
      visible={isCartOpen}
      transparent
      animationType="slide"
      onRequestClose={closeCart}
    >
      <TouchableWithoutFeedback onPress={closeCart}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handle} />
          <View style={styles.headerContent}>
            <Text style={styles.title}>Mon Panier</Text>
            <Text style={styles.itemCount}>{itemCount} article{itemCount > 1 ? 's' : ''}</Text>
          </View>
          <TouchableOpacity onPress={closeCart} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cart-outline" size={64} color={Colors.textSecondary} />
              <Text style={styles.emptyText}>Votre panier est vide</Text>
              <Text style={styles.emptySubtext}>
                Ajoutez des produits pour commencer votre commande
              </Text>
            </View>
          ) : (
            items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onIncrement={() => incrementQuantity(item.id)}
                onDecrement={() => decrementQuantity(item.id)}
                onRemove={() => removeFromCart(item.id)}
              />
            ))
          )}
        </ScrollView>

        {/* Footer */}
        {items.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>{total.toFixed(2)} €</Text>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
              <Text style={styles.checkoutButtonText}>Payer</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.textLight} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: height * 0.75,
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    ...Shadows.lg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemCount: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  closeButton: {
    position: 'absolute',
    right: Spacing.lg,
    top: Spacing.lg,
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
    maxHeight: height * 0.45,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  emptySubtext: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.md,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
  },
  totalAmount: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  checkoutButtonText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textLight,
  },
});

export default CartSheet;
