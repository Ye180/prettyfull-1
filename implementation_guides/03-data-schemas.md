# Étape 3 : Implémentation des Schémas de Données avec Stratégie i18n

## Objectif

Implémenter tous les schémas Mongoose avec la stratégie d'internationalisation intégrée, permettant le stockage multilingue et multidevise optimisé.

## Stratégie d'Internationalisation Adoptée

### Stockage des Données Multilingues

**Principe** : Les champs traduisibles sont stockés dans un objet incorporé directement dans le document.

```typescript
// Structure i18n
interface I18nString {
  fr: string;  // Français (langue par défaut)
  en: string;  // Anglais
}

// Exemple dans un produit
{
  name: {
    fr: "Smartphone Galaxy",
    en: "Galaxy Smartphone"
  }
}
```

### Stockage des Prix Multidevise

**Principe** : Tous les prix sont stockés en base dans la devise de base unique (XOF).

```typescript
interface Price {
  amount: number;     // Montant en XOF
  currency: 'XOF';    // Toujours XOF en base
}
```

## Schémas Implémentés

### 1. Schéma i18n de Base (`i18n.schema.ts`)

#### Interfaces et Classes
- **I18nString** : Interface pour les chaînes multilingues
- **I18nStringSchema** : Schéma Mongoose pour validation
- **Price** : Interface pour les prix en XOF
- **PriceSchema** : Schéma Mongoose pour les prix
- **SupportedLanguage** : Enum des langues (FR, EN)
- **SupportedCurrency** : Enum des devises (XOF, USD)

### 2. Schéma User (`user.schema.ts`)

#### Fonctionnalités Clés
- **Hachage automatique** : Hook `pre('save')` avec bcrypt
- **Méthode de comparaison** : `comparePassword()` 
- **Sécurité** : Exclusion du mot de passe dans les réponses JSON
- **Rôles et statuts** : USER/ADMIN, ACTIVE/INACTIVE/BANNED
- **Profil complet** : Adresse, téléphone, avatar, etc.

#### Hooks Implémentés
```typescript
// Hash automatique du mot de passe
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### 3. Schéma Product (`product.schema.ts`)

#### Champs Internationalisés
- **name** : Nom en français et anglais
- **description** : Description complète multilingue
- **shortDescription** : Description courte optionnelle
- **variants** : Variantes avec noms et valeurs multilingues

#### Fonctionnalités Avancées
- **Prix comparatif** : `compareAtPrice` pour les promotions
- **Gestion des stocks** : Stock actuel + seuil d'alerte
- **SEO** : Métadonnées multilingues
- **Variants** : Support des variantes produit
- **Index de recherche** : Recherche textuelle multilingue

### 4. Schéma Category (`category.schema.ts`)

#### Structure Hiérarchique
- **parent** : Référence vers catégorie parent
- **sortOrder** : Ordre d'affichage
- **slug** : URL-friendly identifier unique

#### Champs i18n
- **name** : Nom multilingue
- **description** : Description optionnelle
- **seoMeta** : Métadonnées SEO multilingues

### 5. Schéma Order (`order.schema.ts`)

#### Architecture Incorporée
- **OrderItem** : Sous-schéma pour les articles de commande
- **Snapshot des prix** : Prix figés au moment de la commande
- **Adresses** : Livraison et facturation séparées

#### Gestion des États
- **OrderStatus** : PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
- **PaymentStatus** : PENDING → PAID/FAILED/REFUNDED
- **PaymentMethod** : Support de multiples moyens de paiement

#### Traçabilité
- **statusHistory** : Historique des changements d'état
- **trackingNumber** : Suivi de livraison

### 6. Schéma SiteContent (`site-content.schema.ts`)

#### CMS Léger
- **key** : Identifiant unique (ex: "home-hero-banner")
- **type** : Type de contenu (HERO_BANNER, PROMO_BANNER, etc.)
- **content** : Structure flexible avec champs i18n

#### Fonctionnalités CMS
- **Planification** : `publishedAt` et `expiresAt`
- **Ordre d'affichage** : `sortOrder`
- **Activation** : `isActive`

## Utilitaires d'Internationalisation

### Helpers Créés (`i18n.utils.ts`)

#### Extraction de Contenu
```typescript
extractI18nString(i18nString, language) // Extrait la bonne langue
extractI18nContext(headers) // Parse les headers HTTP
```

#### Conversion de Prix
```typescript
convertPrice(price, targetCurrency) // Convertit XOF vers USD
transformPriceDocument(doc, fields, currency) // Transforme les prix d'un document
```

#### Projections MongoDB
```typescript
createI18nProjection(fields, context) // Projection pour une seule langue
createI18nPipeline(context, i18nFields, priceFields) // Pipeline de transformation
```

### Stratégie de Réponse API

1. **Headers parsés** : `Accept-Language` et `Accept-Currency`
2. **Projection MongoDB** : Seule la langue demandée est récupérée
3. **Conversion des prix** : Transformation à la volée si devise != XOF
4. **Réponse optimisée** : Client reçoit données dans sa langue/devise

## Index MongoDB Créés

### Performances
- **Recherche textuelle** : Index composite sur tous les champs texte i18n
- **Filtres métier** : Category + Status, Featured products
- **Tri par prix** : Index sur `price.amount`

### Unicité
- **Utilisateurs** : Email unique
- **Produits** : SKU unique
- **Catégories** : Slug unique
- **Commandes** : Numéro de commande unique
- **Contenu** : Clé unique

## Avantages de cette Architecture

### Performances
- **Projection optimisée** : Transfert minimal de données
- **Index appropriés** : Requêtes rapides même avec i18n
- **Pipeline MongoDB** : Transformation côté base

### Flexibilité
- **Ajout de langues** : Simple extension du schéma i18n
- **Nouvelles devises** : Configuration centralisée des taux
- **Contenu dynamique** : CMS flexible pour tous les textes

### Maintenance
- **Code réutilisable** : Helpers centralisés
- **Validation forte** : Types TypeScript + validation Mongoose
- **Migration facile** : Structure extensible

## Prochaines Étapes

1. **Module d'authentification** avec JWT et stratégies Passport
2. **Services Redis** pour carts et wishlists
3. **Intégration des schémas** dans les modules métier
4. **Tests unitaires** pour les helpers i18n
