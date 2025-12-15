/**
 * Écran Personnalisation Produit
 * Affiche les détails du produit et permet de choisir les options
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { getOptions, getProductById } from '@/services';
import { selectionFeedback, successFeedback } from '@/services/hapticsService';
import { OptionKind, Product, ProductOption, SelectedOptionJson } from '@/types';
import { useCartViewModel } from '@/viewmodels/CartViewModel';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Placeholder par défaut
const PLACEHOLDER_IMAGE = 'https://placehold.co/400x300/E0E0E0/666666?text=Produit';

// Libellés pour les types d'options
const KIND_LABELS: Record<OptionKind, string> = {
  size: 'Taille',
  extra: 'Suppléments',
  sauce: 'Sauce',
  cooking: 'Cuisson',
  side: 'Accompagnement',
};

// Les options "single" (une seule sélection par groupe)
const SINGLE_KINDS: OptionKind[] = ['size', 'cooking'];

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCartViewModel();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptionJson[]>([]);

  // Groupe les options par kind
  const groupedOptions = useMemo((): Partial<Record<OptionKind, ProductOption[]>> => {
    if (!product?.options) return {};
    return product.options.reduce((acc, opt) => {
      if (!acc[opt.kind]) acc[opt.kind] = [];
      acc[opt.kind]!.push(opt);
      return acc;
    }, {} as Partial<Record<OptionKind, ProductOption[]>>);
  }, [product?.options]);

  const loadProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    
    try {
      // Charge le produit et ses options en parallèle
      const [productData, optionsData] = await Promise.all([
        getProductById(id),
        getOptions(id),
      ]);
      
      if (productData) {
        // Combine le produit avec ses options (adapte les types)
        const productWithOptions: Product = {
          id: productData.id,
          category_id: productData.category_id,
          name: productData.name,
          description: productData.description ?? null,
          base_price: productData.base_price,
          image_url: productData.image_url ?? null,
          is_available: productData.is_available,
          options: optionsData.map((opt) => ({
            ...opt,
            kind: opt.kind as OptionKind,
          })),
        };
        
        setProduct(productWithOptions);
        
        // Initialise avec les options par défaut
        const defaults = optionsData
          .filter((opt) => opt.is_default)
          .map((opt) => ({
            option_id: opt.id,
            label: opt.label,
            price_delta: opt.price_delta,
          }));
        setSelectedOptions(defaults);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleClose = () => {
    router.back();
  };

  const handleQuantityChange = (delta: number) => {
    selectionFeedback();
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleOptionSelect = (option: ProductOption) => {
    selectionFeedback();

    const newOption: SelectedOptionJson = {
      option_id: option.id,
      label: option.label,
      price_delta: option.price_delta,
    };

    setSelectedOptions((prev) => {
      // Pour les options "single" (size, cooking), remplace dans le même groupe
      if (SINGLE_KINDS.includes(option.kind)) {
        const otherKindOptions = prev.filter((o) => {
          const existing = product?.options?.find((po) => po.id === o.option_id);
          return existing?.kind !== option.kind;
        });
        return [...otherKindOptions, newOption];
      }
      
      // Pour les options "multiple" (extra, sauce, side), toggle
      const exists = prev.find((o) => o.option_id === option.id);
      if (exists) {
        return prev.filter((o) => o.option_id !== option.id);
      }
      return [...prev, newOption];
    });
  };

  const isOptionSelected = (optionId: string): boolean => {
    return selectedOptions.some((o) => o.option_id === optionId);
  };

  const calculateTotal = (): number => {
    if (!product) return 0;
    const optionsPrice = selectedOptions.reduce((sum, o) => sum + o.price_delta, 0);
    return (product.base_price + optionsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;
    successFeedback();
    addToCart(product, quantity, selectedOptions);
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Produit non trouvé</Text>
          <Button title="Retour" onPress={handleClose} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={{ uri: product.image_url || PLACEHOLDER_IMAGE }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.basePrice}>
            À partir de {product.base_price.toFixed(2)} €
          </Text>
        </View>

        {/* Options groupées par kind */}
        {(Object.keys(groupedOptions) as OptionKind[]).map((kind) => {
          const options = groupedOptions[kind];
          if (!options) return null;
          return (
          <View key={kind} style={styles.optionContainer}>
            <View style={styles.optionHeader}>
              <Text style={styles.optionName}>{KIND_LABELS[kind]}</Text>
              {SINGLE_KINDS.includes(kind) && (
                <Text style={styles.optionRequired}>1 choix</Text>
              )}
            </View>
            <View style={styles.choicesContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.choiceButton,
                    isOptionSelected(option.id) && styles.choiceButtonSelected,
                  ]}
                  onPress={() => handleOptionSelect(option)}
                >
                  <View style={styles.choiceContent}>
                    <View
                      style={[
                        styles.choiceIndicator,
                        SINGLE_KINDS.includes(kind) ? styles.radioIndicator : styles.checkIndicator,
                        isOptionSelected(option.id) && styles.indicatorSelected,
                      ]}
                    >
                      {isOptionSelected(option.id) && (
                        <Ionicons
                          name={SINGLE_KINDS.includes(kind) ? 'ellipse' : 'checkmark'}
                          size={SINGLE_KINDS.includes(kind) ? 10 : 14}
                          color={Colors.textLight}
                        />
                      )}
                    </View>
                    <Text style={styles.choiceName}>{option.label}</Text>
                  </View>
                  {option.price_delta !== 0 && (
                    <Text style={styles.choicePrice}>
                      {option.price_delta > 0 ? '+' : ''}{option.price_delta.toFixed(2)} €
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          );
        })}

        {/* Spacer for footer */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Quantity */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(-1)}
          >
            <Ionicons name="remove" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(1)}
          >
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Add button */}
        <Button
          title={`Ajouter • ${calculateTotal().toFixed(2)} €`}
          onPress={handleAddToCart}
          size="lg"
          style={styles.addButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    right: Spacing.md,
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.surfaceVariant,
  },
  infoContainer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  name: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  basePrice: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primary,
  },
  optionContainer: {
    backgroundColor: Colors.surface,
    marginTop: Spacing.sm,
    padding: Spacing.lg,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  optionName: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  optionRequired: {
    marginLeft: Spacing.sm,
    fontSize: FontSizes.xs,
    color: Colors.secondary,
    fontWeight: '600',
  },
  choicesContainer: {
    gap: Spacing.sm,
  },
  choiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.background,
  },
  choiceButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '10',
  },
  choiceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  choiceIndicator: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  radioIndicator: {
    borderRadius: 11,
  },
  checkIndicator: {
    borderRadius: 4,
  },
  indicatorSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceName: {
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  choicePrice: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    marginRight: Spacing.md,
  },
  quantityButton: {
    padding: Spacing.sm,
  },
  quantityText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  addButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
});
