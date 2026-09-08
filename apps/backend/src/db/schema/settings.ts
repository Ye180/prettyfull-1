import { sql } from "drizzle-orm";
import {
	boolean,
	check,
	index,
	integer,
	jsonb,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users.js";

/**
 * Paramètres généraux (§4.9), stockés en couples clé/valeur JSON.
 *
 * Ajouter un réglage ne demande donc aucune migration : la forme est
 * garantie par `storeSettingsSchema` côté contrats, pas par la base.
 */
export const settings = pgTable("settings", {
	key: varchar("key", { length: 96 }).primaryKey(),
	value: jsonb("value").$type<unknown>().notNull(),
	updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Taux de taxe (§4.9). Exprimé en points de base — 1 850 = 18,50 % — pour
 * rester en arithmétique entière et éviter les dérives d'arrondi sur les
 * totaux de commande.
 */
export const taxRates = pgTable(
	"tax_rates",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 120 }).notNull(),
		rateBasisPoints: integer("rate_basis_points").notNull().default(0),
		/** NULL : taux applicable à tous les pays sans règle spécifique. */
		countryCode: varchar("country_code", { length: 2 }),
		/** `true` : le prix affiché contient déjà la taxe. */
		isInclusive: boolean("is_inclusive").notNull().default(true),
		isDefault: boolean("is_default").notNull().default(false),
		isActive: boolean("is_active").notNull().default(true),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index("tax_rates_country_idx").on(table.countryCode),
		// Un seul taux par défaut, garanti en base plutôt qu'en applicatif.
		uniqueIndex("tax_rates_single_default")
			.on(table.isDefault)
			.where(sql`${table.isDefault} = true`),
		check(
			"tax_rates_range",
			sql`${table.rateBasisPoints} >= 0 and ${table.rateBasisPoints} <= 10000`,
		),
	],
);
