/**
 * Composant onglet de catégorie
 * Bouton pour filtrer les produits par catégorie
 */
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/theme';
import { selectionFeedback } from '@/services/hapticsService';
import { Category } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryTabProps {
  category: Category;
  isSelected: boolean;
  onPress: (categoryId: string) => void;
}

export function CategoryTab({ category, isSelected, onPress }: CategoryTabProps) {
  const handlePress = () => {
    selectionFeedback();
    onPress(category.id);
  };

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={category.icon as keyof typeof Ionicons.glyphMap}
        size={24}
        color={isSelected ? Colors.textLight : Colors.primary}
      />
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.xs,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.textLight,
  },
});

export default CategoryTab;
