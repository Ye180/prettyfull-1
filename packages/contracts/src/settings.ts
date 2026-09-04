import { z } from "zod";
import { currencySchema, localeSchema, moneySchema } from "./common.js";

/**
 * Paramètres généraux du §4.9. Stockés en `settings` sous forme de
 * couples clé/valeur JSON : ajouter un réglage ne demande pas de migration.
 */
export const storeSettingsSchema = z.object({
	storeName: z.string().trim().min(1).max(120).default("PrettyFull"),
	contactEmail: z.string().max(254).default("contact@prettyfull.shop"),
	supportPhone: z.string().max(32).nullish(),
	defaultCurrency: currencySchema.default("xof"),
	/** Devises proposées au sélecteur du storefront. */
	enabledCurrencies: z.array(currencySchema).min(1).default(["xof"]),
	defaultLocale: localeSchema.default("fr"),
	enabledLocales: z.array(localeSchema).min(1).default(["fr", "en"]),
	/** Seuil d'alerte appliqué aux produits qui n'en définissent pas. */
	defaultLowStockThreshold: z.number().int().min(0).default(5),
	/** Durée de vie d'une réservation de stock pendant le paiement (§2.3). */
	stockReservationMinutes: z.number().int().min(1).max(1_440).default(20),
	freeShippingThreshold: moneySchema.nullish(),
	orderNumberPrefix: z.string().trim().max(8).default("PF"),
	maintenanceMode: z.boolean().default(false),
});

export type StoreSettings = z.infer<typeof storeSettingsSchema>;

export const updateStoreSettingsSchema = storeSettingsSchema.partial();

/**
 * Taxe applicable. Le taux est exprimé en points de base (1 850 = 18,50 %)
 * pour rester en arithmétique entière de bout en bout.
 */
export const taxRateInputSchema = z.object({
	name: z.string().trim().min(1).max(120),
	rateBasisPoints: z.number().int().min(0).max(10_000),
	countryCode: z.string().trim().toLowerCase().length(2).nullish(),
	/** `true` : le prix affiché contient déjà la taxe. */
	isInclusive: z.boolean().default(true),
	isDefault: z.boolean().default(false),
	isActive: z.boolean().default(true),
});

export type TaxRateInput = z.infer<typeof taxRateInputSchema>;

export const taxRateSchema = taxRateInputSchema.extend({
	id: z.uuid(),
	createdAt: z.string(),
});

export type TaxRate = z.infer<typeof taxRateSchema>;

export const DEFAULT_STORE_SETTINGS: StoreSettings = storeSettingsSchema.parse({});
