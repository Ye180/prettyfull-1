import { z } from "zod";
import {
	CURRENCY_CODES,
	CURRENCY_EXPONENTS,
	LOCALES,
	type CurrencyCode,
} from "./enums.js";

export const uuidSchema = z.uuid();

/**
 * Slug URL : minuscules, chiffres et tirets simples, sans tiret en bordure.
 * Utilisé pour les produits, catégories et pages statiques (§2.1 SEO).
 */
export const slugSchema = z
	.string()
	.min(1)
	.max(160)
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		"Slug invalide : minuscules, chiffres et tirets uniquement.",
	);

export const emailSchema = z.string().trim().toLowerCase().max(254).pipe(z.email());

export const currencySchema = z.enum(CURRENCY_CODES);
export const localeSchema = z.enum(LOCALES);

/**
 * Montant monétaire en plus petite unité (entier). Voir `CURRENCY_EXPONENTS`.
 * On refuse les flottants pour éviter toute dérive d'arrondi sur les totaux.
 */
export const moneySchema = z
	.number()
	.int("Un montant doit être un entier exprimé dans la plus petite unité.")
	.min(0)
	.max(Number.MAX_SAFE_INTEGER);

export const quantitySchema = z.number().int().min(0).max(1_000_000);

/**
 * Champ traduit : `{ en: { name: "…" } }`. Le français est la langue pivot et
 * vit dans les colonnes elles-mêmes, donc chaque locale est facultative —
 * d'où `partialRecord` plutôt que `record`, qui les exigerait toutes.
 */
export const translationsSchema = z
	.partialRecord(localeSchema, z.record(z.string(), z.string()))
	.optional();

export type Translations = z.infer<typeof translationsSchema>;

// --- Pagination ------------------------------------------------------------

export const SORT_DIRECTIONS = ["asc", "desc"] as const;

/**
 * Pagination par offset, bornée à 100 éléments : les listes admin et
 * storefront passent toutes par là (§5 « pagination et indexation »).
 */
export const paginationQuerySchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	sort: z.string().max(64).optional(),
	order: z.enum(SORT_DIRECTIONS).default("desc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
	page: z.number().int(),
	limit: z.number().int(),
	total: z.number().int(),
	totalPages: z.number().int(),
	hasNext: z.boolean(),
	hasPrevious: z.boolean(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export interface Paginated<T> {
	data: T[];
	meta: PaginationMeta;
}

export const buildPaginationMeta = (
	page: number,
	limit: number,
	total: number,
): PaginationMeta => {
	const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;
	return {
		page,
		limit,
		total,
		totalPages,
		hasNext: page < totalPages,
		hasPrevious: page > 1,
	};
};

// --- Erreurs ---------------------------------------------------------------

/**
 * Enveloppe d'erreur unique de l'API. `details` porte les erreurs de
 * validation champ par champ, directement exploitables par les formulaires
 * du back-office.
 */
export const apiErrorSchema = z.object({
	error: z.object({
		code: z.string(),
		message: z.string(),
		details: z.record(z.string(), z.array(z.string())).optional(),
	}),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const ERROR_CODES = {
	VALIDATION_ERROR: "VALIDATION_ERROR",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	CONFLICT: "CONFLICT",
	INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
	INVALID_PRODUCT_MODEL: "INVALID_PRODUCT_MODEL",
	PAYMENT_ERROR: "PAYMENT_ERROR",
	PROVIDER_ERROR: "PROVIDER_ERROR",
	RATE_LIMITED: "RATE_LIMITED",
	INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// --- Helpers monétaires ----------------------------------------------------

/** 1500 + "eur" => 15. Ne jamais réutiliser le résultat pour recalculer un total. */
export const toMajorUnit = (amount: number, currency: CurrencyCode): number =>
	amount / 10 ** CURRENCY_EXPONENTS[currency];

/** 15 + "eur" => 1500. Arrondi au plus proche pour absorber les saisies admin. */
export const toMinorUnit = (amount: number, currency: CurrencyCode): number =>
	Math.round(amount * 10 ** CURRENCY_EXPONENTS[currency]);

export const formatMoney = (
	amount: number,
	currency: CurrencyCode,
	locale = "fr-FR",
): string =>
	new Intl.NumberFormat(locale, {
		style: "currency",
		currency: currency.toUpperCase(),
		minimumFractionDigits: CURRENCY_EXPONENTS[currency],
		maximumFractionDigits: CURRENCY_EXPONENTS[currency],
	}).format(toMajorUnit(amount, currency));
