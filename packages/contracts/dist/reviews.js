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
    // Uniquement des fichiers téléversés via le formulaire (UploadThing) : une
    // URL libre permettrait de pister l'équipe de modération ou les visiteurs.
    photoUrls: z
        .array(z.url().refine((value) => {
        const { protocol, hostname } = new URL(value);
        return protocol === "https:" && (hostname.endsWith(".ufs.sh") || hostname === "utfs.io");
    }, "Photo non reconnue."))
        .max(6)
        .default([]),
    /** Champ leurre : voir `contactMessageInputSchema`. */
    website: z.string().max(200).optional(),
});
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
export const reviewListQuerySchema = paginationQuerySchema.extend({
    productId: uuidSchema,
    status: z.enum(CONTENT_STATUSES).optional(),
});
export const updateReviewStatusSchema = z.object({
    status: z.enum(CONTENT_STATUSES),
});
export const reviewSummarySchema = z.object({
    average: z.number(),
    count: z.number().int(),
});
//# sourceMappingURL=reviews.js.map