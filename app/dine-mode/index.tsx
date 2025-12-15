/**
 * Écran de choix du mode de restauration
 * Sur place ou À emporter
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { selectionFeedback } from '@/services/hapticsService';
import { useCartStore } from '@/stores/cartStore';
import { DineMode } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DineModeOption {
  id: DineMode;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const DINE_OPTIONS: DineModeOption[] = [
  {
    id: 'dine-in',
    title: 'Sur place',
    description: 'Installez-vous et dégustez dans notre restaurant',
    icon: 'restaurant',
  },
  {
    id: 'takeaway',
    title: 'À emporter',
    description: 'Récupérez votre commande au comptoir',
    icon: 'bag-handle',
  },
];

export default function DineModeScreen() {
  const router = useRouter();
  const setDineMode = useCartStore((state) => state.setDineMode);
  const [selectedMode, setSelectedMode] = useState<DineMode | null>(null);

  const handleSelect = (mode: DineMode) => {
    selectionFeedback();
    setSelectedMode(mode);
  };

  const handleContinue = () => {
    if (!selectedMode) return;
    setDineMode(selectedMode);
    router.push('/loyalty');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Button
          title=""
          onPress={handleBack}
          variant="ghost"
          icon="arrow-back"
          style={styles.backButton}
        />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Comment souhaitez-vous manger ?</Text>
        <Text style={styles.subtitle}>
          Sélectionnez une option pour continuer
        </Text>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {DINE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                selectedMode === option.id && styles.optionCardSelected,
              ]}
              onPress={() => handleSelect(option.id)}
              activeOpacity={0.8}
            >
              {/* Checkbox indicator */}
              <View
                style={[
                  styles.checkbox,
                  selectedMode === option.id && styles.checkboxSelected,
                ]}
              >
                {selectedMode === option.id && (
                  <Ionicons name="checkmark" size={20} color={Colors.textLight} />
                )}
              </View>

              {/* Icon */}
              <View
                style={[
                  styles.iconContainer,
                  selectedMode === option.id && styles.iconContainerSelected,
                ]}
              >
                <Ionicons
                  name={option.icon}
                  size={48}
                  color={selectedMode === option.id ? Colors.textLight : Colors.primary}
                />
              </View>

              {/* Text */}
              <Text
                style={[
                  styles.optionTitle,
                  selectedMode === option.id && styles.optionTitleSelected,
                ]}
              >
                {option.title}
              </Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title="Continuer"
          onPress={handleContinue}
          size="lg"
          icon="arrow-forward"
          iconPosition="right"
          disabled={!selectedMode}
          fullWidth
          style={styles.continueButton}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButton: {
    padding: Spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
    justifyContent: 'center',
  },
  optionCard: {
    flex: 1,
    maxWidth: 200,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadows.md,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '15',
  },
  checkbox: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainerSelected: {
    backgroundColor: Colors.primary,
  },
  optionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  continueButton: {
    paddingVertical: Spacing.lg,
  },
});
