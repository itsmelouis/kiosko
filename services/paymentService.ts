/**
 * Service pour le paiement mocké
 * Simule un paiement avec succès/échec aléatoire
 */
import { PaymentResult } from '@/types';

/**
 * Simule un délai de traitement
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Génère un ID de transaction
 */
function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
}

/**
 * Traite un paiement (mock)
 * @param amount Montant à payer
 * @param cardNumber Numéro de carte (mock)
 * @returns Résultat du paiement
 */
export async function processPayment(
  amount: number,
  cardNumber?: string
): Promise<PaymentResult> {
  // Simule un délai de traitement (1-2 secondes)
  await delay(1000 + Math.random() * 1000);

  // Règles de simulation :
  // - Si le numéro de carte se termine par 0000 → échec
  // - Sinon → succès (90% du temps pour les tests)
  const isFailCard = cardNumber?.endsWith('0000');
  const randomFail = Math.random() < 0.1; // 10% d'échec aléatoire

  if (isFailCard) {
    return {
      success: false,
      error: 'Carte refusée. Veuillez réessayer avec une autre carte.',
    };
  }

  if (randomFail) {
    return {
      success: false,
      error: 'Erreur de connexion. Veuillez réessayer.',
    };
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
  };
}

/**
 * Valide un numéro de carte (format basique)
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Supprime les espaces et tirets
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  // Vérifie que c'est 16 chiffres
  return /^\d{16}$/.test(cleaned);
}

/**
 * Valide une date d'expiration (MM/YY)
 */
export function validateExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10) + 2000;

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month);

  return expiryDate > now;
}

/**
 * Valide un CVV (3 chiffres)
 */
export function validateCVV(cvv: string): boolean {
  return /^\d{3}$/.test(cvv);
}
