# useCart Hook - Documentation

Le système de panier combine **Zustand** (état local) et **React Query** (synchronisation serveur) pour une expérience optimiste avec rollback automatique.

## Architecture

```
Frontend (React)
    ↓
useCart hooks (React Query)
    ↓
Zustand Store (État local)
    ↓
Backend API (/carts)
```

## Store Zustand (`useCartStore`)

### État

- `items: CartItem[]` - Articles du panier
- Actions CRUD locales (addItem, updateQuantity, removeItem, clearCart)
- Sélecteurs dérivés (getItem, totalQuantity, totalAmount)

### Logique clé

- **Validation stricte** : ignore les items invalides (quantité ≤ 0, prix négatif)
- **Prix historique** : conserve le prix unitaire du premier ajout (pas d'écrasement)
- **Fusion intelligente** : `setCart()` déduplique par `product._id`

## Hooks Frontend

### `useHydrateCart()`

```typescript
const { data, isLoading } = useHydrateCart();
```

- Charge le panier depuis l'API au mount
- Synchronise automatiquement avec le store Zustand
- Cache 60s, refetch en arrière-plan

### `useAddToCart()`

```typescript
const addToCart = useAddToCart();
addToCart.mutate({ productId: "123", quantity: 2 });
```

- **Optimisme** : ajoute immédiatement (prix temporaire à 0)
- **Correction** : remplace par la réponse serveur (prix réel)
- **Rollback** : restaure l'état précédent en cas d'erreur

### `useUpdateCartItem()`

```typescript
const updateItem = useUpdateCartItem();
updateItem.mutate({ productId: "123", quantity: 5 });
```

- Met à jour la quantité (ou supprime si 0)
- Gestion des suppressions automatiques côté serveur

### `useRemoveCartItem()`

```typescript
const removeItem = useRemoveCartItem();
removeItem.mutate("productId123");
```

- Suppression immédiate + confirmation serveur

### `useClearCartServerAware()`

```typescript
const clearCart = useClearCartServerAware();
await clearCart(); // Vide local + serveur
```

### `useCartTotals()`

```typescript
const { quantity, amount } = useCartTotals();
// quantity: nombre total d'articles
// amount: montant total (prix × quantité)
```

## Gestion des erreurs

- **Optimistic Updates** : changements immédiats dans l'UI
- **Automatic Rollback** : restauration automatique si échec API
- **Cache Invalidation** : resynchronisation après chaque mutation

## API Endpoints

- `GET /carts` - Récupérer le panier
- `POST /carts/items` - Ajouter un article
- `PATCH /carts/items/:productId` - Modifier la quantité
- `DELETE /carts/items/:productId` - Supprimer un article
- `DELETE /carts` - Vider le panier

## Utilisation typique

```typescript
// Dans un composant produit
const addToCart = useAddToCart();
const { quantity } = useCartTotals();

const handleAddToCart = () => {
  addToCart.mutate({
    productId: product._id,
    quantity: 1
  });
};

// Dans le header
const { data: cart, isLoading } = useHydrateCart();
const { quantity, amount } = useCartTotals();

return (
  <div>
    Panier: {quantity} articles - {amount}€
  </div>
);
```

## Points d'attention

- Le hook `useHydrateCart()` doit être appelé une seule fois (layout/app niveau)
- Les prix sont figés au moment de l'ajout (historique préservé)
- Toutes les mutations invalident le cache pour rester synchronisé
- L'optimisme améliore l'UX mais nécessite une gestion d'erreur robuste
