import { z } from "zod";
import { CONTENT_STATUSES } from "./enums.js";
import { emailSchema, paginationQuerySchema, uuidSchema } from "./common.js";

/**
 * Avis produit, avec photo optionnelle montrant l'article porté.
 *
 * Volontairement minimal, sur le même modèle que le message de contact :
 * modéré (`status: draft` par défaut, publié par un membre du staff) et doté
 * d'un champ leurre anti-robot.
 */
export const reviewInputSchema = z.object({
	productId: uuidSchema,
	rating: z.number().int().min(1, "La note doit être comprise entre 1 et 5.").max(5),
	authorName: z.string().trim().min(2, "Votre nom est requis.").max(120),
	authorEmail: emailSchema,
	body: z
		.string()
		.trim()
		.min(10, "Votre avis doit faire au moins 10 caractères.")
		.max(2_000),
	photoUrls: z.array(z.url()).max(6).default([]),
	/** Champ leurre : voir `contactMessageInputSchema`. */
	website: z.string().max(200).optional(),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;

/** Forme publique : jamais d'e-mail ni d'IP exposés au storefront. */
export const reviewSchema = z.object({
	id: uuidSchema,
	productId: uuidSchema,
	rating: z.number().int(),
	authorName: z.string(),
	body: z.string(),
	photoUrls: z.array(z.string()),
	status: z.enum(CONTENT_STATUSES),
	createdAt: z.string(),
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewListQuerySchema = paginationQuerySchema.extend({
	productId: uuidSchema,
	status: z.enum(CONTENT_STATUSES).optional(),
});

export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;

export const updateReviewStatusSchema = z.object({
	status: z.enum(CONTENT_STATUSES),
});

export const reviewSummarySchema = z.object({
	average: z.number(),
	count: z.number().int(),
});

export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
