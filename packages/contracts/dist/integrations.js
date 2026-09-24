import { z } from "zod";
import { INTEGRATION_ENVIRONMENTS, SHIPPING_RATE_KINDS, TRANSACTION_KINDS, TRANSACTION_STATUSES, } from "./enums.js";
import { currencySchema, moneySchema, paginationQuerySchema, uuidSchema, } from "./common.js";
/**
 * Configuration d'un agrégateur, paiement ou livraison (§2.5).
 *
 * `credentials` n'est jamais renvoyé en clair par l'API : la lecture expose
 * `configuredKeys` (les noms des clés renseignées) pour que le panel puisse
 * afficher l'état de configuration sans divulguer les secrets.
 */
const providerConfigBaseSchema = z.object({
    isEnabled: z.boolean().default(false),
    environment: z.enum(INTEGRATION_ENVIRONMENTS).default("test"),
    /** Clés API du prestataire, chiffrées au repos. */
    credentials: z.record(z.string(), z.string()).default({}),
    /** Réglages non secrets (libellés, options, délais). */
    config: z.record(z.string(), z.unknown()).default({}),
    position: z.number().int().min(0).default(0),
});
export const updateProviderConfigSchema = providerConfigBaseSchema.partial();
export const providerConfigSchema = providerConfigBaseSchema
    .omit({ credentials: true })
    .extend({
    id: uuidSchema,
    key: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
    /** Clés attendues par l'adaptateur, pour générer le formulaire du panel. */
    requiredCredentials: z.array(z.object({
        key: z.string(),
        label: z.string(),
        secret: z.boolean(),
    })),
    configuredKeys: z.array(z.string()),
    /** `false` tant qu'une clé obligatoire manque : l'activation est bloquée. */
    isConfigured: z.boolean(),
    supportsWebhooks: z.boolean(),
    webhookUrl: z.string().nullable(),
    updatedAt: z.string(),
});
// --- Livraison -------------------------------------------------------------
export const shippingZoneInputSchema = z.object({
    name: z.string().trim().min(1).max(120),
    /** ISO 3166-1 alpha-2 en minuscules. */
    countryCodes: z.array(z.string().trim().toLowerCase().length(2)).min(1),
    isActive: z.boolean().default(true),
});
export const shippingZoneSchema = shippingZoneInputSchema.extend({
    id: uuidSchema,
    createdAt: z.string(),
});
/**
 * Tarif de port. `flat` : montant fixe. `weight` : montant appliqué dans une
 * tranche de poids. `api` : le montant est demandé au transporteur (§2.5).
 */
/**
 * Champs d'un tarif, sans contrôle croisé.
 *
 * Séparé du schéma raffiné parce que Zod interdit `.partial()` sur un objet
 * porteur de refinements : les mises à jour partielles dérivent donc de cette
 * base, et le contrôle de cohérence des poids est refait côté service après
 * fusion avec l'existant.
 */
export const shippingRateBaseSchema = z
    .object({
    zoneId: uuidSchema,
    providerKey: z.string().min(1).max(64),
    name: z.string().trim().min(1).max(120),
    kind: z.enum(SHIPPING_RATE_KINDS).default("flat"),
    amount: moneySchema.default(0),
    currency: currencySchema,
    minWeightGrams: z.number().int().min(0).nullish(),
    maxWeightGrams: z.number().int().min(0).nullish(),
    /** Au-delà de ce total, le port est offert. */
    freeAboveTotal: moneySchema.nullish(),
    estimatedDaysMin: z.number().int().min(0).nullish(),
    estimatedDaysMax: z.number().int().min(0).nullish(),
    isActive: z.boolean().default(true),
    position: z.number().int().min(0).default(0),
});
const enforceWeightRange = (value, ctx) => {
    if (value.minWeightGrams != null &&
        value.maxWeightGrams != null &&
        value.maxWeightGrams <= value.minWeightGrams) {
        ctx.addIssue({
            code: "custom",
            path: ["maxWeightGrams"],
            message: "Le poids maximum doit être supérieur au poids minimum.",
        });
    }
};
export const shippingRateInputSchema = shippingRateBaseSchema.superRefine(enforceWeightRange);
export const updateShippingRateSchema = shippingRateBaseSchema.partial().superRefine(enforceWeightRange);
export const shippingRateSchema = z.object({
    id: uuidSchema,
    zoneId: uuidSchema,
    zoneName: z.string().optional(),
    providerKey: z.string(),
    name: z.string(),
    kind: z.enum(SHIPPING_RATE_KINDS),
    amount: moneySchema,
    currency: currencySchema,
    minWeightGrams: z.number().int().nullable(),
    maxWeightGrams: z.number().int().nullable(),
    freeAboveTotal: moneySchema.nullable(),
    estimatedDaysMin: z.number().int().nullable(),
    estimatedDaysMax: z.number().int().nullable(),
    isActive: z.boolean(),
    position: z.number().int(),
});
/** Option de livraison résolue pour un panier donné, prête à afficher. */
export const shippingOptionSchema = z.object({
    rateId: uuidSchema,
    providerKey: z.string(),
    name: z.string(),
    amount: moneySchema,
    currency: currencySchema,
    estimatedDaysMin: z.number().int().nullable(),
    estimatedDaysMax: z.number().int().nullable(),
});
/** Moyen de paiement exposé au storefront (jamais de clés). */
export const paymentOptionSchema = z.object({
    key: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    logoUrl: z.string().nullable(),
});
export const transactionListQuerySchema = paginationQuerySchema.extend({
    orderId: uuidSchema.optional(),
    providerKey: z.string().max(64).optional(),
    kind: z.enum(TRANSACTION_KINDS).optional(),
    status: z.enum(TRANSACTION_STATUSES).optional(),
    from: z.iso.datetime().optional(),
    to: z.iso.datetime().optional(),
});
/** Test de configuration déclenché depuis le panel avant activation. */
export const testProviderSchema = z.object({
    environment: z.enum(INTEGRATION_ENVIRONMENTS).optional(),
});
export const testProviderResultSchema = z.object({
    ok: z.boolean(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
});
//# sourceMappingURL=integrations.js.map