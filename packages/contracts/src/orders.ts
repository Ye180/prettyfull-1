import { z } from "zod";
import {
	FULFILLMENT_STATUSES,
	ORDER_STATUSES,
	PAYMENT_STATUSES,
	TRANSACTION_KINDS,
	TRANSACTION_STATUSES,
} from "./enums.js";
import { addressInputSchema, addressSchema } from "./auth.js";
import {
	currencySchema,
	emailSchema,
	moneySchema,
	paginationQuerySchema,
	uuidSchema,
} from "./common.js";

// --- Panier ----------------------------------------------------------------

/**
 * Une ligne cible un point de stock : le produit suffit pour un produit sans
 * déclinaison, sinon il faut la variante et/ou la taille (§2.3).
 */
export const cartLineSelectorSchema = z.object({
	productId: uuidSchema,
	variantId: uuidSchema.nullish(),
	sizeId: uuidSchema.nullish(),
});

export const addCartItemSchema = cartLineSelectorSchema.extend({
	quantity: z.number().int().min(1).max(100).default(1),
});

export const updateCartItemSchema = z.object({
	/** `0` retire la ligne. */
	quantity: z.number().int().min(0).max(100),
});

export const cartItemSchema = z.object({
	id: uuidSchema,
	productId: uuidSchema,
	variantId: uuidSchema.nullable(),
	sizeId: uuidSchema.nullable(),
	inventoryItemId: uuidSchema,
	productName: z.string(),
	productSlug: z.string(),
	variantName: z.string().nullable(),
	sizeLabel: z.string().nullable(),
	sku: z.string().nullable(),
	thumbnail: z.string().nullable(),
	unitPrice: moneySchema,
	quantity: z.number().int(),
	lineTotal: moneySchema,
	/** Disponible restant : le panier affiche l'alerte sans requête supplémentaire. */
	availableQuantity: z.number().int(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const cartSchema = z.object({
	id: uuidSchema,
	userId: uuidSchema.nullable(),
	email: z.string().nullable(),
	currency: currencySchema,
	items: z.array(cartItemSchema),
	shippingAddress: addressSchema.partial().nullable(),
	billingAddress: addressSchema.partial().nullable(),
	shippingRateId: uuidSchema.nullable(),
	subtotal: moneySchema,
	shippingTotal: moneySchema,
	taxTotal: moneySchema,
	discountTotal: moneySchema,
	total: moneySchema,
	updatedAt: z.string(),
});

export type Cart = z.infer<typeof cartSchema>;

// --- Passage de commande ---------------------------------------------------

export const checkoutSchema = z.object({
	email: emailSchema,
	phone: z.string().trim().max(32).optional(),
	shippingAddress: addressInputSchema,
	/** Absente : l'adresse de livraison est réutilisée. */
	billingAddress: addressInputSchema.optional(),
	shippingRateId: uuidSchema,
	paymentProviderKey: z.string().min(1).max(64),
	note: z.string().trim().max(1_000).optional(),
	/** URL de retour après paiement externe (Wave, etc.). */
	returnUrl: z.string().max(1_000).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

/** Réponse de passage de commande : `redirectUrl` si le PSP l'exige. */
export const checkoutResultSchema = z.object({
	orderId: uuidSchema,
	displayId: z.number().int(),
	status: z.enum(ORDER_STATUSES),
	paymentStatus: z.enum(PAYMENT_STATUSES),
	redirectUrl: z.string().nullable(),
	transactionId: uuidSchema.nullable(),
});

// --- Commande --------------------------------------------------------------

/**
 * Ligne de commande. Tous les libellés et le prix sont figés à l'achat
 * (§2.4 « snapshot »), donc indépendants des modifications ultérieures du
 * catalogue. Les identifiants ne servent qu'aux liens du back-office.
 */
export const orderItemSchema = z.object({
	id: uuidSchema,
	productId: uuidSchema.nullable(),
	variantId: uuidSchema.nullable(),
	sizeId: uuidSchema.nullable(),
	productName: z.string(),
	productSlug: z.string().nullable(),
	variantName: z.string().nullable(),
	sizeLabel: z.string().nullable(),
	sku: z.string().nullable(),
	thumbnail: z.string().nullable(),
	unitPrice: moneySchema,
	quantity: z.number().int(),
	lineTotal: moneySchema,
	refundedQuantity: z.number().int(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderStatusHistorySchema = z.object({
	id: uuidSchema,
	fromStatus: z.enum(ORDER_STATUSES).nullable(),
	toStatus: z.enum(ORDER_STATUSES),
	comment: z.string().nullable(),
	userId: uuidSchema.nullable(),
	userName: z.string().nullable(),
	createdAt: z.string(),
});

export const transactionSchema = z.object({
	id: uuidSchema,
	orderId: uuidSchema,
	providerKey: z.string(),
	providerTransactionId: z.string().nullable(),
	kind: z.enum(TRANSACTION_KINDS),
	status: z.enum(TRANSACTION_STATUSES),
	amount: moneySchema,
	currency: currencySchema,
	errorMessage: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const orderSchema = z.object({
	id: uuidSchema,
	displayId: z.number().int(),
	userId: uuidSchema.nullable(),
	email: z.string(),
	phone: z.string().nullable(),
	status: z.enum(ORDER_STATUSES),
	paymentStatus: z.enum(PAYMENT_STATUSES),
	fulfillmentStatus: z.enum(FULFILLMENT_STATUSES),
	currency: currencySchema,
	items: z.array(orderItemSchema),
	shippingAddress: addressSchema.partial(),
	billingAddress: addressSchema.partial().nullable(),
	shippingMethod: z
		.object({
			rateId: uuidSchema.nullable(),
			providerKey: z.string().nullable(),
			name: z.string(),
			amount: moneySchema,
		})
		.nullable(),
	trackingNumber: z.string().nullable(),
	trackingUrl: z.string().nullable(),
	carrier: z.string().nullable(),
	subtotal: moneySchema,
	shippingTotal: moneySchema,
	taxTotal: moneySchema,
	discountTotal: moneySchema,
	total: moneySchema,
	refundedTotal: moneySchema,
	note: z.string().nullable(),
	placedAt: z.string(),
	paidAt: z.string().nullable(),
	shippedAt: z.string().nullable(),
	deliveredAt: z.string().nullable(),
	cancelledAt: z.string().nullable(),
	statusHistory: z.array(orderStatusHistorySchema).optional(),
	transactions: z.array(transactionSchema).optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

// --- Actions admin ---------------------------------------------------------

export const updateOrderStatusSchema = z.object({
	status: z.enum(ORDER_STATUSES),
	comment: z.string().trim().max(1_000).optional(),
});

export const updateFulfillmentSchema = z.object({
	fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
	trackingNumber: z.string().trim().max(120).nullish(),
	trackingUrl: z.string().trim().max(1_000).nullish(),
	carrier: z.string().trim().max(120).nullish(),
});

/**
 * Remboursement total ou partiel (§2.4). Sans `items`, le montant est
 * remboursé globalement ; avec `items`, le stock des lignes concernées est
 * réincrémenté.
 */
export const refundOrderSchema = z.object({
	amount: moneySchema.optional(),
	reason: z.string().trim().min(1).max(500),
	items: z
		.array(
			z.object({
				orderItemId: uuidSchema,
				quantity: z.number().int().min(1),
			}),
		)
		.optional(),
	/** Remet les articles remboursés en stock. */
	restock: z.boolean().default(true),
});

export const cancelOrderSchema = z.object({
	reason: z.string().trim().max(500).optional(),
});

export const orderListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	status: z.enum(ORDER_STATUSES).optional(),
	paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
	fulfillmentStatus: z.enum(FULFILLMENT_STATUSES).optional(),
	userId: uuidSchema.optional(),
	email: z.string().trim().max(254).optional(),
	from: z.iso.datetime().optional(),
	to: z.iso.datetime().optional(),
	minTotal: z.coerce.number().int().min(0).optional(),
	maxTotal: z.coerce.number().int().min(0).optional(),
});

export type OrderListQuery = z.infer<typeof orderListQuerySchema>;

/**
 * Transitions autorisées du cycle de vie (§2.4). Toute autre transition est
 * refusée par le service : c'est ce qui empêche, par exemple, de rembourser
 * une commande jamais payée.
 */
export const ORDER_STATUS_TRANSITIONS: Record<
	(typeof ORDER_STATUSES)[number],
	readonly (typeof ORDER_STATUSES)[number][]
> = {
	pending_payment: ["paid", "cancelled"],
	paid: ["preparing", "shipped", "cancelled", "refunded", "disputed"],
	preparing: ["shipped", "cancelled", "refunded", "disputed"],
	shipped: ["delivered", "disputed", "refunded"],
	delivered: ["refunded", "disputed"],
	cancelled: [],
	refunded: [],
	disputed: ["refunded", "delivered", "cancelled"],
};

export const canTransitionOrder = (
	from: (typeof ORDER_STATUSES)[number],
	to: (typeof ORDER_STATUSES)[number],
): boolean => ORDER_STATUS_TRANSITIONS[from].includes(to);
