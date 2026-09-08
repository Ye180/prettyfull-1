import { z } from "zod";
export declare const updateProviderConfigSchema: z.ZodObject<{
    isEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    environment: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        test: "test";
        live: "live";
    }>>>;
    credentials: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodString>>>;
    config: z.ZodOptional<z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    position: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export type UpdateProviderConfigInput = z.infer<typeof updateProviderConfigSchema>;
export declare const providerConfigSchema: z.ZodObject<{
    position: z.ZodDefault<z.ZodNumber>;
    isEnabled: z.ZodDefault<z.ZodBoolean>;
    environment: z.ZodDefault<z.ZodEnum<{
        test: "test";
        live: "live";
    }>>;
    config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    id: z.ZodUUID;
    key: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    logoUrl: z.ZodNullable<z.ZodString>;
    requiredCredentials: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        secret: z.ZodBoolean;
    }, z.core.$strip>>;
    configuredKeys: z.ZodArray<z.ZodString>;
    isConfigured: z.ZodBoolean;
    supportsWebhooks: z.ZodBoolean;
    webhookUrl: z.ZodNullable<z.ZodString>;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type ProviderConfig = z.infer<typeof providerConfigSchema>;
export declare const shippingZoneInputSchema: z.ZodObject<{
    name: z.ZodString;
    countryCodes: z.ZodArray<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const shippingZoneSchema: z.ZodObject<{
    name: z.ZodString;
    countryCodes: z.ZodArray<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    id: z.ZodUUID;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ShippingZone = z.infer<typeof shippingZoneSchema>;
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
export declare const shippingRateBaseSchema: z.ZodObject<{
    zoneId: z.ZodUUID;
    providerKey: z.ZodString;
    name: z.ZodString;
    kind: z.ZodDefault<z.ZodEnum<{
        flat: "flat";
        weight: "weight";
        api: "api";
    }>>;
    amount: z.ZodDefault<z.ZodNumber>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    minWeightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxWeightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    freeAboveTotal: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimatedDaysMin: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimatedDaysMax: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    position: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const shippingRateInputSchema: z.ZodObject<{
    zoneId: z.ZodUUID;
    providerKey: z.ZodString;
    name: z.ZodString;
    kind: z.ZodDefault<z.ZodEnum<{
        flat: "flat";
        weight: "weight";
        api: "api";
    }>>;
    amount: z.ZodDefault<z.ZodNumber>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    minWeightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxWeightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    freeAboveTotal: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimatedDaysMin: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    estimatedDaysMax: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    position: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateShippingRateSchema: z.ZodObject<{
    zoneId: z.ZodOptional<z.ZodUUID>;
    providerKey: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    kind: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        flat: "flat";
        weight: "weight";
        api: "api";
    }>>>;
    amount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    currency: z.ZodOptional<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>;
    minWeightGrams: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    maxWeightGrams: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    freeAboveTotal: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    estimatedDaysMin: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    estimatedDaysMax: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    position: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, z.core.$strip>;
export type ShippingRateInput = z.infer<typeof shippingRateInputSchema>;
export type UpdateShippingRateInput = z.infer<typeof updateShippingRateSchema>;
export declare const shippingRateSchema: z.ZodObject<{
    id: z.ZodUUID;
    zoneId: z.ZodUUID;
    zoneName: z.ZodOptional<z.ZodString>;
    providerKey: z.ZodString;
    name: z.ZodString;
    kind: z.ZodEnum<{
        flat: "flat";
        weight: "weight";
        api: "api";
    }>;
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    minWeightGrams: z.ZodNullable<z.ZodNumber>;
    maxWeightGrams: z.ZodNullable<z.ZodNumber>;
    freeAboveTotal: z.ZodNullable<z.ZodNumber>;
    estimatedDaysMin: z.ZodNullable<z.ZodNumber>;
    estimatedDaysMax: z.ZodNullable<z.ZodNumber>;
    isActive: z.ZodBoolean;
    position: z.ZodNumber;
}, z.core.$strip>;
export type ShippingRate = z.infer<typeof shippingRateSchema>;
/** Option de livraison résolue pour un panier donné, prête à afficher. */
export declare const shippingOptionSchema: z.ZodObject<{
    rateId: z.ZodUUID;
    providerKey: z.ZodString;
    name: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    estimatedDaysMin: z.ZodNullable<z.ZodNumber>;
    estimatedDaysMax: z.ZodNullable<z.ZodNumber>;
}, z.core.$strip>;
export type ShippingOption = z.infer<typeof shippingOptionSchema>;
/** Moyen de paiement exposé au storefront (jamais de clés). */
export declare const paymentOptionSchema: z.ZodObject<{
    key: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    logoUrl: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type PaymentOption = z.infer<typeof paymentOptionSchema>;
export declare const transactionListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    orderId: z.ZodOptional<z.ZodUUID>;
    providerKey: z.ZodOptional<z.ZodString>;
    kind: z.ZodOptional<z.ZodEnum<{
        payment: "payment";
        refund: "refund";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        cancelled: "cancelled";
        pending: "pending";
        failed: "failed";
        success: "success";
    }>>;
    from: z.ZodOptional<z.ZodISODateTime>;
    to: z.ZodOptional<z.ZodISODateTime>;
}, z.core.$strip>;
/** Test de configuration déclenché depuis le panel avant activation. */
export declare const testProviderSchema: z.ZodObject<{
    environment: z.ZodOptional<z.ZodEnum<{
        test: "test";
        live: "live";
    }>>;
}, z.core.$strip>;
export declare const testProviderResultSchema: z.ZodObject<{
    ok: z.ZodBoolean;
    message: z.ZodString;
    details: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
//# sourceMappingURL=integrations.d.ts.map