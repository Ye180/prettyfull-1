import { z } from "zod";
import { STOCK_STATUSES } from "./enums.js";
/**
 * Un point de stock, au niveau le plus fin disponible (§2.3) :
 * variante + taille, sinon taille du produit, sinon variante seule,
 * sinon le produit lui-même.
 */
export declare const inventoryItemSchema: z.ZodObject<{
    id: z.ZodUUID;
    productId: z.ZodUUID;
    variantId: z.ZodNullable<z.ZodUUID>;
    sizeId: z.ZodNullable<z.ZodUUID>;
    quantity: z.ZodNumber;
    reservedQuantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    lowStockThreshold: z.ZodNumber;
    allowBackorder: z.ZodBoolean;
    stockStatus: z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
/** Ligne de la vue consolidée des stocks (§4.3). */
export declare const inventoryRowSchema: z.ZodObject<{
    id: z.ZodUUID;
    productId: z.ZodUUID;
    variantId: z.ZodNullable<z.ZodUUID>;
    sizeId: z.ZodNullable<z.ZodUUID>;
    quantity: z.ZodNumber;
    reservedQuantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    lowStockThreshold: z.ZodNumber;
    allowBackorder: z.ZodBoolean;
    stockStatus: z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>;
    updatedAt: z.ZodString;
    productName: z.ZodString;
    productSlug: z.ZodString;
    variantName: z.ZodNullable<z.ZodString>;
    sizeLabel: z.ZodNullable<z.ZodString>;
    sku: z.ZodNullable<z.ZodString>;
    thumbnail: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type InventoryRow = z.infer<typeof inventoryRowSchema>;
/**
 * Ajustement manuel. Le motif est obligatoire — c'est le critère
 * d'acceptation §7 (« historisé avec motif et auteur »).
 */
export declare const stockAdjustmentSchema: z.ZodObject<{
    inventoryItemId: z.ZodUUID;
    delta: z.ZodNumber;
    reason: z.ZodEnum<{
        supplier_receipt: "supplier_receipt";
        damage: "damage";
        inventory_count: "inventory_count";
        correction: "correction";
        manual_restock: "manual_restock";
    }>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
/** Ajustement en lot, utilisé par l'écran d'inventaire. */
export declare const bulkStockAdjustmentSchema: z.ZodObject<{
    adjustments: z.ZodArray<z.ZodObject<{
        inventoryItemId: z.ZodUUID;
        delta: z.ZodNumber;
        reason: z.ZodEnum<{
            supplier_receipt: "supplier_receipt";
            damage: "damage";
            inventory_count: "inventory_count";
            correction: "correction";
            manual_restock: "manual_restock";
        }>;
        note: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/** Fixe la quantité à une valeur absolue (inventaire physique). */
export declare const stockSetSchema: z.ZodObject<{
    inventoryItemId: z.ZodUUID;
    quantity: z.ZodNumber;
    reason: z.ZodDefault<z.ZodEnum<{
        supplier_receipt: "supplier_receipt";
        damage: "damage";
        inventory_count: "inventory_count";
        correction: "correction";
        manual_restock: "manual_restock";
    }>>;
    note: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateInventorySettingsSchema: z.ZodObject<{
    lowStockThreshold: z.ZodOptional<z.ZodNumber>;
    allowBackorder: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const stockMovementSchema: z.ZodObject<{
    id: z.ZodUUID;
    inventoryItemId: z.ZodUUID;
    direction: z.ZodEnum<{
        in: "in";
        out: "out";
    }>;
    quantity: z.ZodNumber;
    quantityBefore: z.ZodNumber;
    quantityAfter: z.ZodNumber;
    reason: z.ZodEnum<{
        order_reserved: "order_reserved";
        order_confirmed: "order_confirmed";
        order_cancelled: "order_cancelled";
        order_refunded: "order_refunded";
        reservation_expired: "reservation_expired";
        supplier_receipt: "supplier_receipt";
        damage: "damage";
        inventory_count: "inventory_count";
        correction: "correction";
        manual_restock: "manual_restock";
    }>;
    note: z.ZodNullable<z.ZodString>;
    orderId: z.ZodNullable<z.ZodUUID>;
    userId: z.ZodNullable<z.ZodUUID>;
    userName: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type StockMovement = z.infer<typeof stockMovementSchema>;
export declare const stockReservationSchema: z.ZodObject<{
    id: z.ZodUUID;
    inventoryItemId: z.ZodUUID;
    orderId: z.ZodNullable<z.ZodUUID>;
    cartId: z.ZodNullable<z.ZodUUID>;
    quantity: z.ZodNumber;
    status: z.ZodEnum<{
        active: "active";
        consumed: "consumed";
        released: "released";
        expired: "expired";
    }>;
    expiresAt: z.ZodString;
    createdAt: z.ZodString;
    releasedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export declare const inventoryListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    productId: z.ZodOptional<z.ZodUUID>;
    stockStatus: z.ZodOptional<z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>>;
    lowStockOnly: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
}, z.core.$strip>;
export declare const stockMovementListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    inventoryItemId: z.ZodOptional<z.ZodUUID>;
    productId: z.ZodOptional<z.ZodUUID>;
    orderId: z.ZodOptional<z.ZodUUID>;
    userId: z.ZodOptional<z.ZodUUID>;
    reason: z.ZodOptional<z.ZodEnum<{
        order_reserved: "order_reserved";
        order_confirmed: "order_confirmed";
        order_cancelled: "order_cancelled";
        order_refunded: "order_refunded";
        reservation_expired: "reservation_expired";
        supplier_receipt: "supplier_receipt";
        damage: "damage";
        inventory_count: "inventory_count";
        correction: "correction";
        manual_restock: "manual_restock";
    }>>;
    from: z.ZodOptional<z.ZodISODateTime>;
    to: z.ZodOptional<z.ZodISODateTime>;
}, z.core.$strip>;
/**
 * Dérive le statut affiché côté front à partir du disponible (§2.3).
 * Le seuil est inclusif : `available <= threshold` déclenche l'alerte.
 */
export declare const deriveStockStatus: (availableQuantity: number, lowStockThreshold: number, allowBackorder?: boolean) => (typeof STOCK_STATUSES)[number];
//# sourceMappingURL=inventory.d.ts.map