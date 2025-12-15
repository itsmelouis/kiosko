/**
 * Composant carte produit
 * Affiche un produit dans la liste (image, nom, prix)
 */
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { selectionFeedback } from '@/services/hapticsService';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = 100;
const MAIN_PADDING = Spacing.md * 2;
const GAP = Spacing.sm;
// Calcul: largeur écran - sidebar - padding - gap entre 2 colonnes, divisé par 2
const CARD_WIDTH = (width - SIDEBAR_WIDTH - MAIN_PADDING - GAP) / 2;

// Placeholder par défaut si pas d'image
const PLACEHOLDER_IMAGE = 'https://placehold.co/200x250/E0E0E0/666666?text=Image';

export function ProductCard({ product, onPress }: ProductCardProps) {
  const handlePress = () => {
    selectionFeedback();
    onPress(product);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: product.image_url || PLACEHOLDER_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>
            {product.base_price.toFixed(2)} €
          </Text>
          <View style={styles.addButton}>
            <Ionicons name="add" size={20} color={Colors.textLight} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: Colors.surfaceVariant,
  },
  content: {
    padding: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 14,
    height: 28,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductCard;
