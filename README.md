# 🍽️ Kiosko - Application de Commande Restaurant

Application React Native (Expo) pour passer commande dans un restaurant via tablette/borne.

## 📋 Architecture

**MVVM (Model-View-ViewModel)**
- **Models** (`src/models/`) : Structures de données (Product, Order, CartItem...)
- **Views** (`src/screens/`, `src/components/`) : Interface utilisateur React Native
- **ViewModels** (`src/viewmodels/`) : Logique métier et état
- **Services** (`src/services/`) : Accès données (API, stockage, composants natifs)

## 🎯 User Stories (Fonctionnalités)

- **US1** - Parcourir le menu (avec filtres par catégorie)
- **US2** - Consulter un produit (détails, ingrédients)
- **US3** - Personnaliser sa commande (taille, extras, options)
- **US4** - Gérer son panier (ajout, suppression, quantités)
- **US5** - Valider sa commande (scan QR code table)
- **US6** - Paiement mocké (simulation)
- **US7** - Confirmation (numéro de commande)

## 🔧 Composants Système Natifs

1. **Caméra** - Scan QR code pour numéro de table (`expo-barcode-scanner`)
2. **Haptics** - Retours vibratoires (`expo-haptics`)
3. **Stockage local** - Sauvegarde panier (`AsyncStorage`)

## 📁 Structure du Projet

```
kiosko/
├── src/
│   ├── models/          # Modèles de données
│   ├── services/        # Services (API, QR, Haptics, Storage)
│   ├── viewmodels/      # Logique métier (MVVM)
│   ├── screens/         # Écrans de l'app (7 écrans)
│   ├── components/      # Composants réutilisables
│   ├── utils/           # Utilitaires (calculs, validations)
│   └── __tests__/       # Tests unitaires
├── app/                 # Expo Router (navigation)
├── assets/              # Images, fonts
└── package.json
```

## 🚀 Installation

### 1. Installer les dépendances
```bash
npm install
```

### 2. Installer les packages natifs
```bash
# Supabase (API)
npm install @supabase/supabase-js

# AsyncStorage
npm install @react-native-async-storage/async-storage

# Scanner QR
npx expo install expo-barcode-scanner

# Haptics
npx expo install expo-haptics

# Tests
npm install --save-dev jest @types/jest ts-jest
```

### 3. Configuration Supabase
Créer un fichier `.env` à la racine :
```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

### 4. Créer les tables Supabase
```sql
-- Voir supabase-schema.sql pour le schéma complet
```

## 🏃 Lancer l'Application

```bash
# Démarrer Expo
npm start

# Lancer sur iOS (simulateur)
npm run ios

# Lancer sur Android
npm run android
```

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm test

# Tests avec coverage
npm test -- --coverage
```

## 📝 Prochaines Étapes

1. ✅ Structure de base créée
2. ⏳ Implémenter les modèles de données
3. ⏳ Configurer Supabase et créer les tables
4. ⏳ Implémenter les services
5. ⏳ Créer les ViewModels
6. ⏳ Développer les écrans (US1 à US7)
7. ⏳ Écrire les tests unitaires
8. ⏳ Configurer CI/CD (GitHub Actions)

## 👥 Équipe

Projet d'école - Développement Natif

## 📄 Licence

Projet éducatif
