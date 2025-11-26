/**
 * Modèle représentant un utilisateur avec son système de fidélité
 */
export interface User {
  id: string;
  loyalty_qr: string;
  firstname?: string;
  lastname?: string;
  points: number;
  created_at?: string;
}
