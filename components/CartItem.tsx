/**
 * Composant item du panier
 * Affiche un item avec quantité, options, prix et actions +/-
 */
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { CartItem as CartItemType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CartItemProps {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

// Placeholder par défaut si pas d'image
const PLACEHOLDER_IMAGE = 'https://placehold.co/100x100/E0E0E0/666666?text=...';

export function CartItemComponent({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemProps) {
  const optionsText = item.selectedOptions
    .map((opt) => opt.label)
    .join(', ');

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.product.image_url || PLACEHOLDER_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.product.name}
          </Text>
          <TouchableOpacity onPress={onRemove} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
        {optionsText ? (
          <Text style={styles.options} numberOfLines={1}>
            {optionsText}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <Text style={styles.price}>{item.totalPrice.toFixed(2)} €</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={onDecrement}>
              <Ionicons name="remove" size={18} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={onIncrement}>
              <Ionicons name="add" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceVariant,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.sm,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  options: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xs,
  },
  quantityButton: {
    padding: Spacing.xs,
  },
  quantity: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
});

export default CartItemComponent;
