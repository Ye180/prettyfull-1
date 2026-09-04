import { z } from "zod";
import { type CurrencyCode } from "./enums.js";
export declare const uuidSchema: z.ZodUUID;
/**
 * Slug URL : minuscules, chiffres et tirets simples, sans tiret en bordure.
 * Utilisé pour les produits, catégories et pages statiques (§2.1 SEO).
 */
export declare const slugSchema: z.ZodString;
export declare const emailSchema: z.ZodPipe<z.ZodString, z.ZodEmail>;
export declare const currencySchema: z.ZodEnum<{
    xof: "xof";
    eur: "eur";
    usd: "usd";
}>;
export declare const localeSchema: z.ZodEnum<{
    fr: "fr";
    en: "en";
}>;
/**
 * Montant monétaire en plus petite unité (entier). Voir `CURRENCY_EXPONENTS`.
 * On refuse les flottants pour éviter toute dérive d'arrondi sur les totaux.
 */
export declare const moneySchema: z.ZodNumber;
export declare const quantitySchema: z.ZodNumber;
/**
 * Champ traduit : `{ en: { name: "…" } }`. Le français est la langue pivot et
 * vit dans les colonnes elles-mêmes, donc chaque locale est facultative —
 * d'où `partialRecord` plutôt que `record`, qui les exigerait toutes.
 */
export declare const translationsSchema: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
    fr: "fr";
    en: "en";
}> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
export type Translations = z.infer<typeof translationsSchema>;
export declare const SORT_DIRECTIONS: readonly ["asc", "desc"];
/**
 * Pagination par offset, bornée à 100 éléments : les listes admin et
 * storefront passent toutes par là (§5 « pagination et indexation »).
 */
export declare const paginationQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
}, z.core.$strip>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export declare const paginationMetaSchema: z.ZodObject<{
    page: z.ZodNumber;
    limit: z.ZodNumber;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
    hasNext: z.ZodBoolean;
    hasPrevious: z.ZodBoolean;
}, z.core.$strip>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export interface Paginated<T> {
    data: T[];
    meta: PaginationMeta;
}
export declare const buildPaginationMeta: (page: number, limit: number, total: number) => PaginationMeta;
/**
 * Enveloppe d'erreur unique de l'API. `details` porte les erreurs de
 * validation champ par champ, directement exploitables par les formulaires
 * du back-office.
 */
export declare const apiErrorSchema: z.ZodObject<{
    error: z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type ApiError = z.infer<typeof apiErrorSchema>;
export declare const ERROR_CODES: {
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly CONFLICT: "CONFLICT";
    readonly INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
    readonly INVALID_PRODUCT_MODEL: "INVALID_PRODUCT_MODEL";
    readonly PAYMENT_ERROR: "PAYMENT_ERROR";
    readonly PROVIDER_ERROR: "PROVIDER_ERROR";
    readonly RATE_LIMITED: "RATE_LIMITED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
};
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
/** 1500 + "eur" => 15. Ne jamais réutiliser le résultat pour recalculer un total. */
export declare const toMajorUnit: (amount: number, currency: CurrencyCode) => number;
/** 15 + "eur" => 1500. Arrondi au plus proche pour absorber les saisies admin. */
export declare const toMinorUnit: (amount: number, currency: CurrencyCode) => number;
export declare const formatMoney: (amount: number, currency: CurrencyCode, locale?: string) => string;
//# sourceMappingURL=common.d.ts.map