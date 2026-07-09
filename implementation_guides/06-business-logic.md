# Étape 6 : Modules Métier (Products, Categories, Orders)

## Overview

Cette étape implémente les modules métier principaux de l'application e-commerce avec CRUD complet, pagination, projections i18n et gestion atomique des transactions.

## Modules implémentés

### 1. ProductsService

#### Fonctionnalités clés

- **CRUD complet** : Create, Read, Update, Delete
- **Pagination** : Support de la pagination avec page/limit
- **Projections i18n** : Retour des données dans la langue demandée (fr/en)
- **Gestion des stocks** : Décrémentation atomique lors des commandes
- **Recherche** : Recherche textuelle sur les produits

#### Méthodes principales

```typescript
// Récupération avec pagination et i18n
async findAll(page: number, limit: number, language: string): Promise<PaginatedProducts>

// Récupération d'un produit avec projection i18n
async findOne(id: string, language: string): Promise<TransformedProduct>

// Décrémentation atomique du stock (utilisé par OrdersService)
async decrementStock(productId: string, quantity: number): Promise<ProductDocument>
```

#### Transformation i18n

Les données sont transformées pour ne retourner que la langue demandée :

```json
{
	"name": "Nom du produit en français",
	"description": "Description en français",
	"category": {
		"name": "Nom de catégorie en français"
	}
}
```

### 2. CategoriesService

#### Fonctionnalités clés

- **CRUD complet** avec gestion hiérarchique
- **Navigation hiérarchique** : Support des catégories parent/enfant
- **Projections i18n** : Transformation selon la langue
- **Gestion de la visibilité** : isActive et isVisible

#### Méthodes principales

```typescript
// Récupération des catégories racines
async findRootCategories(language: string): Promise<Category[]>

// Récupération des sous-catégories
async findChildren(parentId: string, language: string): Promise<Category[]>

// Recherche par slug
async findBySlug(slug: string, language: string): Promise<Category>
```

### 3. OrdersService ⭐ (Cœur de l'étape)

#### Fonctionnalités clés

- **Création atomique de commandes** avec gestion des stocks
- **Transactions MongoDB** : Garantit la cohérence des données
- **Gestion des erreurs** avec rollback automatique
- **Historique des statuts** : Traçabilité complète
- **Annulation avec remise en stock**

#### Processus de création de commande

```typescript
async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDocument>
```

**Étapes atomiques :**

1. **Validation des produits**
   - Vérification de l'existence des produits
   - Contrôle des stocks disponibles

2. **Calcul des totaux**
   - Prix unitaires et totaux
   - Frais de livraison et taxes (future implémentation)

3. **Création de la commande**
   - Génération du numéro de commande (ORD-YYYYMMDD-XXXX)
   - Sauvegarde des informations de livraison/facturation

4. **Décrémentation atomique des stocks**
   - Mise à jour simultanée de tous les produits
   - Vérification que les stocks ne deviennent pas négatifs

5. **Validation finale**
   - Contrôle post-transaction des stocks
   - Rollback si problème détecté

6. **Commit de la transaction**
   - Finalisation si tout est OK
   - Préparation pour notifications (Étape 8)

#### Gestion des erreurs et rollback

```typescript
try {
	session.startTransaction();

	// Opérations atomiques...

	await session.commitTransaction();
} catch (error) {
	await session.abortTransaction(); // Rollback automatique
	throw error;
} finally {
	session.endSession();
}
```

#### Autres fonctionnalités OrdersService

```typescript
// Gestion des statuts
async updateStatus(orderId: string, status: OrderStatus): Promise<OrderDocument>
async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<OrderDocument>

// Annulation avec remise en stock
async cancelOrder(orderId: string, reason: string): Promise<OrderDocument>

// Récupération des commandes utilisateur
async findUserOrders(userId: string, page: number, limit: number): Promise<PaginatedOrders>
```

## Stratégie d'internationalisation (i18n)

### Principe

- **Stockage** : Toutes les langues stockées en base
- **Projection** : Seule la langue demandée retournée à l'API
- **Performance** : Évite les transformations côté client

### Exemple de transformation

**En base :**

```json
{
	"name": {
		"fr": "Smartphone Premium",
		"en": "Premium Smartphone"
	}
}
```

**Réponse API (language=fr) :**

```json
{
	"name": "Smartphone Premium"
}
```

## Gestion des devises

### Stockage

- **Devise de base** : XOF (Franc CFA)
- **Conversion** : Calculée à la volée selon `Accept-Currency` header

### Exemple de conversion

```typescript
if (i18nContext.currency === "USD") {
	const xofToUsdRate = 0.0016; // À récupérer d'un service externe
	aggregationPipeline.push({
		$addFields: {
			"price.amount": { $multiply: ["$price.amount", xofToUsdRate] },
		},
	});
}
```

## Architecture des modules

### Configuration des modules

```typescript
// products.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // Exporté pour OrdersService
})

// orders.module.ts
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema } // Pour la gestion des stocks
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
```

## Performance et bonnes pratiques

### Indexation MongoDB

- Index sur les champs de recherche fréquente
- Index composites pour les requêtes complexes
- Index de texte pour la recherche full-text

### Pagination optimisée

```typescript
const skip = (page - 1) * limit;
const [products, total] = await Promise.all([
	this.productModel.find().skip(skip).limit(limit).exec(),
	this.productModel.countDocuments().exec(),
]);
```

### Transactions MongoDB

- Utilisation des sessions MongoDB pour l'atomicité
- Gestion correcte des erreurs avec rollback
- Fermeture systématique des sessions

## Intégration avec Redis (Étape 5)

Le OrdersService peut intégrer avec les modules Redis :

```typescript
// Exemple d'intégration future
async createOrderFromCart(userId: string, cartData: any): Promise<OrderDocument> {
  // 1. Récupérer le panier Redis
  const cart = await this.cartsService.getCart(userId);

  // 2. Créer la commande
  const order = await this.createOrder({
    userId,
    items: cart.items,
    // ...autres données
  });

  // 3. Vider le panier après commande réussie
  await this.cartsService.clearCart(userId);

  return order;
}
```

## Préparation pour l'Étape 7 et 8

### Notifications (Étape 8)

Le OrdersService est préparé pour l'intégration avec les notifications :

```typescript
// TODO: À implémenter à l'étape 8
// await this.notificationsProducerService.addOrderCreatedJob(savedOrder._id);
```

### CMS (Étape 7)

Les services supportent déjà l'i18n nécessaire pour le module SiteContent.

## Résumé des accomplissements

✅ **ProductsService** : CRUD avec pagination et projections i18n  
✅ **CategoriesService** : Gestion hiérarchique avec i18n  
✅ **OrdersService** : Création atomique avec gestion des stocks  
✅ **Transactions MongoDB** : Atomicité garantie  
✅ **Projections i18n** : Performance optimisée  
✅ **Gestion des erreurs** : Rollback automatique

**Prochaine étape** : Étape 7 - Gestion du Contenu du Site (CMS Léger)
