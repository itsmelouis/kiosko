/**
 * Données mock pour le frontend Kiosko
 * Alignées sur le schéma DB PostgreSQL
 * TODO: Supprimer ce fichier quand le backend sera prêt
 */
import { Category, Product, ProductOption, User } from '@/types';

// ============================================
// PLACEHOLDER IMAGES
// ============================================
const IMG = {
  burger: 'https://placehold.co/300x200/FF6B35/FFFFFF?text=Burger',
  chicken: 'https://placehold.co/300x200/F4A460/FFFFFF?text=Poulet',
  salad: 'https://placehold.co/300x200/32CD32/FFFFFF?text=Salade',
  fries: 'https://placehold.co/300x200/FFD700/333333?text=Frites',
  dessert: 'https://placehold.co/300x200/FF69B4/FFFFFF?text=Dessert',
  drink: 'https://placehold.co/300x200/4169E1/FFFFFF?text=Boisson',
  nuggets: 'https://placehold.co/300x200/DAA520/FFFFFF?text=Nuggets',
  wrap: 'https://placehold.co/300x200/DEB887/333333?text=Wrap',
  sundae: 'https://placehold.co/300x200/8B4513/FFFFFF?text=Sundae',
  coca: 'https://placehold.co/300x200/CC0000/FFFFFF?text=Coca',
  water: 'https://placehold.co/300x200/87CEEB/333333?text=Eau',
};

// ============================================
// CATÉGORIES (table: categories)
// ============================================
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Burgers', slug: 'burgers', position: 1, icon: 'fast-food' },
  { id: 'cat-2', name: 'Poulet', slug: 'poulet', position: 2, icon: 'restaurant' },
  { id: 'cat-3', name: 'Salades', slug: 'salades', position: 3, icon: 'leaf' },
  { id: 'cat-4', name: 'Accompagnements', slug: 'accompagnements', position: 4, icon: 'grid' },
  { id: 'cat-5', name: 'Desserts', slug: 'desserts', position: 5, icon: 'ice-cream' },
  { id: 'cat-6', name: 'Boissons', slug: 'boissons', position: 6, icon: 'cafe' },
];

// ============================================
// OPTIONS PRODUIT (table: product_options)
// ============================================
export const MOCK_OPTIONS: ProductOption[] = [
  // Options pour Big Kiosko (prod-1)
  { id: 'opt-1', product_id: 'prod-1', label: 'Normal', kind: 'size', price_delta: 0, is_default: true },
  { id: 'opt-2', product_id: 'prod-1', label: 'XL', kind: 'size', price_delta: 2.00, is_default: false },
  { id: 'opt-3', product_id: 'prod-1', label: 'Bacon', kind: 'extra', price_delta: 1.50, is_default: false },
  { id: 'opt-4', product_id: 'prod-1', label: 'Oeuf', kind: 'extra', price_delta: 1.00, is_default: false },
  { id: 'opt-5', product_id: 'prod-1', label: 'Double fromage', kind: 'extra', price_delta: 1.00, is_default: false },

  // Options pour Frites (prod-6)
  { id: 'opt-6', product_id: 'prod-6', label: 'Petite', kind: 'size', price_delta: 0, is_default: true },
  { id: 'opt-7', product_id: 'prod-6', label: 'Moyenne', kind: 'size', price_delta: 0.80, is_default: false },
  { id: 'opt-8', product_id: 'prod-6', label: 'Grande', kind: 'size', price_delta: 1.50, is_default: false },

  // Options pour Nuggets (prod-4)
  { id: 'opt-9', product_id: 'prod-4', label: 'Ketchup', kind: 'sauce', price_delta: 0, is_default: true },
  { id: 'opt-10', product_id: 'prod-4', label: 'BBQ', kind: 'sauce', price_delta: 0, is_default: false },
  { id: 'opt-11', product_id: 'prod-4', label: 'Curry', kind: 'sauce', price_delta: 0, is_default: false },

  // Options pour Coca (prod-8)
  { id: 'opt-12', product_id: 'prod-8', label: '33cl', kind: 'size', price_delta: 0, is_default: true },
  { id: 'opt-13', product_id: 'prod-8', label: '50cl', kind: 'size', price_delta: 0.60, is_default: false },
  { id: 'opt-14', product_id: 'prod-8', label: '1L', kind: 'size', price_delta: 1.20, is_default: false },

  // Options pour Cheese Burger (prod-2)
  { id: 'opt-15', product_id: 'prod-2', label: 'Normal', kind: 'size', price_delta: 0, is_default: true },
  { id: 'opt-16', product_id: 'prod-2', label: 'Double', kind: 'size', price_delta: 2.50, is_default: false },
];

// ============================================
// PRODUITS (table: products)
// ============================================
export const MOCK_PRODUCTS: Product[] = [
  // Burgers
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'Big Kiosko',
    description: 'Notre burger signature avec double steak, fromage, salade, tomates et sauce spéciale',
    base_price: 8.90,
    image_url: IMG.burger,
    is_available: true,
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Cheese Burger',
    description: 'Steak haché, fromage fondu, ketchup, moutarde, cornichons',
    base_price: 5.90,
    image_url: IMG.burger,
    is_available: true,
  },
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: 'Double Bacon',
    description: 'Double steak, double bacon, cheddar, oignons frits',
    base_price: 10.90,
    image_url: IMG.burger,
    is_available: true,
  },

  // Poulet
  {
    id: 'prod-4',
    category_id: 'cat-2',
    name: 'Nuggets x6',
    description: '6 nuggets de poulet croustillants avec sauce au choix',
    base_price: 4.90,
    image_url: IMG.nuggets,
    is_available: true,
  },
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Chicken Wrap',
    description: 'Wrap au poulet croustillant, salade, tomate, sauce caesar',
    base_price: 6.50,
    image_url: IMG.wrap,
    is_available: true,
  },

  // Salades
  {
    id: 'prod-6',
    category_id: 'cat-3',
    name: 'Salade César',
    description: 'Salade romaine, poulet grillé, parmesan, croûtons, sauce César',
    base_price: 8.50,
    image_url: IMG.salad,
    is_available: true,
  },

  // Accompagnements
  {
    id: 'prod-7',
    category_id: 'cat-4',
    name: 'Frites',
    description: 'Frites croustillantes dorées à point',
    base_price: 3.50,
    image_url: IMG.fries,
    is_available: true,
  },
  {
    id: 'prod-8',
    category_id: 'cat-4',
    name: 'Potatoes',
    description: 'Quartiers de pommes de terre épicés',
    base_price: 3.90,
    image_url: IMG.fries,
    is_available: true,
  },

  // Desserts
  {
    id: 'prod-9',
    category_id: 'cat-5',
    name: 'Sundae Chocolat',
    description: 'Glace vanille, sauce chocolat, chantilly',
    base_price: 3.00,
    image_url: IMG.sundae,
    is_available: true,
  },
  {
    id: 'prod-10',
    category_id: 'cat-5',
    name: 'Cookie',
    description: 'Cookie aux pépites de chocolat',
    base_price: 1.50,
    image_url: IMG.dessert,
    is_available: true,
  },

  // Boissons
  {
    id: 'prod-11',
    category_id: 'cat-6',
    name: 'Coca-Cola',
    description: 'Coca-Cola original bien frais',
    base_price: 2.90,
    image_url: IMG.coca,
    is_available: true,
  },
  {
    id: 'prod-12',
    category_id: 'cat-6',
    name: 'Eau minérale',
    description: 'Eau minérale plate ou gazeuse',
    base_price: 2.00,
    image_url: IMG.water,
    is_available: true,
  },
];

// Helper: Ajoute les options aux produits
export function getProductsWithOptions(): Product[] {
  return MOCK_PRODUCTS.map((product) => ({
    ...product,
    options: MOCK_OPTIONS.filter((opt) => opt.product_id === product.id),
  }));
}

// ============================================
// UTILISATEUR MOCK (table: users)
// ============================================
export const MOCK_USER: User = {
  id: 'user-1',
  loyalty_qr: 'KIOSKO-LOYALTY-12345',
  firstname: 'Jean',
  lastname: 'Dupont',
  points: 150,
  created_at: new Date().toISOString(),
};
