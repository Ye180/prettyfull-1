import { z } from "zod";
import {
	MANUAL_STOCK_REASONS,
	STOCK_MOVEMENT_DIRECTIONS,
	STOCK_MOVEMENT_REASONS,
	STOCK_STATUSES,
	RESERVATION_STATUSES,
} from "./enums.js";
import { paginationQuerySchema, quantitySchema, uuidSchema } from "./common.js";

/**
 * Un point de stock, au niveau le plus fin disponible (§2.3) :
 * variante + taille, sinon taille du produit, sinon variante seule,
 * sinon le produit lui-même.
 */
export const inventoryItemSchema = z.object({
	id: uuidSchema,
	productId: uuidSchema,
	variantId: uuidSchema.nullable(),
	sizeId: uuidSchema.nullable(),
	/** Quantité physiquement détenue, réservations incluses. */
	quantity: z.number().int(),
	/** Quantité immobilisée par des paiements en cours. */
	reservedQuantity: z.number().int(),
	/** `quantity - reservedQuantity` : ce qui est réellement vendable. */
	availableQuantity: z.number().int(),
	lowStockThreshold: z.number().int(),
	allowBackorder: z.boolean(),
	stockStatus: z.enum(STOCK_STATUSES),
	updatedAt: z.string(),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema>;

/** Ligne de la vue consolidée des stocks (§4.3). */
export const inventoryRowSchema = inventoryItemSchema.extend({
	productName: z.string(),
	productSlug: z.string(),
	variantName: z.string().nullable(),
	sizeLabel: z.string().nullable(),
	sku: z.string().nullable(),
	thumbnail: z.string().nullable(),
});

export type InventoryRow = z.infer<typeof inventoryRowSchema>;

/**
 * Ajustement manuel. Le motif est obligatoire - c'est le critère
 * d'acceptation §7 (« historisé avec motif et auteur »).
 */
export const stockAdjustmentSchema = z.object({
	inventoryItemId: uuidSchema,
	/** Delta signé : `-3` pour une casse, `+50` pour une réception. */
	delta: z.number().int().refine((v) => v !== 0, "L'ajustement ne peut pas être nul."),
	reason: z.enum(MANUAL_STOCK_REASONS),
	note: z.string().trim().max(500).optional(),
});

export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;

/** Ajustement en lot, utilisé par l'écran d'inventaire. */
export const bulkStockAdjustmentSchema = z.object({
	adjustments: z.array(stockAdjustmentSchema).min(1).max(500),
});

/** Fixe la quantité à une valeur absolue (inventaire physique). */
export const stockSetSchema = z.object({
	inventoryItemId: uuidSchema,
	quantity: quantitySchema,
	reason: z.enum(MANUAL_STOCK_REASONS).default("inventory_count"),
	note: z.string().trim().max(500).optional(),
});

export const updateInventorySettingsSchema = z.object({
	lowStockThreshold: z.number().int().min(0).optional(),
	allowBackorder: z.boolean().optional(),
});

export const stockMovementSchema = z.object({
	id: uuidSchema,
	inventoryItemId: uuidSchema,
	direction: z.enum(STOCK_MOVEMENT_DIRECTIONS),
	quantity: z.number().int(),
	quantityBefore: z.number().int(),
	quantityAfter: z.number().int(),
	reason: z.enum(STOCK_MOVEMENT_REASONS),
	note: z.string().nullable(),
	orderId: uuidSchema.nullable(),
	userId: uuidSchema.nullable(),
	userName: z.string().nullable(),
	createdAt: z.string(),
});

export type StockMovement = z.infer<typeof stockMovementSchema>;

export const stockReservationSchema = z.object({
	id: uuidSchema,
	inventoryItemId: uuidSchema,
	orderId: uuidSchema.nullable(),
	cartId: uuidSchema.nullable(),
	quantity: z.number().int(),
	status: z.enum(RESERVATION_STATUSES),
	expiresAt: z.string(),
	createdAt: z.string(),
	releasedAt: z.string().nullable(),
});

export const inventoryListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	productId: uuidSchema.optional(),
	stockStatus: z.enum(STOCK_STATUSES).optional(),
	/** Raccourci de l'écran d'alertes : ne renvoie que faible + rupture. */
	lowStockOnly: z.stringbool().optional(),
});

export const stockMovementListQuerySchema = paginationQuerySchema.extend({
	inventoryItemId: uuidSchema.optional(),
	productId: uuidSchema.optional(),
	orderId: uuidSchema.optional(),
	userId: uuidSchema.optional(),
	reason: z.enum(STOCK_MOVEMENT_REASONS).optional(),
	from: z.iso.datetime().optional(),
	to: z.iso.datetime().optional(),
});

/**
 * Dérive le statut affiché côté front à partir du disponible (§2.3).
 * Le seuil est inclusif : `available <= threshold` déclenche l'alerte.
 */
export const deriveStockStatus = (
	availableQuantity: number,
	lowStockThreshold: number,
	allowBackorder = false,
): (typeof STOCK_STATUSES)[number] => {
	if (availableQuantity <= 0) return allowBackorder ? "low_stock" : "out_of_stock";
	if (availableQuantity <= lowStockThreshold) return "low_stock";
	return "in_stock";
};
