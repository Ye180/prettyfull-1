import {
	DEFAULT_STORE_SETTINGS,
	storeSettingsSchema,
} from "@prettyfull/contracts";
import { asc, eq, ne } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { notFound } from "../../lib/errors.js";
/** Paramètres généraux et taxes (§4.9). */
const SETTINGS_KEY = "store";
/**
 * Cache mémoire des paramètres.
 *
 * Ils sont lus à chaque panier, chaque commande et chaque page du storefront,
 * mais ne changent qu'à la main depuis le panel : une lecture base à chaque
 * requête serait du gaspillage pur. Le cache est invalidé à l'écriture, donc
 * un changement est visible immédiatement (§5, « cache sur les données peu
 * volatiles »).
 */
let cache = null;
const CACHE_TTL_MS = 60_000;
export const getStoreSettings = async () => {
	if (cache && cache.expiresAt > Date.now()) return cache.value;
	const [row] = await db
		.select({ value: t.settings.value })
		.from(t.settings)
		.where(eq(t.settings.key, SETTINGS_KEY))
		.limit(1);
	// Une base non encore initialisée retombe sur les valeurs par défaut plutôt
	// que d'échouer : le storefront doit rester servable.
	const parsed = storeSettingsSchema.safeParse(row?.value ?? {});
	const value = parsed.success ? parsed.data : DEFAULT_STORE_SETTINGS;
	cache = { value, expiresAt: Date.now() + CACHE_TTL_MS };
	return value;
};
export const invalidateSettingsCache = () => {
	cache = null;
};
export const updateStoreSettings = async (input, userId) => {
	const current = await getStoreSettings();
	const merged = storeSettingsSchema.parse({ ...current, ...input });
	await db
		.insert(t.settings)
		.values({ key: SETTINGS_KEY, value: merged, updatedBy: userId })
		.onConflictDoUpdate({
			target: t.settings.key,
			set: { value: merged, updatedBy: userId, updatedAt: new Date() },
		});
	invalidateSettingsCache();
	return merged;
};
// --- Taxes -----------------------------------------------------------------
const toTaxRate = (row) => ({
	id: row.id,
	name: row.name,
	rateBasisPoints: row.rateBasisPoints,
	countryCode: row.countryCode,
	isInclusive: row.isInclusive,
	isDefault: row.isDefault,
	isActive: row.isActive,
	createdAt: row.createdAt.toISOString(),
});
export const listTaxRates = async () => {
	const rows = await db.select().from(t.taxRates).orderBy(asc(t.taxRates.name));
	return rows.map(toTaxRate);
};
/**
 * Crée ou met à jour un taux. Marquer un taux « par défaut » retire le drapeau
 * des autres - la base impose déjà l'unicité, on la respecte explicitement
 * plutôt que de laisser remonter une violation de contrainte.
 */
export const createTaxRate = async (input) => {
	return db.transaction(async (tx) => {
		if (input.isDefault) {
			await tx.update(t.taxRates).set({ isDefault: false });
		}
		const [created] = await tx
			.insert(t.taxRates)
			.values({
				name: input.name,
				rateBasisPoints: input.rateBasisPoints,
				countryCode: input.countryCode ?? null,
				isInclusive: input.isInclusive,
				isDefault: input.isDefault,
				isActive: input.isActive,
			})
			.returning();
		return toTaxRate(created);
	});
};
export const updateTaxRate = async (id, input) => {
	return db.transaction(async (tx) => {
		if (input.isDefault) {
			await tx
				.update(t.taxRates)
				.set({ isDefault: false })
				.where(ne(t.taxRates.id, id));
		}
		const patch = Object.fromEntries(
			Object.entries(input).filter(([, value]) => value !== undefined),
		);
		const [updated] = await tx
			.update(t.taxRates)
			.set({ ...patch, updatedAt: new Date() })
			.where(eq(t.taxRates.id, id))
			.returning();
		if (!updated) throw notFound("Taux de taxe");
		return toTaxRate(updated);
	});
};
export const deleteTaxRate = async (id) => {
	const [deleted] = await db
		.delete(t.taxRates)
		.where(eq(t.taxRates.id, id))
		.returning({ id: t.taxRates.id });
	if (!deleted) throw notFound("Taux de taxe");
};
//# sourceMappingURL=service.js.map
