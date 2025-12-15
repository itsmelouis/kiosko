import { supabase } from './supabaseClient';
import { User } from '../models/User';

/**
 * Service pour gérer les utilisateurs et la fidélité
 */

/**
 * Récupère un utilisateur par son QR code de fidélité
 */
export async function getUserByQR(qrCode: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('loyalty_qr', qrCode)
      .single();

    if (error) {
      // Si l'utilisateur n'existe pas, on retourne null
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by QR:', error);
    throw error;
  }
}

/**
 * Crée un nouvel utilisateur avec un QR code de fidélité
 */
export async function createUser(qrCode: string, firstname?: string, lastname?: string): Promise<User> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        loyalty_qr: qrCode,
        firstname,
        lastname,
        points: 0,
      })
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create user');

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Ajoute ou retire des points de fidélité à un utilisateur
 */
export async function updatePoints(userId: string, pointsToAdd: number): Promise<User> {
  try {
    // Récupérer les points actuels
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (!user) throw new Error('User not found');

    // Calculer les nouveaux points
    const newPoints = user.points + pointsToAdd;

    // Mettre à jour
    const { data, error } = await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update points');

    return data;
  } catch (error) {
    console.error('Error updating points:', error);
    throw error;
  }
}

/**
 * Récupère un utilisateur par son ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
}

/**
 * Calcule les points à attribuer en fonction du montant de la commande
 * Règle : 1 point par euro dépensé
 */
export function calculateLoyaltyPoints(orderAmount: number): number {
  return Math.floor(orderAmount);
}
