/**
 * Utilitaires pour la validation des entrées utilisateur
 * Fonctions pour valider numéro de table, QR code, etc.
 */

/**
 * Valide un numéro de table (format: TABLE_XX ou A-EMPORTER ou SUR-PLACE)
 */
export function isValidTableNumber(tableNumber: string): boolean {
  if (!tableNumber || tableNumber.trim() === '') {
    return false;
  }
  
  // Modes spéciaux
  if (tableNumber === 'A-EMPORTER' || tableNumber === 'SUR-PLACE') {
    return true;
  }
  
  // Format TABLE_XX (1-99)
  const tableRegex = /^TABLE_([1-9]|[1-9][0-9])$/;
  return tableRegex.test(tableNumber);
}

/**
 * Valide un QR code de fidélité (format: UUID v4)
 */
export function isValidLoyaltyQR(qrCode: string): boolean {
  if (!qrCode || qrCode.trim() === '') {
    return false;
  }
  
  // UUID v4 format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(qrCode);
}

/**
 * Valide une quantité (entier positif entre 1 et 99)
 */
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= 1 && quantity <= 99;
}

/**
 * Sanitize une chaîne de caractères (enlève les espaces en trop)
 */
export function sanitizeString(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}
