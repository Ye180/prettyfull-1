import { z } from "zod";
/**
 * Paramètres généraux du §4.9. Stockés en `settings` sous forme de
 * couples clé/valeur JSON : ajouter un réglage ne demande pas de migration.
 */
export declare const storeSettingsSchema: z.ZodObject<{
    storeName: z.ZodDefault<z.ZodString>;
    contactEmail: z.ZodDefault<z.ZodString>;
    supportPhone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    defaultCurrency: z.ZodDefault<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>;
    enabledCurrencies: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>>;
    defaultLocale: z.ZodDefault<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }>>;
    enabledLocales: z.ZodDefault<z.ZodArray<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }>>>;
    defaultLowStockThreshold: z.ZodDefault<z.ZodNumber>;
    stockReservationMinutes: z.ZodDefault<z.ZodNumber>;
    freeShippingThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    orderNumberPrefix: z.ZodDefault<z.ZodString>;
    maintenanceMode: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type StoreSettings = z.infer<typeof storeSettingsSchema>;
export declare const updateStoreSettingsSchema: z.ZodObject<{
    storeName: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    contactEmail: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    supportPhone: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    defaultCurrency: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>>;
    enabledCurrencies: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>>>;
    defaultLocale: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }>>>;
    enabledLocales: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }>>>>;
    defaultLowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    stockReservationMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    freeShippingThreshold: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    orderNumberPrefix: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    maintenanceMode: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, z.core.$strip>;
/**
 * Taxe applicable. Le taux est exprimé en points de base (1 850 = 18,50 %)
 * pour rester en arithmétique entière de bout en bout.
 */
export declare const taxRateInputSchema: z.ZodObject<{
    name: z.ZodString;
    rateBasisPoints: z.ZodNumber;
    countryCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isInclusive: z.ZodDefault<z.ZodBoolean>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type TaxRateInput = z.infer<typeof taxRateInputSchema>;
export declare const taxRateSchema: z.ZodObject<{
    name: z.ZodString;
    rateBasisPoints: z.ZodNumber;
    countryCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isInclusive: z.ZodDefault<z.ZodBoolean>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    id: z.ZodUUID;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type TaxRate = z.infer<typeof taxRateSchema>;
export declare const DEFAULT_STORE_SETTINGS: StoreSettings;
//# sourceMappingURL=settings.d.ts.map