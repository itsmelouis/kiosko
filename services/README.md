# 📦 Services API - Bloc B2

Services pour interagir avec Supabase (backend).

## 📁 Structure

```
services/
├── supabaseClient.ts    # Configuration client Supabase
├── menuService.ts       # Gestion du menu et catégories
├── productService.ts    # Gestion des produits et options
├── orderService.ts      # Gestion des commandes
├── userService.ts       # Gestion des utilisateurs et fidélité
└── index.ts            # Export centralisé
```

## 🔧 Services implémentés

### menuService
- `getMenu()` - Tous les produits disponibles
- `getCategories()` - Toutes les catégories
- `getProductsByCategory(categoryId)` - Produits par catégorie

### productService
- `getProductById(productId)` - Un produit par ID
- `getOptions(productId)` - Options d'un produit
- `getOptionsByType(productId, kind)` - Options filtrées par type

### orderService
- `createOrder(tableNumber, cartItems, userId?)` - Créer une commande
- `getOrderById(orderId)` - Récupérer une commande
- `updateOrderStatus(orderId, status)` - Mettre à jour le statut

### userService
- `getUserByQR(qrCode)` - Utilisateur par QR code
- `createUser(qrCode, firstname?, lastname?)` - Créer un utilisateur
- `updatePoints(userId, pointsToAdd)` - Gérer les points
- `getUserById(userId)` - Utilisateur par ID
- `calculateLoyaltyPoints(orderAmount)` - Calculer les points

## 🔐 Variables d'environnement

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## 📝 Utilisation

```typescript
import { getMenu, createOrder, getUserByQR } from '@/services';

// Récupérer le menu
const products = await getMenu();

// Créer une commande
const order = await createOrder('TABLE_5', cartItems);

// Scanner un QR code
const user = await getUserByQR('QR_123');
## 🗄️ Structure de la Base de Données

### Tables Utilisées
- `products` - Produits du menu
- `categories` - Catégories de produits
- `product_options` - Options des produits (tailles, extras)
- `orders` - Commandes
- `order_items` - Items des commandes
- `users` - Utilisateurs (fidélité)

## 🧪 Tests

Pour tester les services :
```typescript
// Test de connexion Supabase
import { supabase } from '@/services/supabaseClient';
const { data, error } = await supabase.from('products').select('count');

// Test getMenu
const products = await getMenu();
console.log(`${products.length} produits chargés`);

// Test getUserByQR
const user = await getUserByQR('TEST_QR_CODE');
console.log('User:', user);
```

## 📝 Prochaines Étapes (Bloc B3)

- [ ] Implémenter le CartViewModel
- [ ] Logique de calcul du total avec options
- [ ] Tests unitaires du panier
- [ ] Gestion de la persistance locale (AsyncStorage)
