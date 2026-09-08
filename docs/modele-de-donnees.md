# Modèle de données

Documentation du schéma PostgreSQL de PrettyFull (37 tables). Le schéma vit dans
[`apps/backend/src/db/schema/`](../apps/backend/src/db/schema/), découpé par
domaine ; les migrations sont versionnées dans `src/db/migrations/`.

## Principes transverses

**Montants entiers.** Tous les prix et totaux sont stockés en entiers, dans la
plus petite unité de leur devise. Le franc CFA n'ayant pas de sous-unité,
`58500` vaut 58 500 FCFA ; en euros, `1500` vaudrait 15,00 €. Aucun flottant
n'intervient dans un calcul de total — c'est ce qui garantit qu'une facture et
une commande affichent le même montant au centime près.

**Suppression logique.** Produits, catégories et comptes portent un `deleted_at`.
Rien n'est effacé : une commande passée reste lisible même après l'archivage de
son produit.

**Énumérations dérivées.** Les types `enum` PostgreSQL sont générés depuis
[`packages/contracts`](../packages/contracts/src/enums.ts). Base, validation et
typage ne peuvent donc pas diverger.

**Traduction.** Le français vit dans les colonnes ; les autres langues dans une
colonne `translations` JSON (`{ "en": { "name": "…" } }`). Ajouter une langue ne
demande aucune migration.

---

## Catalogue

| Table | Rôle | Relations |
| --- | --- | --- |
| `products` | Produit du catalogue | N-N `categories`, 1-N `product_variants` **ou** `sizes` |
| `categories` | Rayon, arborescent | Auto-référencée, N-N `products` |
| `product_categories` | Table de liaison | `products` × `categories` |
| `product_images` | Galerie du produit | N-1 `products` |
| `product_variants` | Déclinaison couleur | N-1 `products`, 1-N `variant_images`, 1-N `sizes` |
| `variant_images` | Galerie d'un coloris | N-1 `product_variants` |
| `sizes` | Taille | N-1 `product_variants` **ou** `products` |
| `wishlist_items` | Liste de souhaits | `users` × `products` |

### La règle de cohérence (§2.2)

Un produit est **soit** « à variantes », **soit** « simple ». La contrainte est
tenue à trois niveaux, du plus permissif au plus strict :

1. **Validation Zod** — rejette une charge utile qui déclare les deux (400).
2. **Service** — revérifie sur les chemins partiels, comme l'ajout d'une variante
   à un produit existant (`INVALID_PRODUCT_MODEL`, 422).
3. **Contrainte `sizes_owner_xor`** — `(product_id is not null) <> (variant_id is
   not null)`. Aucun chemin d'écriture, présent ou futur, ne peut produire une
   taille orpheline ou doublement rattachée.

### Arborescence des catégories

La hiérarchie est portée par un **chemin matérialisé** (`path`, ex.
`boutique/robes/soiree`) plutôt que par une CTE récursive : lire un sous-arbre
devient un `LIKE 'boutique/robes%'` indexé. Le coût se déplace sur le
déplacement d'une catégorie, qui réécrit le chemin de ses descendants — une
opération rare, faite en une seule instruction atomique.

---

## Stocks

| Table | Rôle |
| --- | --- |
| `inventory_items` | Point de stock, au niveau le plus fin |
| `stock_movements` | Journal d'audit, en append-only |
| `stock_reservations` | Immobilisation temporaire pendant le paiement |

### Le niveau le plus fin (§2.3)

`inventory_items` porte le triplet `(product_id, variant_id, size_id)` et couvre
quatre formes :

| Forme | `variant_id` | `size_id` | Cas |
| --- | --- | --- | --- |
| variante + taille | renseigné | renseigné | Vêtement décliné en coloris et tailles |
| variante seule | renseigné | `NULL` | Accessoire décliné en coloris uniquement |
| taille seule | `NULL` | renseigné | Produit simple à tailles |
| produit seul | `NULL` | `NULL` | Produit sans aucune déclinaison |

L'index d'unicité est déclaré **`NULLS NOT DISTINCT`** : sans cela PostgreSQL
considère deux `NULL` comme différents et laisserait créer plusieurs points de
stock pour un même produit sans déclinaison.

### Réservation et décrémentation

`quantity` est le stock physique, réservations comprises ; `reserved_quantity`
ce qui est immobilisé par un paiement en cours. Le **disponible** est la
différence — jamais stocké, pour qu'il ne puisse pas diverger.

```
commande passée   →  reserved_quantity += n     (quantity inchangé)
paiement confirmé →  reserved_quantity -= n, quantity -= n  + mouvement au journal
paiement abandonné → reserved_quantity -= n     (purge après expiration)
```

Toute lecture-écriture passe par un `SELECT … FOR UPDATE` dans une transaction :
deux commandes simultanées sur le dernier article sont traitées l'une après
l'autre, et la seconde voit le stock déjà décrémenté.

### Traçabilité

Chaque variation de `quantity` produit **exactement une** ligne dans
`stock_movements`, avec le motif, l'auteur et les quantités avant/après. Le
motif est obligatoire par signature de fonction : il n'existe pas de chemin
permettant d'ajuster un stock sans en donner la raison.

---

## Commandes

| Table | Rôle |
| --- | --- |
| `carts` / `cart_items` | Panier serveur (client connecté ou visiteur) |
| `orders` | Commande |
| `order_items` | Ligne de commande, **instantané** |
| `order_status_history` | Historique des changements de statut |
| `refunds` | Remboursements total ou partiel |

### L'instantané (§2.4)

`order_items` copie à l'achat le libellé, le SKU, la vignette et le prix
unitaire. Les clés étrangères vers le catalogue passent à `NULL` si le produit
est supprimé — la commande reste lisible. Modifier un prix aujourd'hui ne
réécrit aucune facture d'hier.

### Cycle de vie

```
pending_payment → paid → preparing → shipped → delivered
       ↓            ↓        ↓          ↓          ↓
   cancelled   cancelled  cancelled  disputed  refunded
```

Le graphe complet vit dans
[`ORDER_STATUS_TRANSITIONS`](../packages/contracts/src/orders.ts). Le service
refuse toute transition absente du graphe : impossible d'expédier une commande
jamais payée, ou de rouvrir une commande annulée.

---

## Agrégateurs

| Table | Rôle |
| --- | --- |
| `payment_providers` | Configuration d'un moyen de paiement |
| `shipping_providers` | Configuration d'un transporteur |
| `shipping_zones` / `shipping_rates` | Zones et grille tarifaire |
| `transactions` | Journal des paiements et remboursements |
| `webhook_events` | Événements reçus, avec verrou d'idempotence |

La table ne décrit que la **configuration** ; le comportement vit dans
l'adaptateur enregistré sous la même clé
([`src/integrations/`](../apps/backend/src/integrations/)). Ajouter un
prestataire consiste à écrire un adaptateur et à l'enregistrer — aucun code du
cœur ne change.

`credentials` est chiffré en AES-256-GCM et n'est **jamais** renvoyé par l'API :
la lecture expose la liste des clés renseignées, pas leurs valeurs.

`webhook_events` porte un index unique sur `(provider_key, external_id)` : un
prestataire qui rejoue sa notification ne peut pas décrémenter le stock deux
fois.

---

## Utilisateurs et accès

| Table | Rôle |
| --- | --- |
| `users` | Clients **et** membres du back-office (`kind`) |
| `roles` / `permissions` / `role_permissions` | RBAC |
| `user_roles` | Affectation des rôles |
| `refresh_tokens` | Sessions, empreinte seule |
| `password_reset_tokens` | Réinitialisation de mot de passe |
| `addresses` | Carnet d'adresses client |
| `audit_logs` | Journal des actions sensibles (§5) |

Une seule table `users` : un client peut être promu, et les commandes pointent
vers `users` quel que soit le profil. `kind` sépare les deux populations, et les
deux portails de connexion sont cloisonnés par ce champ.

Les `refresh_tokens` ne stockent qu'une **empreinte SHA-256** : une fuite de la
base ne permet pas de rejouer une session. Chaque usage révoque le jeton
présenté et en émet un nouveau (rotation).

---

## Contenu et paramètres

| Table | Rôle |
| --- | --- |
| `banners` | Bannières, avec fenêtre de diffusion |
| `static_pages` | CGV, à propos, livraison, retours (Markdown) |
| `featured_entries` | Mises en avant, par section de page d'accueil |
| `settings` | Paramètres généraux, en clé/valeur JSON |
| `tax_rates` | Taux de taxe, en points de base |

`settings` est en clé/valeur JSON : ajouter un réglage ne demande aucune
migration, la forme étant garantie par `storeSettingsSchema` côté contrats.

Les taux de taxe sont exprimés en **points de base** (1 850 = 18,50 %) pour
rester en arithmétique entière de bout en bout.
