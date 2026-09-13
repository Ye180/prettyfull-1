/**
 * Source unique de vérité des énumérations métier.
 *
 * Chaque constante est un tuple `readonly` non vide : c'est exactement la forme
 * attendue par `z.enum()` (Zod) et par `pgEnum()` (Drizzle). Les deux couches
 * consomment ces tuples, ce qui garantit qu'un statut ajouté ici est
 * automatiquement connu de la base, de la validation et du typage.
 */

/** Client de la boutique ou membre du back-office. */
export const USER_KINDS = ["customer", "staff"] as const;
export type UserKind = (typeof USER_KINDS)[number];

export const USER_STATUSES = ["active", "inactive", "suspended"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

/** Rôles back-office livrés par défaut (cf. cahier des charges §2.7). */
export const ROLE_KEYS = [
	"super_admin",
	"catalog_manager",
	"order_manager",
	"support",
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/**
 * Régime d'un produit. `simple` : les tailles sont portées par le produit.
 * `variant` : les tailles sont portées par les variantes de couleur.
 * La coexistence des deux est interdite (§2.2 « Règle de cohérence »).
 */
export const PRODUCT_KINDS = ["simple", "variant"] as const;
export type ProductKind = (typeof PRODUCT_KINDS)[number];

export const ACTIVATION_STATUSES = ["active", "inactive"] as const;
export type ActivationStatus = (typeof ACTIVATION_STATUSES)[number];

/** Statut d'un produit dérivé du stock, calculé et non stocké (§2.3). */
export const STOCK_STATUSES = ["in_stock", "low_stock", "out_of_stock"] as const;
export type StockStatus = (typeof STOCK_STATUSES)[number];

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
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
	"pending",
	"authorized",
	"paid",
	"failed",
	"partially_refunded",
	"refunded",
	"cancelled",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const FULFILLMENT_STATUSES = [
	"not_fulfilled",
	"preparing",
	"shipped",
	"delivered",
	"returned",
] as const;
export type FulfillmentStatus = (typeof FULFILLMENT_STATUSES)[number];

export const CART_STATUSES = ["active", "completed", "abandoned"] as const;
export type CartStatus = (typeof CART_STATUSES)[number];

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
] as const;
export type StockMovementReason = (typeof STOCK_MOVEMENT_REASONS)[number];

export const MANUAL_STOCK_REASONS = [
	"supplier_receipt",
	"damage",
	"inventory_count",
	"correction",
	"manual_restock",
] as const;
export type ManualStockReason = (typeof MANUAL_STOCK_REASONS)[number];

export const STOCK_MOVEMENT_DIRECTIONS = ["in", "out"] as const;
export type StockMovementDirection = (typeof STOCK_MOVEMENT_DIRECTIONS)[number];

export const RESERVATION_STATUSES = [
	"active",
	"consumed",
	"released",
	"expired",
] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const TRANSACTION_KINDS = ["payment", "refund"] as const;
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];

export const TRANSACTION_STATUSES = [
	"pending",
	"success",
	"failed",
	"cancelled",
] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

/** Un agrégateur est configurable en bac à sable ou en production (§2.5). */
export const INTEGRATION_ENVIRONMENTS = ["test", "live"] as const;
export type IntegrationEnvironment = (typeof INTEGRATION_ENVIRONMENTS)[number];

/** Mode de calcul des frais de port (§2.5). */
export const SHIPPING_RATE_KINDS = ["flat", "weight", "api"] as const;
export type ShippingRateKind = (typeof SHIPPING_RATE_KINDS)[number];

/** Emplacements de bannière exposés au storefront (§2.6). */
export const BANNER_PLACEMENTS = [
	"home_hero",
	"home_secondary",
	"home_promo",
	"collection_top",
	"sidebar",
] as const;
export type BannerPlacement = (typeof BANNER_PLACEMENTS)[number];

/** Cycle de vie d'un message reçu via le formulaire de contact. */
export const CONTACT_MESSAGE_STATUSES = ["new", "read", "archived"] as const;
export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export const FEATURED_KINDS = ["product", "category"] as const;
export type FeaturedKind = (typeof FEATURED_KINDS)[number];

/** Devises supportées. XOF n'a pas de sous-unité — cf. `CURRENCY_EXPONENTS`. */
export const CURRENCY_CODES = ["xof", "eur", "usd"] as const;
export type CurrencyCode = (typeof CURRENCY_CODES)[number];

/**
 * Nombre de décimales par devise. Tous les montants sont stockés en entiers,
 * dans la plus petite unité : 1 500 XOF => 1500, 15,00 € => 1500.
 */
export const CURRENCY_EXPONENTS: Record<CurrencyCode, number> = {
	xof: 0,
	eur: 2,
	usd: 2,
};

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const DEFAULT_CURRENCY: CurrencyCode = "xof";

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
} as const;

export type UploadEndpoint = (typeof UPLOAD_ENDPOINTS)[keyof typeof UPLOAD_ENDPOINTS];
