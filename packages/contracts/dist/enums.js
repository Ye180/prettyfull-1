/**
 * Source unique de vérité des énumérations métier.
 *
 * Chaque constante est un tuple `readonly` non vide : c'est exactement la forme
 * attendue par `z.enum()` (Zod) et par `pgEnum()` (Drizzle). Les deux couches
 * consomment ces tuples, ce qui garantit qu'un statut ajouté ici est
 * automatiquement connu de la base, de la validation et du typage.
 */
/** Client de la boutique ou membre du back-office. */
export const USER_KINDS = ["customer", "staff"];
export const USER_STATUSES = ["active", "inactive", "suspended"];
/** Rôles back-office livrés par défaut (cf. cahier des charges §2.7). */
export const ROLE_KEYS = [
    "super_admin",
    "catalog_manager",
    "order_manager",
    "support",
];
export const CONTENT_STATUSES = ["draft", "published", "archived"];
/**
 * Régime d'un produit. `simple` : les tailles sont portées par le produit.
 * `variant` : les tailles sont portées par les variantes de couleur.
 * La coexistence des deux est interdite (§2.2 « Règle de cohérence »).
 */
export const PRODUCT_KINDS = ["simple", "variant"];
export const ACTIVATION_STATUSES = ["active", "inactive"];
/** Statut d'un produit dérivé du stock, calculé et non stocké (§2.3). */
export const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock"];
/** Cycle de vie d'une commande (§2.4). */
export const ORDER_STATUSES = [
    "pending_payment",
    "paid",
    "preparing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
    "disputed",
];
export const PAYMENT_STATUSES = [
    "pending",
    "authorized",
    "paid",
    "failed",
    "partially_refunded",
    "refunded",
    "cancelled",
];
export const FULFILLMENT_STATUSES = [
    "not_fulfilled",
    "preparing",
    "shipped",
    "delivered",
    "returned",
];
export const CART_STATUSES = ["active", "completed", "abandoned"];
/**
 * Motif d'un mouvement de stock. Obligatoire à chaque écriture : c'est ce qui
 * rend le journal d'audit exploitable (§2.3).
 *
 * Les motifs `order_*` et `reservation_expired` sont réservés au système ;
 * `MANUAL_STOCK_REASONS` isole ceux qu'un administrateur peut choisir.
 */
export const STOCK_MOVEMENT_REASONS = [
    "order_reserved",
    "order_confirmed",
    "order_cancelled",
    "order_refunded",
    "reservation_expired",
    "supplier_receipt",
    "damage",
    "inventory_count",
    "correction",
    "manual_restock",
];
export const MANUAL_STOCK_REASONS = [
    "supplier_receipt",
    "damage",
    "inventory_count",
    "correction",
    "manual_restock",
];
export const STOCK_MOVEMENT_DIRECTIONS = ["in", "out"];
export const RESERVATION_STATUSES = [
    "active",
    "consumed",
    "released",
    "expired",
];
export const TRANSACTION_KINDS = ["payment", "refund"];
export const TRANSACTION_STATUSES = [
    "pending",
    "success",
    "failed",
    "cancelled",
];
/** Un agrégateur est configurable en bac à sable ou en production (§2.5). */
export const INTEGRATION_ENVIRONMENTS = ["test", "live"];
/** Mode de calcul des frais de port (§2.5). */
export const SHIPPING_RATE_KINDS = ["flat", "weight", "api"];
/** Emplacements de bannière exposés au storefront (§2.6). */
export const BANNER_PLACEMENTS = [
    "home_hero",
    "home_secondary",
    "home_promo",
    "collection_top",
    "collection_promo",
    "collection_footer",
    "sidebar",
];
/** Cycle de vie d'un message reçu via le formulaire de contact. */
export const CONTACT_MESSAGE_STATUSES = ["new", "read", "archived"];
export const FEATURED_KINDS = ["product", "category"];
/** Type de remise d'un code promo (§2.9) : pourcentage du sous-total, ou montant fixe. */
export const DISCOUNT_TYPES = ["percentage", "fixed"];
/** Devises supportées. XOF n'a pas de sous-unité - cf. `CURRENCY_EXPONENTS`. */
export const CURRENCY_CODES = ["xof", "eur", "usd"];
/**
 * Nombre de décimales par devise. Tous les montants sont stockés en entiers,
 * dans la plus petite unité : 1 500 XOF => 1500, 15,00 € => 1500.
 */
export const CURRENCY_EXPONENTS = {
    xof: 0,
    eur: 2,
    usd: 2,
};
export const LOCALES = ["fr", "en"];
export const DEFAULT_LOCALE = "fr";
export const DEFAULT_CURRENCY = "xof";
/**
 * Points de téléversement de visuels exposés par l'API.
 *
 * Partagés parce que le back-office et le backend ne peuvent pas se
 * référencer mutuellement (résolutions de modules incompatibles) : c'est le
 * seul moyen qu'un renommage casse à la compilation plutôt qu'à l'exécution.
 *
 * `catalog` exige la permission `catalog.write`, `content` la permission
 * `content.write`.
 */
export const UPLOAD_ENDPOINTS = {
    catalog: "catalogImage",
    content: "contentImage",
    reviewPhoto: "reviewPhoto",
};
//# sourceMappingURL=enums.js.map