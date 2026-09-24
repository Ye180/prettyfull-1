import { sql } from "drizzle-orm";
import {
	check,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { products } from "./catalog.js";
import { contentStatusEnum } from "./enums.js";

/**
 * Avis produit du storefront, avec photo optionnelle montrant l'article porté.
 *
 * Même posture de modération que `contactMessages` : rien n'est visible tant
 * qu'un membre du staff ne passe pas le statut à `published`.
 */
export const reviews = pgTable(
	"reviews",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		productId: uuid("product_id")
			.notNull()
			.references(() => products.id, { onDelete: "cascade" }),
		authorName: varchar("author_name", { length: 120 }).notNull(),
		authorEmail: varchar("author_email", { length: 254 }).notNull(),
		rating: integer("rating").notNull(),
		body: text("body").notNull(),
		photoUrls: text("photo_urls")
			.array()
			.notNull()
			.default(sql`'{}'::text[]`),
		status: contentStatusEnum("status").notNull().default("draft"),
		ipAddress: varchar("ip_address", { length: 64 }),
		userAgent: varchar("user_agent", { length: 500 }),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("reviews_product_status_idx").on(table.productId, table.status, table.createdAt),
		check("reviews_rating_range", sql`${table.rating} >= 1 and ${table.rating} <= 5`),
	],
);
