import { z } from "zod";
/**
 * Un code est soit un pourcentage du sous-total (1-100), soit un montant fixe
 * exprimé dans la plus petite unité monétaire - jamais les deux, d'où le
 * `superRefine` plutôt qu'une union qui compliquerait le formulaire admin.
 */
export declare const promoCodeBaseSchema: z.ZodObject<{
    code: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountType: z.ZodEnum<{
        percentage: "percentage";
        fixed: "fixed";
    }>;
    discountValue: z.ZodNumber;
    minOrderAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxDiscountAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    usageLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    startsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    endsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
}, z.core.$strip>;
export declare const promoCodeInputSchema: z.ZodObject<{
    code: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    discountType: z.ZodEnum<{
        percentage: "percentage";
        fixed: "fixed";
    }>;
    discountValue: z.ZodNumber;
    minOrderAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    maxDiscountAmount: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    usageLimit: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    startsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    endsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
}, z.core.$strip>;
export declare const updatePromoCodeSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    discountType: z.ZodOptional<z.ZodEnum<{
        percentage: "percentage";
        fixed: "fixed";
    }>>;
    discountValue: z.ZodOptional<z.ZodNumber>;
    minOrderAmount: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    maxDiscountAmount: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    usageLimit: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>>;
    startsAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>>;
    endsAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>>;
}, z.core.$strip>;
export type PromoCodeInput = z.infer<typeof promoCodeInputSchema>;
export type UpdatePromoCodeInput = z.infer<typeof updatePromoCodeSchema>;
export declare const promoCodeSchema: z.ZodObject<{
    id: z.ZodUUID;
    code: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    discountType: z.ZodEnum<{
        percentage: "percentage";
        fixed: "fixed";
    }>;
    discountValue: z.ZodNumber;
    minOrderAmount: z.ZodNullable<z.ZodNumber>;
    maxDiscountAmount: z.ZodNullable<z.ZodNumber>;
    usageLimit: z.ZodNullable<z.ZodNumber>;
    usageCount: z.ZodNumber;
    status: z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>;
    startsAt: z.ZodNullable<z.ZodString>;
    endsAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type PromoCode = z.infer<typeof promoCodeSchema>;
export declare const promoCodeListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
}, z.core.$strip>;
export type PromoCodeListQuery = z.infer<typeof promoCodeListQuerySchema>;
/** Application d'un code au panier storefront. */
export declare const applyDiscountCodeSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$strip>;
export type ApplyDiscountCodeInput = z.infer<typeof applyDiscountCodeSchema>;
//# sourceMappingURL=promotions.d.ts.map