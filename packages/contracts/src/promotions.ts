import { z } from "zod";
import { ACTIVATION_STATUSES, DISCOUNT_TYPES } from "./enums.js";
import { moneySchema, paginationQuerySchema, uuidSchema } from "./common.js";

// --- Codes promo (§2.9) -----------------------------------------------------

/**
 * Un code est soit un pourcentage du sous-total (1-100), soit un montant fixe
 * exprimé dans la plus petite unité monétaire - jamais les deux, d'où le
 * `superRefine` plutôt qu'une union qui compliquerait le formulaire admin.
 */
export const promoCodeBaseSchema = z
	.object({
		code: z
			.string()
			.trim()
			.min(3, "3 caractères minimum.")
			.max(40)
			.regex(/^[A-Za-z0-9_-]+$/, "Lettres, chiffres, tirets et underscores uniquement.")
			.transform((value) => value.toUpperCase()),
		description: z.string().trim().max(500).nullish(),
		discountType: z.enum(DISCOUNT_TYPES),
		discountValue: z.number().int().min(1),
		/** Sous-total minimum requis pour que le code s'applique. */
		minOrderAmount: moneySchema.nullish(),
		/** Plafond de remise - surtout utile pour un pourcentage sans limite. */
		maxDiscountAmount: moneySchema.nullish(),
		/** Nombre total d'utilisations autorisées, tous clients confondus. */
		usageLimit: z.number().int().min(1).nullish(),
		status: z.enum(ACTIVATION_STATUSES).default("active"),
		startsAt: z.iso.datetime().nullish(),
		endsAt: z.iso.datetime().nullish(),
	});

const enforcePromoCodeRules = (
	value: {
		discountType: "percentage" | "fixed";
		discountValue: number;
		startsAt?: string | null;
		endsAt?: string | null;
	},
	ctx: z.RefinementCtx,
): void => {
	if (value.discountType === "percentage" && value.discountValue > 100) {
		ctx.addIssue({
			code: "custom",
			path: ["discountValue"],
			message: "Un pourcentage ne peut pas dépasser 100.",
		});
	}

	if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
		ctx.addIssue({
			code: "custom",
			path: ["endsAt"],
			message: "La date de fin doit être postérieure à la date de début.",
		});
	}
};

export const promoCodeInputSchema = promoCodeBaseSchema.superRefine(enforcePromoCodeRules);

export const updatePromoCodeSchema = promoCodeBaseSchema
	.partial()
	.superRefine((value, ctx) => {
		if (value.discountType && value.discountValue !== undefined) {
			enforcePromoCodeRules(
				{
					discountType: value.discountType,
					discountValue: value.discountValue,
					startsAt: value.startsAt,
					endsAt: value.endsAt,
				},
				ctx,
			);
		} else if (value.startsAt !== undefined || value.endsAt !== undefined) {
			if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
				ctx.addIssue({
					code: "custom",
					path: ["endsAt"],
					message: "La date de fin doit être postérieure à la date de début.",
				});
			}
		}
	});

export type PromoCodeInput = z.infer<typeof promoCodeInputSchema>;
export type UpdatePromoCodeInput = z.infer<typeof updatePromoCodeSchema>;

export const promoCodeSchema = z.object({
	id: uuidSchema,
	code: z.string(),
	description: z.string().nullable(),
	discountType: z.enum(DISCOUNT_TYPES),
	discountValue: z.number().int(),
	minOrderAmount: z.number().int().nullable(),
	maxDiscountAmount: z.number().int().nullable(),
	usageLimit: z.number().int().nullable(),
	usageCount: z.number().int(),
	status: z.enum(ACTIVATION_STATUSES),
	startsAt: z.string().nullable(),
	endsAt: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type PromoCode = z.infer<typeof promoCodeSchema>;

export const promoCodeListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	status: z.enum(ACTIVATION_STATUSES).optional(),
});

export type PromoCodeListQuery = z.infer<typeof promoCodeListQuerySchema>;

/** Application d'un code au panier storefront. */
export const applyDiscountCodeSchema = z.object({
	code: z.string().trim().min(1).max(40),
});

export type ApplyDiscountCodeInput = z.infer<typeof applyDiscountCodeSchema>;
