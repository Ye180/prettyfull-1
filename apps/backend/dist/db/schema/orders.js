import { relations, sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { products, productVariants, sizes } from "./catalog.js";
import {
	cartStatusEnum,
	currencyEnum,
	fulfillmentStatusEnum,
	orderStatusEnum,
	paymentStatusEnum,
} from "./enums.js";
import { inventoryItems } from "./inventory.js";
import { users } from "./users.js";
/**
 * Panier. Un visiteur non connecté est suivi par `sessionToken` ; à la
 * connexion, son panier est fusionné avec celui du compte.
 */
export const carts = pgTable(
	"carts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
		sessionToken: varchar("session_token", { length: 64 }),
		email: varchar("email", { length: 254 }),
		currency: currencyEnum("currency").notNull().default("xof"),
		status: cartStatusEnum("status").notNull().default("active"),
		shippingAddress: jsonb("shipping_address").$type(),
		billingAddress: jsonb("billing_address").$type(),
		shippingRateId: uuid("shipping_rate_id"),
		completedAt: timestamp("completed_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		// Un seul panier actif par compte, et un seul par session anonyme.
		uniqueIndex("carts_active_user_unique")
			.on(table.userId)
			.where(sql`${table.status} = 'active' and ${table.userId} is not null`),
		uniqueIndex("carts_active_session_unique")
			.on(table.sessionToken)
			.where(
				sql`${table.status} = 'active' and ${table.sessionToken} is not null`,
			),
		index("carts_updated_at_idx").on(table.updatedAt),
	],
);
/**
 * Ligne de panier. Elle pointe le point de stock plutôt que de recomposer le
 * triplet produit/variante/taille à chaque contrôle de disponibilité.
 * Le prix n'est pas figé ici : il est relu au passage en commande.
 */
export const cartItems = pgTable(
	"cart_items",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		cartId: uuid("cart_id")
			.notNull()
			.references(() => carts.id, { onDelete: "cascade" }),
		inventoryItemId: uuid("inventory_item_id")
			.notNull()
			.references(() => inventoryItems.id, { onDelete: "cascade" }),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		variantId: uuid("variant_id").references(() => productVariants.id, {
			onDelete: "cascade",
		}),
		sizeId: uuid("size_id").references(() => sizes.id, { onDelete: "cascade" }),
		quantity: integer("quantity").notNull().default(1),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		// Rajouter un article déjà présent incrémente la ligne existante.
		uniqueIndex("cart_items_line_unique").on(
			table.cartId,
			table.inventoryItemId,
		),
		index("cart_items_cart_idx").on(table.cartId),
		check("cart_items_quantity_positive", sql`${table.quantity} > 0`),
	],
);
/**
 * Commande (§2.4).
 *
 * `displayId` est le numéro lisible communiqué au client, distinct de l'UUID
 * technique. Les adresses et le mode de livraison sont des instantanés JSON :
 * modifier une adresse du carnet ne réécrit pas l'historique.
 */
export const orders = pgTable(
	"orders",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		displayId: integer("display_id")
			.notNull()
			.unique()
			.generatedByDefaultAsIdentity({
				startWith: 1000,
			}),
		userId: uuid("user_id").references(() => users.id, {
			onDelete: "set null",
		}),
		email: varchar("email", { length: 254 }).notNull(),
		phone: varchar("phone", { length: 32 }),
		status: orderStatusEnum("status").notNull().default("pending_payment"),
		paymentStatus: paymentStatusEnum("payment_status")
			.notNull()
			.default("pending"),
		fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status")
			.notNull()
			.default("not_fulfilled"),
		currency: currencyEnum("currency").notNull().default("xof"),
		shippingAddress: jsonb("shipping_address").$type().notNull(),
		billingAddress: jsonb("billing_address").$type(),
		shippingMethod: jsonb("shipping_method").$type(),
		trackingNumber: varchar("tracking_number", { length: 120 }),
		trackingUrl: varchar("tracking_url", { length: 1000 }),
		carrier: varchar("carrier", { length: 120 }),
		subtotal: integer("subtotal").notNull().default(0),
		shippingTotal: integer("shipping_total").notNull().default(0),
		taxTotal: integer("tax_total").notNull().default(0),
		discountTotal: integer("discount_total").notNull().default(0),
		total: integer("total").notNull().default(0),
		refundedTotal: integer("refunded_total").notNull().default(0),
		note: text("note"),
		/** Clé d'idempotence du passage en commande, contre le double-clic. */
		idempotencyKey: varchar("idempotency_key", { length: 128 }),
		placedAt: timestamp("placed_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		paidAt: timestamp("paid_at", { withTimezone: true }),
		shippedAt: timestamp("shipped_at", { withTimezone: true }),
		deliveredAt: timestamp("delivered_at", { withTimezone: true }),
		cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("orders_user_idx").on(table.userId),
		index("orders_status_idx").on(table.status),
		index("orders_payment_status_idx").on(table.paymentStatus),
		index("orders_created_at_idx").on(table.createdAt),
		index("orders_email_idx").on(sql`lower(${table.email})`),
		uniqueIndex("orders_idempotency_unique")
			.on(table.idempotencyKey)
			.where(sql`${table.idempotencyKey} is not null`),
		check(
			"orders_refunded_within_total",
			sql`${table.refundedTotal} >= 0 and ${table.refundedTotal} <= ${table.total}`,
		),
	],
);
/**
 * Ligne de commande : instantané complet du §2.4.
 *
 * Les libellés, le SKU, la vignette et le prix unitaire sont copiés à
 * l'achat. Les clés étrangères passent à NULL si le catalogue évolue - la
 * commande reste lisible même après suppression du produit.
 */
export const orderItems = pgTable(
	"order_items",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders.id, { onDelete: "cascade" }),
		productId: uuid("product_id").references(() => products.id, {
			onDelete: "set null",
		}),
		variantId: uuid("variant_id").references(() => productVariants.id, {
			onDelete: "set null",
		}),
		sizeId: uuid("size_id").references(() => sizes.id, {
			onDelete: "set null",
		}),
		inventoryItemId: uuid("inventory_item_id").references(
			() => inventoryItems.id,
			{
				onDelete: "set null",
			},
		),
		productName: varchar("product_name", { length: 255 }).notNull(),
		productSlug: varchar("product_slug", { length: 160 }),
		variantName: varchar("variant_name", { length: 120 }),
		sizeLabel: varchar("size_label", { length: 32 }),
		sku: varchar("sku", { length: 64 }),
		thumbnail: varchar("thumbnail", { length: 1000 }),
		unitPrice: integer("unit_price").notNull(),
		quantity: integer("quantity").notNull(),
		lineTotal: integer("line_total").notNull(),
		refundedQuantity: integer("refunded_quantity").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("order_items_order_idx").on(table.orderId),
		index("order_items_product_idx").on(table.productId),
		check("order_items_quantity_positive", sql`${table.quantity} > 0`),
		check(
			"order_items_refunded_within_quantity",
			sql`${table.refundedQuantity} >= 0 and ${table.refundedQuantity} <= ${table.quantity}`,
		),
	],
);
/** Historique complet des changements de statut (§2.4). */
export const orderStatusHistory = pgTable(
	"order_status_history",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders.id, { onDelete: "cascade" }),
		fromStatus: orderStatusEnum("from_status"),
		toStatus: orderStatusEnum("to_status").notNull(),
		comment: text("comment"),
		userId: uuid("user_id").references(() => users.id, {
			onDelete: "set null",
		}),
		userLabel: varchar("user_label", { length: 200 }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("order_status_history_order_idx").on(table.orderId, table.createdAt),
	],
);
/** Remboursement total ou partiel rattaché à une commande (§2.4). */
export const refunds = pgTable(
	"refunds",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		orderId: uuid("order_id")
			.notNull()
			.references(() => orders.id, { onDelete: "cascade" }),
		transactionId: uuid("transaction_id"),
		amount: integer("amount").notNull(),
		reason: text("reason").notNull(),
		/** Détail des lignes remboursées : `[{ orderItemId, quantity }]`. */
		items: jsonb("items").$type(),
		userId: uuid("user_id").references(() => users.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("refunds_order_idx").on(table.orderId),
		check("refunds_amount_positive", sql`${table.amount} > 0`),
	],
);
// --- Relations -------------------------------------------------------------
export const cartsRelations = relations(carts, ({ one, many }) => ({
	user: one(users, { fields: [carts.userId], references: [users.id] }),
	items: many(cartItems),
}));
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
	cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
	product: one(products, {
		fields: [cartItems.productId],
		references: [products.id],
	}),
	variant: one(productVariants, {
		fields: [cartItems.variantId],
		references: [productVariants.id],
	}),
	size: one(sizes, { fields: [cartItems.sizeId], references: [sizes.id] }),
	inventoryItem: one(inventoryItems, {
		fields: [cartItems.inventoryItemId],
		references: [inventoryItems.id],
	}),
}));
export const ordersRelations = relations(orders, ({ one, many }) => ({
	user: one(users, { fields: [orders.userId], references: [users.id] }),
	items: many(orderItems),
	statusHistory: many(orderStatusHistory),
	refunds: many(refunds),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id],
	}),
}));
export const orderStatusHistoryRelations = relations(
	orderStatusHistory,
	({ one }) => ({
		order: one(orders, {
			fields: [orderStatusHistory.orderId],
			references: [orders.id],
		}),
		user: one(users, {
			fields: [orderStatusHistory.userId],
			references: [users.id],
		}),
	}),
);
export const refundsRelations = relations(refunds, ({ one }) => ({
	order: one(orders, { fields: [refunds.orderId], references: [orders.id] }),
	user: one(users, { fields: [refunds.userId], references: [users.id] }),
}));
//# sourceMappingURL=orders.js.map
