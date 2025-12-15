/**
 * Écran Confirmation
 * Affiche le numéro de commande et un message de remerciement
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { successFeedback } from '@/services/hapticsService';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ConfirmationScreen() {
  const { orderNumber } = useLocalSearchParams<{ orderNumber: string }>();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    successFeedback();
    
    // Animation d'entrée
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const handleNewOrder = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
        </Animated.View>

        {/* Message */}
        <Animated.View style={[styles.messageContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Commande confirmée !</Text>
          <Text style={styles.subtitle}>Merci pour votre commande</Text>

          {/* Order Number */}
          <View style={styles.orderNumberContainer}>
            <Text style={styles.orderNumberLabel}>Numéro de commande</Text>
            <Text style={styles.orderNumber}>{orderNumber || 'N/A'}</Text>
          </View>

          {/* Info */}
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color={Colors.primary} />
              <Text style={styles.infoText}>
                Votre commande sera prête dans quelques minutes
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="notifications-outline" size={24} color={Colors.primary} />
              <Text style={styles.infoText}>
                Nous vous appellerons quand elle sera prête
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Button
          title="Nouvelle commande"
          onPress={handleNewOrder}
          size="lg"
          icon="restaurant"
          iconPosition="left"
          fullWidth
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  messageContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  orderNumberContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.lg,
  },
  orderNumberLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  orderNumber: {
    fontSize: FontSizes.display,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },
  infoContainer: {
    gap: Spacing.md,
    width: 320,
    alignSelf: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});
