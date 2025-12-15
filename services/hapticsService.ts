/**
 * Service pour les retours haptiques (vibrations)
 * Utilise expo-haptics pour les feedbacks tactiles
 */
import * as Haptics from 'expo-haptics';

/**
 * Feedback léger pour les sélections
 */
export function selectionFeedback(): void {
  Haptics.selectionAsync();
}

/**
 * Feedback de succès (ex: ajout au panier)
 */
export function successFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Feedback d'erreur
 */
export function errorFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/**
 * Feedback d'avertissement
 */
export function warningFeedback(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}

/**
 * Impact léger (ex: bouton)
 */
export function lightImpact(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Impact moyen (ex: confirmation)
 */
export function mediumImpact(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Impact fort (ex: action importante)
 */
export function heavyImpact(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
