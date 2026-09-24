import { relations, sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, text, timestamp, unique, uuid, } from "drizzle-orm/pg-core";
import { products, productVariants, sizes } from "./catalog.js";
import { reservationStatusEnum, stockMovementDirectionEnum, stockMovementReasonEnum, } from "./enums.js";
import { users } from "./users.js";
/**
 * Point de stock, au niveau le plus fin disponible (§2.3).
 *
 * Quatre formes possibles, toutes portées par la même table :
 *   variante + taille  → produit à variantes avec tailles
 *   variante seule     → produit à variantes sans taille (ex. accessoires)
 *   taille seule       → produit simple avec tailles
 *   produit seul       → produit sans aucune déclinaison
 *
 * L'index unique est déclaré `nulls not distinct` : sans cela Postgres
 * considère deux NULL comme différents et laisserait créer plusieurs points
 * de stock pour un même produit sans déclinaison.
 *
 * `quantity` est la quantité physique (réservations comprises) et
 * `reservedQuantity` ce qui est immobilisé par un paiement en cours. Le
 * vendable est la différence - jamais stockée, pour éviter toute divergence.
 */
export const inventoryItems = pgTable("inventory_items", {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
        onDelete: "cascade",
    }),
    sizeId: uuid("size_id").references(() => sizes.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    reservedQuantity: integer("reserved_quantity").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    /** Autorise la vente à découvert : le disponible peut passer négatif. */
    allowBackorder: boolean("allow_backorder").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    unique("inventory_items_scope_unique")
        .on(table.productId, table.variantId, table.sizeId)
        .nullsNotDistinct(),
    index("inventory_items_product_idx").on(table.productId),
    index("inventory_items_variant_idx").on(table.variantId),
    index("inventory_items_size_idx").on(table.sizeId),
    // Alimente l'écran d'alertes sans scanner toute la table.
    index("inventory_items_low_stock_idx").on(sql `(${table.quantity} - ${table.reservedQuantity})`),
    check("inventory_items_reserved_positive", sql `${table.reservedQuantity} >= 0`),
    // Sans découvert autorisé, on ne peut pas réserver plus que le stock.
    check("inventory_items_reserved_within_stock", sql `${table.allowBackorder} = true or ${table.reservedQuantity} <= ${table.quantity}`),
]);
/**
 * Journal d'audit des mouvements de stock (§2.3).
 *
 * Chaque écriture sur `inventoryItems.quantity` produit exactement une ligne
 * ici, avec le motif, l'auteur et les quantités avant/après. La table est en
 * append-only : elle n'est jamais modifiée ni purgée par l'application.
 */
export const stockMovements = pgTable("stock_movements", {
    id: uuid("id").primaryKey().defaultRandom(),
    inventoryItemId: uuid("inventory_item_id")
        .notNull()
        .references(() => inventoryItems.id, { onDelete: "cascade" }),
    direction: stockMovementDirectionEnum("direction").notNull(),
    /** Valeur absolue du mouvement ; le sens est porté par `direction`. */
    quantity: integer("quantity").notNull(),
    quantityBefore: integer("quantity_before").notNull(),
    quantityAfter: integer("quantity_after").notNull(),
    reason: stockMovementReasonEnum("reason").notNull(),
    note: text("note"),
    /** Renseigné pour un mouvement d'origine commande. */
    orderId: uuid("order_id"),
    /** Renseigné pour un ajustement manuel ; NULL si l'auteur est supprimé. */
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    userLabel: text("user_label"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("stock_movements_item_idx").on(table.inventoryItemId, table.createdAt),
    index("stock_movements_order_idx").on(table.orderId),
    index("stock_movements_user_idx").on(table.userId),
    index("stock_movements_created_at_idx").on(table.createdAt),
    index("stock_movements_reason_idx").on(table.reason),
    check("stock_movements_quantity_positive", sql `${table.quantity} > 0`),
]);
/**
 * Réservation temporaire pendant le paiement (§2.3), qui empêche la survente
 * sans décrémenter un stock que la commande n'a pas encore payé.
 *
 * Une réservation `active` dont `expiresAt` est dépassé est considérée comme
 * caduque et libérée par la tâche de nettoyage. Le statut n'est donc pas
 * fiable seul : toujours le croiser avec `expiresAt`.
 */
export const stockReservations = pgTable("stock_reservations", {
    id: uuid("id").primaryKey().defaultRandom(),
    inventoryItemId: uuid("inventory_item_id")
        .notNull()
        .references(() => inventoryItems.id, { onDelete: "cascade" }),
    orderId: uuid("order_id"),
    cartId: uuid("cart_id"),
    quantity: integer("quantity").notNull(),
    status: reservationStatusEnum("status").notNull().default("active"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("stock_reservations_item_idx").on(table.inventoryItemId),
    index("stock_reservations_order_idx").on(table.orderId),
    index("stock_reservations_cart_idx").on(table.cartId),
    // Index partiel : la tâche de purge ne balaie que les lignes actives.
    index("stock_reservations_sweep_idx")
        .on(table.expiresAt)
        .where(sql `${table.status} = 'active'`),
    check("stock_reservations_quantity_positive", sql `${table.quantity} > 0`),
]);
// --- Relations -------------------------------------------------------------
export const inventoryItemsRelations = relations(inventoryItems, ({ one, many }) => ({
    product: one(products, {
        fields: [inventoryItems.productId],
        references: [products.id],
    }),
    variant: one(productVariants, {
        fields: [inventoryItems.variantId],
        references: [productVariants.id],
    }),
    size: one(sizes, { fields: [inventoryItems.sizeId], references: [sizes.id] }),
    movements: many(stockMovements),
    reservations: many(stockReservations),
}));
export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
    inventoryItem: one(inventoryItems, {
        fields: [stockMovements.inventoryItemId],
        references: [inventoryItems.id],
    }),
    user: one(users, { fields: [stockMovements.userId], references: [users.id] }),
}));
export const stockReservationsRelations = relations(stockReservations, ({ one }) => ({
    inventoryItem: one(inventoryItems, {
        fields: [stockReservations.inventoryItemId],
        references: [inventoryItems.id],
    }),
}));
//# sourceMappingURL=inventory.js.map