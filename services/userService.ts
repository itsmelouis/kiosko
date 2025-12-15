/**
 * Service pour gérer les utilisateurs (fidélité) - Frontend uniquement
 * TODO: Remplacer par appels API/Supabase quand backend prêt
 */
import { User } from '@/types';
import { MOCK_USER } from './mockData';

// ============================================
// FONCTIONS
// ============================================

/**
 * Récupère un utilisateur par son QR code
 * TODO: Remplacer par appel Supabase
 */
export async function getUserByQR(qrCode: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // En mode mock, accepte n'importe quel QR contenant "KIOSKO"
  if (qrCode.toUpperCase().includes('KIOSKO')) {
    return MOCK_USER;
  }
  
  return null;
}

/**
 * Récupère un utilisateur par son ID
 * TODO: Remplacer par appel Supabase
 */
export async function getUserById(userId: string): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (userId === MOCK_USER.id) {
    return MOCK_USER;
  }
  
  return null;
}

/**
 * Ajoute des points de fidélité à un utilisateur
 * TODO: Remplacer par appel Supabase
 */
export async function addLoyaltyPoints(userId: string, points: number): Promise<boolean> {
  console.log(`📦 Mock: Ajout de ${points} points à l'utilisateur ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
}
