/**
 * Écran de fidélité - Choix du compte fidélité
 * Demande si le client a un compte fidélité
 */
import { Button } from '@/components/Button';
import { Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoyaltyScreen() {
  const router = useRouter();

  const handleYes = () => {
    router.push('/loyalty/scan');
  };

  const handleNo = () => {
    router.push('/menu');
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
        <View style={styles.iconContainer}>
          <Ionicons name="card" size={80} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Avez-vous un compte fidélité ?</Text>
        <Text style={styles.subtitle}>
          Scannez votre carte pour cumuler des points et profiter d&apos;avantages exclusifs
        </Text>

        {/* Boutons */}
        <View style={styles.buttonsContainer}>
          <Button
            title="Oui, scanner ma carte"
            onPress={handleYes}
            size="lg"
            icon="qr-code"
            iconPosition="left"
            style={styles.yesButton}
            fullWidth
          />
          <Button
            title="Non, continuer sans compte"
            onPress={handleNo}
            variant="outline"
            size="lg"
            style={styles.noButton}
            fullWidth
          />
        </View>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
        <Text style={styles.infoText}>
          Vous pourrez créer un compte à la fin de votre commande
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    maxWidth: 300,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: Spacing.md,
  },
  yesButton: {
    paddingVertical: Spacing.lg,
  },
  noButton: {
    paddingVertical: Spacing.lg,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
