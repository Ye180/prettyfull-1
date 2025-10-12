# Étape 5 : Modules pilotés par Redis (CartsModule et WishlistsModule)

## Objectif

Implémenter des modules qui utilisent Redis directement (sans Mongoose) pour gérer les paniers d'achat et les listes de souhaits. Ces fonctionnalités nécessitent des accès rapides et temporaires, ce qui rend Redis parfait pour ce cas d'usage.

## Architecture Redis

### Pourquoi Redis pour ces modules ?

1. **Performance** : Accès mémoire ultra-rapide pour les opérations fréquentes
2. **Structures de données natives** : Hash pour les paniers, Sets pour les wishlists
3. **Expiration automatique** : TTL pour nettoyer automatiquement les données anciennes
4. **Scalabilité** : Distribution facile et clustering

### Structures de données utilisées

#### CartsModule - Hash Redis (HINCRBY, HGETALL, HDEL, HSET)

**Structure :** `cart:user:{userId}` → Hash

- **Clé** : `productId` ou `productId:variant1=value1,variant2=value2`
- **Valeur** : quantité (nombre)

**Exemple :**

```
cart:user:60f7b3b3b3f3f3f3f3f3f3f3 {
  "prod123": "2",
  "prod456:color=red,size=M": "1",
  "prod789": "3"
}
```

#### WishlistsModule - Set Redis (SADD, SMEMBERS, SREM, SISMEMBER)

**Structure :** `wishlist:user:{userId}` → Set

- **Membres** : liste des productId

**Exemple :**

```
wishlist:user:60f7b3b3b3f3f3f3f3f3f3f3 {
  "prod123",
  "prod456",
  "prod789"
}
```

## Implémentation

### 1. Module Redis Partagé

```typescript
// src/shared/redis/redis.module.ts
@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get<string>("REDIS_HOST", "localhost"),
          port: configService.get<number>("REDIS_PORT", 6379),
          password: configService.get<string>("REDIS_PASSWORD") || undefined,
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
```

### 2. CartsService - Opérations Hash

#### Ajouter au panier (HINCRBY)

```typescript
async addToCart(userId: string, addToCartDto: AddToCartDto) {
  const cartKey = this.getCartKey(userId);
  const itemKey = this.buildItemKey(productId, selectedVariants);

  // HINCRBY incrémente automatiquement ou crée le champ
  await this.redisClient.hincrby(cartKey, itemKey, quantity);
  await this.redisClient.expire(cartKey, 30 * 24 * 60 * 60); // 30 jours
}
```

#### Récupérer le panier (HGETALL)

```typescript
async getCart(userId: string) {
  const cartKey = this.getCartKey(userId);

  // HGETALL récupère tous les champs du hash
  const cartItems = await this.redisClient.hgetall(cartKey);
  return this.parseCartItems(cartItems);
}
```

#### Mettre à jour quantité (HSET/HDEL)

```typescript
async updateCartItem(userId: string, productId: string, updateDto: UpdateCartItemDto) {
  const cartKey = this.getCartKey(userId);
  const itemKey = this.buildItemKey(productId, updateDto.selectedVariants);

  if (quantity === 0) {
    await this.redisClient.hdel(cartKey, itemKey); // Supprime l'item
  } else {
    await this.redisClient.hset(cartKey, itemKey, quantity); // Met à jour
  }
}
```

### 3. WishlistsService - Opérations Set

#### Ajouter à la wishlist (SADD)

```typescript
async addToWishlist(userId: string, productId: string) {
  const wishlistKey = this.getWishlistKey(userId);

  // SADD ajoute uniquement si pas déjà présent
  const added = await this.redisClient.sadd(wishlistKey, productId);
  await this.redisClient.expire(wishlistKey, 90 * 24 * 60 * 60); // 90 jours

  return { added: added === 1 };
}
```

#### Récupérer la wishlist (SMEMBERS)

```typescript
async getWishlist(userId: string) {
  const wishlistKey = this.getWishlistKey(userId);

  // SMEMBERS récupère tous les membres du set
  const productIds = await this.redisClient.smembers(wishlistKey);
  return { productIds, totalItems: productIds.length };
}
```

#### Supprimer de la wishlist (SREM)

```typescript
async removeFromWishlist(userId: string, productId: string) {
  const wishlistKey = this.getWishlistKey(userId);

  // SREM supprime le membre du set
  const removed = await this.redisClient.srem(wishlistKey, productId);
  return { removed: removed === 1 };
}
```

#### Vérifier présence (SISMEMBER)

```typescript
async isInWishlist(userId: string, productId: string) {
  const wishlistKey = this.getWishlistKey(userId);

  // SISMEMBER vérifie si le membre existe dans le set
  const exists = await this.redisClient.sismember(wishlistKey, productId);
  return exists === 1;
}
```

## Configuration

### Variables d'environnement requises

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

### Import dans AppModule

```typescript
@Module({
  imports: [
    // ... autres imports
    RedisModule, // Global module
    CartsModule,
    WishlistsModule,
  ],
})
export class AppModule {}
```

## Avantages de cette approche

### Performance

- **Accès mémoire** : Temps de réponse < 1ms
- **Pas de sérialisation** : Données stockées nativement
- **Pipeline** : Batch d'opérations en une seule requête

### Simplicité

- **Pas d'ORM** : Commandes Redis directes
- **Types simples** : Strings et numbers uniquement
- **Pas de relations** : Données dénormalisées

### Scalabilité

- **Clustering Redis** : Partitioning automatique des données
- **Réplication** : Master/slave pour la haute disponibilité
- **Memory optimization** : Expiration automatique des données anciennes

## Commandes Redis utilisées

| Module    | Commande    | Usage                                       |
| --------- | ----------- | ------------------------------------------- |
| Carts     | `HINCRBY`   | Incrémenter la quantité d'un produit        |
| Carts     | `HGETALL`   | Récupérer tout le panier                    |
| Carts     | `HSET`      | Définir une quantité spécifique             |
| Carts     | `HDEL`      | Supprimer un produit du panier              |
| Wishlists | `SADD`      | Ajouter un produit à la wishlist            |
| Wishlists | `SMEMBERS`  | Récupérer toute la wishlist                 |
| Wishlists | `SREM`      | Supprimer un produit de la wishlist         |
| Wishlists | `SISMEMBER` | Vérifier si un produit est dans la wishlist |
| Les deux  | `EXPIRE`    | Définir une expiration automatique          |
| Les deux  | `DEL`       | Vider complètement panier/wishlist          |

## Points d'attention

### Gestion des variantes produit

Pour les produits avec variantes (couleur, taille), la clé est construite ainsi :
`productId:color=red,size=M`

### Expiration des données

- **Paniers** : 30 jours (usage fréquent)
- **Wishlists** : 90 jours (usage moins fréquent)

### Consistency

Redis étant single-threaded, toutes les opérations sont atomiques par nature.

### Monitoring

Surveiller :

- Mémoire Redis utilisée
- Nombre de clés actives
- Latence des opérations

## Tests

### Endpoints disponibles

#### Carts

- `GET /carts` - Récupérer le panier
- `POST /carts/items` - Ajouter au panier
- `PATCH /carts/items/:productId` - Mettre à jour quantité
- `DELETE /carts/items/:productId` - Supprimer du panier
- `DELETE /carts` - Vider le panier

#### Wishlists

- `GET /wishlists` - Récupérer la wishlist
- `POST /wishlists/:productId` - Ajouter à la wishlist
- `DELETE /wishlists/:productId` - Supprimer de la wishlist
- `DELETE /wishlists` - Vider la wishlist
- `GET /wishlists/check/:productId` - Vérifier si dans la wishlist

Cette implémentation suit parfaitement les spécifications de l'étape 5, utilisant Redis de manière optimale pour des opérations rapides et scalables.
