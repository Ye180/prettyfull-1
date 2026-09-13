/**
 * Source unique de vérité des énumérations métier.
 *
 * Chaque constante est un tuple `readonly` non vide : c'est exactement la forme
 * attendue par `z.enum()` (Zod) et par `pgEnum()` (Drizzle). Les deux couches
 * consomment ces tuples, ce qui garantit qu'un statut ajouté ici est
 * automatiquement connu de la base, de la validation et du typage.
 */
/** Client de la boutique ou membre du back-office. */
export declare const USER_KINDS: readonly ["customer", "staff"];
export type UserKind = (typeof USER_KINDS)[number];
export declare const USER_STATUSES: readonly ["active", "inactive", "suspended"];
export type UserStatus = (typeof USER_STATUSES)[number];
/** Rôles back-office livrés par défaut (cf. cahier des charges §2.7). */
export declare const ROLE_KEYS: readonly ["super_admin", "catalog_manager", "order_manager", "support"];
export type RoleKey = (typeof ROLE_KEYS)[number];
export declare const CONTENT_STATUSES: readonly ["draft", "published", "archived"];
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
/**
 * Régime d'un produit. `simple` : les tailles sont portées par le produit.
 * `variant` : les tailles sont portées par les variantes de couleur.
 * La coexistence des deux est interdite (§2.2 « Règle de cohérence »).
 */
export declare const PRODUCT_KINDS: readonly ["simple", "variant"];
export type ProductKind = (typeof PRODUCT_KINDS)[number];
export declare const ACTIVATION_STATUSES: readonly ["active", "inactive"];
export type ActivationStatus = (typeof ACTIVATION_STATUSES)[number];
/** Statut d'un produit dérivé du stock, calculé et non stocké (§2.3). */
export declare const STOCK_STATUSES: readonly ["in_stock", "low_stock", "out_of_stock"];
export type StockStatus = (typeof STOCK_STATUSES)[number];
/** Cycle de vie d'une commande (§2.4). */
export declare const ORDER_STATUSES: readonly ["pending_payment", "paid", "preparing", "shipped", "delivered", "cancelled", "refunded", "disputed"];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export declare const PAYMENT_STATUSES: readonly ["pending", "authorized", "paid", "failed", "partially_refunded", "refunded", "cancelled"];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export declare const FULFILLMENT_STATUSES: readonly ["not_fulfilled", "preparing", "shipped", "delivered", "returned"];
export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];
export declare const CART_STATUSES: readonly ["active", "completed", "abandoned"];
export type CartStatus = (typeof CART_STATUSES)[number];
/**
 * Motif d'un mouvement de stock. Obligatoire à chaque écriture : c'est ce qui
 * rend le journal d'audit exploitable (§2.3).
 *
 * Les motifs `order_*` et `reservation_expired` sont réservés au système ;
 * `MANUAL_STOCK_REASONS` isole ceux qu'un administrateur peut choisir.
 */
export declare const STOCK_MOVEMENT_REASONS: readonly ["order_reserved", "order_confirmed", "order_cancelled", "order_refunded", "reservation_expired", "supplier_receipt", "damage", "inventory_count", "correction", "manual_restock"];
export type StockMovementReason = (typeof STOCK_MOVEMENT_REASONS)[number];
export declare const MANUAL_STOCK_REASONS: readonly ["supplier_receipt", "damage", "inventory_count", "correction", "manual_restock"];
export type ManualStockReason = (typeof MANUAL_STOCK_REASONS)[number];
export declare const STOCK_MOVEMENT_DIRECTIONS: readonly ["in", "out"];
export type StockMovementDirection = (typeof STOCK_MOVEMENT_DIRECTIONS)[number];
export declare const RESERVATION_STATUSES: readonly ["active", "consumed", "released", "expired"];
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export declare const TRANSACTION_KINDS: readonly ["payment", "refund"];
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];
export declare const TRANSACTION_STATUSES: readonly ["pending", "success", "failed", "cancelled"];
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
/** Un agrégateur est configurable en bac à sable ou en production (§2.5). */
export declare const INTEGRATION_ENVIRONMENTS: readonly ["test", "live"];
export type IntegrationEnvironment = (typeof INTEGRATION_ENVIRONMENTS)[number];
/** Mode de calcul des frais de port (§2.5). */
export declare const SHIPPING_RATE_KINDS: readonly ["flat", "weight", "api"];
export type ShippingRateKind = (typeof SHIPPING_RATE_KINDS)[number];
/** Emplacements de bannière exposés au storefront (§2.6). */
export declare const BANNER_PLACEMENTS: readonly ["home_hero", "home_secondary", "home_promo", "collection_top", "sidebar"];
export type BannerPlacement = (typeof BANNER_PLACEMENTS)[number];
/** Cycle de vie d'un message reçu via le formulaire de contact. */
export declare const CONTACT_MESSAGE_STATUSES: readonly ["new", "read", "archived"];
export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];
export declare const FEATURED_KINDS: readonly ["product", "category"];
export type FeaturedKind = (typeof FEATURED_KINDS)[number];
/** Devises supportées. XOF n'a pas de sous-unité — cf. `CURRENCY_EXPONENTS`. */
export declare const CURRENCY_CODES: readonly ["xof", "eur", "usd"];
export type CurrencyCode = (typeof CURRENCY_CODES)[number];
/**
 * Nombre de décimales par devise. Tous les montants sont stockés en entiers,
 * dans la plus petite unité : 1 500 XOF => 1500, 15,00 € => 1500.
 */
export declare const CURRENCY_EXPONENTS: Record<CurrencyCode, number>;
export declare const LOCALES: readonly ["fr", "en"];
export type Locale = (typeof LOCALES)[number];
export declare const DEFAULT_LOCALE: Locale;
export declare const DEFAULT_CURRENCY: CurrencyCode;
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
export declare const UPLOAD_ENDPOINTS: {
    readonly catalog: "catalogImage";
    readonly content: "contentImage";
    readonly reviewPhoto: "reviewPhoto";
};
export type UploadEndpoint = (typeof UPLOAD_ENDPOINTS)[keyof typeof UPLOAD_ENDPOINTS];
//# sourceMappingURL=enums.d.ts.map