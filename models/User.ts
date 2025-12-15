/**
 * Modèle représentant un utilisateur avec son système de fidélité
 */
export interface User {
  id: string;
  loyalty_qr: string;
  firstname: string | null;
  lastname: string | null;
  points: number;
  created_at: string;
}
