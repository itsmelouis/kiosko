/**
 * Écran Menu - Menu principal style borne McDo
 * Colonne gauche: catégories, Droite: produits
 */
import { Button } from '@/components/Button';
import { CategoryTab } from '@/components/CategoryTab';
import { ProductCard } from '@/components/ProductCard';
import { Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { Product } from '@/types';
import { useCartViewModel } from '@/viewmodels/CartViewModel';
import { useMenuViewModel } from '@/viewmodels/MenuViewModel';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SIDEBAR_WIDTH = 100;

export default function MenuScreen() {
  const router = useRouter();
  const {
    categories,
    filteredProducts,
    selectedCategoryId,
    isLoading,
    error,
    selectCategory,
  } = useMenuViewModel();

  const { itemCount, total, openCart } = useCartViewModel();

  const handleProductPress = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement du menu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Réessayer" onPress={() => {}} icon="refresh" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={handleBack}
          variant="ghost"
          icon="arrow-back"
        />
        <Text style={styles.headerTitle}>Notre Menu</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Sidebar - Catégories */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isSelected={selectedCategoryId === category.id}
                onPress={selectCategory}
              />
            ))}
          </ScrollView>
        </View>

        {/* Main - Produits */}
        <View style={styles.main}>
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productList}
            renderItem={({ item }) => (
              <ProductCard product={item} onPress={handleProductPress} />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Aucun produit dans cette catégorie</Text>
              </View>
            }
          />
        </View>
      </View>

      {/* Footer - Panier */}
      {itemCount > 0 && (
        <View style={styles.footer}>
          <View style={styles.cartInfo}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount}</Text>
            </View>
            <Text style={styles.cartLabel}>Mon panier</Text>
          </View>
          <Text style={styles.cartTotal}>{total.toFixed(2)} €</Text>
          <Button
            title="Voir ma commande"
            onPress={openCart}
            icon="cart"
            iconPosition="left"
            size="md"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  main: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  productList: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  errorText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    marginTop: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.md,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    backgroundColor: Colors.secondary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  cartBadgeText: {
    color: Colors.textLight,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  cartLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  cartTotal: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
