/**
 * Écran Paiement Mock
 * Simule un paiement par carte bancaire
 */
import { Button } from '@/components/Button';
import { BorderRadius, Colors, FontSizes, Shadows, Spacing } from '@/constants/theme';
import { errorFeedback, successFeedback } from '@/services/hapticsService';
import { processPayment, validateCardNumber, validateCVV, validateExpiryDate } from '@/services/paymentService';
import { useCartViewModel } from '@/viewmodels/CartViewModel';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const router = useRouter();
  const { total, submitOrder } = useCartViewModel();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBack = () => {
    router.back();
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').substr(0, 19) : '';
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }
    if (!validateExpiryDate(expiry)) {
      newErrors.expiry = 'Date d\'expiration invalide';
    }
    if (!validateCVV(cvv)) {
      newErrors.cvv = 'CVV invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePay = async () => {
    if (!validate()) {
      errorFeedback();
      return;
    }

    setLoading(true);

    try {
      const result = await processPayment(total, cardNumber.replace(/\s/g, ''));

      if (result.success) {
        successFeedback();
        const orderNumber = await submitOrder();
        router.replace(`/confirmation?orderNumber=${orderNumber}`);
      } else {
        errorFeedback();
        Alert.alert('Paiement refusé', result.error || 'Une erreur est survenue');
      }
    } catch {
      errorFeedback();
      Alert.alert('Erreur', 'Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
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
        />
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total à payer</Text>
            <Text style={styles.totalAmount}>{total.toFixed(2)} €</Text>
          </View>

          {/* Card Form */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color={Colors.primary} />
              <Text style={styles.cardTitle}>Carte bancaire</Text>
            </View>

            {/* Card Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Numéro de carte</Text>
              <TextInput
                style={[styles.input, errors.cardNumber && styles.inputError]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              />
              {errors.cardNumber && (
                <Text style={styles.errorText}>{errors.cardNumber}</Text>
              )}
            </View>

            {/* Expiry & CVV */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: Spacing.md }]}>
                <Text style={styles.inputLabel}>Expiration</Text>
                <TextInput
                  style={[styles.input, errors.expiry && styles.inputError]}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={(text) => setExpiry(formatExpiry(text))}
                />
                {errors.expiry && (
                  <Text style={styles.errorText}>{errors.expiry}</Text>
                )}
              </View>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={[styles.input, errors.cvv && styles.inputError]}
                  placeholder="123"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                />
                {errors.cvv && (
                  <Text style={styles.errorText}>{errors.cvv}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Test info */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>
              Mode test : utilisez n&apos;importe quel numéro de carte.{'\n'}
              Pour simuler un échec, utilisez un numéro se terminant par 0000.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button
          title={loading ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
          onPress={handlePay}
          loading={loading}
          disabled={loading}
          size="lg"
          icon="lock-closed"
          iconPosition="left"
          fullWidth
        />
        <View style={styles.secureContainer}>
          <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
          <Text style={styles.secureText}>Paiement sécurisé</Text>
        </View>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  totalContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  totalLabel: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  totalAmount: {
    fontSize: FontSizes.display,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  secureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  secureText: {
    fontSize: FontSizes.sm,
    color: Colors.success,
  },
});
