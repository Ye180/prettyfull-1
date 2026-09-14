import { relations, sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import {
	activationStatusEnum,
	contentStatusEnum,
	currencyEnum,
	productKindEnum,
} from "./enums.js";
import { users } from "./users.js";
/**
 * Arborescence de catégories, profondeur non limitée (§2.1).
 *
 * `path` est un chemin matérialisé de slugs (`femme/robes/soiree`) : il rend
 * les requêtes de sous-arbre triviales (`path LIKE 'femme/%'`) sans CTE
 * récursive, au prix d'une réécriture des descendants lors d'un déplacement.
 * `depth` est dérivé de `path` et sert au rendu et au garde-fou de profondeur.
 */
export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		// L'annotation `AnyPgColumn` casse la récursion de l'inférence : sans
		// elle, TypeScript ne peut pas typer une table qui se référence.
		parentId: uuid("parent_id").references(() => categories.id, {
			onDelete: "set null",
		}),
		name: varchar("name", { length: 160 }).notNull(),
		slug: varchar("slug", { length: 160 }).notNull(),
		description: text("description"),
		imageUrl: varchar("image_url", { length: 1000 }),
		bannerUrl: varchar("banner_url", { length: 1000 }),
		status: activationStatusEnum("status").notNull().default("active"),
		position: integer("position").notNull().default(0),
		/** Catégorie « mise en avant » sur la page d'accueil (§2.1). */
		isFeatured: boolean("is_featured").notNull().default(false),
		depth: integer("depth").notNull().default(0),
		path: varchar("path", { length: 2000 }).notNull().default(""),
		metaTitle: varchar("meta_title", { length: 255 }),
		metaDescription: varchar("meta_description", { length: 500 }),
		translations: jsonb("translations").$type(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => [
		uniqueIndex("categories_slug_unique")
			.on(table.slug)
			.where(sql`${table.deletedAt} is null`),
		index("categories_parent_idx").on(table.parentId, table.position),
		index("categories_path_idx").on(table.path),
		index("categories_featured_idx")
			.on(table.isFeatured)
			.where(sql`${table.isFeatured} = true`),
	],
);
/**
 * Produit du catalogue.
 *
 * `kind` fige le régime (§2.2) et n'est plus modifiable ensuite : basculer un
 * produit détruirait son stock et son historique de mouvements. Le
 * changement de régime passe par la duplication.
 *
 * `deletedAt` implémente l'archivage logique demandé au §2.1 - aucune
 * suppression physique n'est exposée par l'API.
 */
export const products = pgTable(
	"products",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		kind: productKindEnum("kind").notNull().default("simple"),
		name: varchar("name", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 160 }).notNull(),
		shortDescription: varchar("short_description", { length: 1000 }),
		longDescription: text("long_description"),
		sku: varchar("sku", { length: 64 }),
		/** Montants en plus petite unité de `currency` (cf. CURRENCY_EXPONENTS). */
		basePrice: integer("base_price").notNull().default(0),
		/** Prix barré promotionnel ; doit rester supérieur au prix de base. */
		compareAtPrice: integer("compare_at_price"),
		currency: currencyEnum("currency").notNull().default("xof"),
		status: contentStatusEnum("status").notNull().default("draft"),
		weightGrams: integer("weight_grams"),
		lengthMm: integer("length_mm"),
		widthMm: integer("width_mm"),
		heightMm: integer("height_mm"),
		tags: text("tags")
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		publishedAt: timestamp("published_at", { withTimezone: true }),
		metaTitle: varchar("meta_title", { length: 255 }),
		metaDescription: varchar("meta_description", { length: 500 }),
		isFeatured: boolean("is_featured").notNull().default(false),
		/** Seuil d'alerte par défaut des points de stock du produit (§2.3). */
		lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
		translations: jsonb("translations").$type(),
		createdBy: uuid("created_by").references(() => users.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		deletedAt: timestamp("deleted_at", { withTimezone: true }),
	},
	(table) => [
		uniqueIndex("products_slug_unique")
			.on(table.slug)
			.where(sql`${table.deletedAt} is null`),
		uniqueIndex("products_sku_unique")
			.on(table.sku)
			.where(sql`${table.sku} is not null and ${table.deletedAt} is null`),
		index("products_status_idx").on(table.status, table.publishedAt),
		index("products_kind_idx").on(table.kind),
		index("products_created_at_idx").on(table.createdAt),
		index("products_featured_idx")
			.on(table.isFeatured)
			.where(sql`${table.isFeatured} = true`),
		// Recherche plein texte sur nom + description courte, tolérante aux
		// accents via `pf_unaccent` (wrapper IMMUTABLE créé par `db:migrate`).
		index("products_search_idx").using(
			"gin",
			sql`to_tsvector('french', pf_unaccent(coalesce(${table.name}, '') || ' ' || coalesce(${table.shortDescription}, '')))`,
		),
		index("products_tags_idx").using("gin", table.tags),
		check(
			"products_compare_at_price_check",
			sql`${table.compareAtPrice} is null or ${table.compareAtPrice} > ${table.basePrice}`,
		),
	],
);
/** Un produit peut appartenir à plusieurs catégories (§2.1, relation N-N). */
export const productCategories = pgTable(
	"product_categories",
	{
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		/** Catégorie principale : sert au fil d'Ariane et au canonical SEO. */
		isPrimary: boolean("is_primary").notNull().default(false),
	},
	(table) => [
		primaryKey({ columns: [table.productId, table.categoryId] }),
		index("product_categories_category_idx").on(table.categoryId),
	],
);
/** Galerie du produit. Les variantes ont la leur (§2.2). */
export const productImages = pgTable(
	"product_images",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		url: varchar("url", { length: 1000 }).notNull(),
		alt: varchar("alt", { length: 255 }),
		position: integer("position").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("product_images_product_idx").on(table.productId, table.position),
	],
);
/**
 * Déclinaison couleur d'un produit (§2.2). Porte sa galerie, ses tailles, son
 * SKU, son surcoût éventuel et un statut indépendant du produit parent.
 */
export const productVariants = pgTable(
	"product_variants",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 120 }).notNull(),
		colorHex: varchar("color_hex", { length: 7 }),
		sku: varchar("sku", { length: 64 }),
		/** Remplace `products.basePrice` quand il est renseigné. */
		priceOverride: integer("price_override"),
		compareAtPriceOverride: integer("compare_at_price_override"),
		status: activationStatusEnum("status").notNull().default("active"),
		position: integer("position").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("product_variants_product_idx").on(table.productId, table.position),
		uniqueIndex("product_variants_sku_unique")
			.on(table.sku)
			.where(sql`${table.sku} is not null`),
	],
);
export const variantImages = pgTable(
	"variant_images",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		variantId: uuid("variant_id")
			.notNull()
			.references(() => productVariants.id, { onDelete: "cascade" }),
		url: varchar("url", { length: 1000 }).notNull(),
		alt: varchar("alt", { length: 255 }),
		position: integer("position").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index("variant_images_variant_idx").on(table.variantId, table.position),
	],
);
/**
 * Taille, rattachée à une variante OU directement à un produit (§2.2).
 *
 * La contrainte `sizes_owner_xor` interdit en base la coexistence des deux
 * rattachements : c'est le garde-fou de dernier recours derrière la
 * validation métier, pour qu'aucun chemin d'écriture ne puisse produire un
 * produit hybride.
 */
export const sizes = pgTable(
	"sizes",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		productId: uuid("product_id").references(() => products.id, {
			onDelete: "cascade",
		}),
		variantId: uuid("variant_id").references(() => productVariants.id, {
			onDelete: "cascade",
		}),
		label: varchar("label", { length: 32 }).notNull(),
		sku: varchar("sku", { length: 64 }),
		/** Prix propre à la taille - rare, prévu en option par le §2.2. */
		priceOverride: integer("price_override"),
		position: integer("position").notNull().default(0),
		status: activationStatusEnum("status").notNull().default("active"),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		check(
			"sizes_owner_xor",
			sql`(${table.productId} is not null) <> (${table.variantId} is not null)`,
		),
		index("sizes_product_idx").on(table.productId, table.position),
		index("sizes_variant_idx").on(table.variantId, table.position),
		uniqueIndex("sizes_variant_label_unique")
			.on(table.variantId, table.label)
			.where(sql`${table.variantId} is not null`),
		uniqueIndex("sizes_product_label_unique")
			.on(table.productId, table.label)
			.where(sql`${table.productId} is not null`),
		uniqueIndex("sizes_sku_unique")
			.on(table.sku)
			.where(sql`${table.sku} is not null`),
	],
);
/** Liste de souhaits client (§2.7, optionnel). */
export const wishlistItems = pgTable(
	"wishlist_items",
	{
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		primaryKey({ columns: [table.userId, table.productId] }),
		index("wishlist_items_product_idx").on(table.productId),
	],
);
// --- Relations -------------------------------------------------------------
export const categoriesRelations = relations(categories, ({ one, many }) => ({
	parent: one(categories, {
		fields: [categories.parentId],
		references: [categories.id],
		relationName: "category_tree",
	}),
	children: many(categories, { relationName: "category_tree" }),
	products: many(productCategories),
}));
export const productsRelations = relations(products, ({ one, many }) => ({
	categories: many(productCategories),
	images: many(productImages),
	variants: many(productVariants),
	sizes: many(sizes),
	createdByUser: one(users, {
		fields: [products.createdBy],
		references: [users.id],
	}),
}));
export const productCategoriesRelations = relations(
	productCategories,
	({ one }) => ({
		product: one(products, {
			fields: [productCategories.productId],
			references: [products.id],
		}),
		category: one(categories, {
			fields: [productCategories.categoryId],
			references: [categories.id],
		}),
	}),
);
export const productImagesRelations = relations(productImages, ({ one }) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id],
	}),
}));
export const productVariantsRelations = relations(
	productVariants,
	({ one, many }) => ({
		product: one(products, {
			fields: [productVariants.productId],
			references: [products.id],
		}),
		images: many(variantImages),
		sizes: many(sizes),
	}),
);
export const variantImagesRelations = relations(variantImages, ({ one }) => ({
	variant: one(productVariants, {
		fields: [variantImages.variantId],
		references: [productVariants.id],
	}),
}));
export const sizesRelations = relations(sizes, ({ one }) => ({
	product: one(products, {
		fields: [sizes.productId],
		references: [products.id],
	}),
	variant: one(productVariants, {
		fields: [sizes.variantId],
		references: [productVariants.id],
	}),
}));
export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
	user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
	product: one(products, {
		fields: [wishlistItems.productId],
		references: [products.id],
	}),
}));
//# sourceMappingURL=catalog.js.map
