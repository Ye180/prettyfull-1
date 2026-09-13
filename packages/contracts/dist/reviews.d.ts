import { z } from "zod";
/**
 * Avis produit, avec photo optionnelle montrant l'article porté.
 *
 * Volontairement minimal, sur le même modèle que le message de contact :
 * modéré (`status: draft` par défaut, publié par un membre du staff) et doté
 * d'un champ leurre anti-robot.
 */
export declare const reviewInputSchema: z.ZodObject<{
    productId: z.ZodUUID;
    rating: z.ZodNumber;
    authorName: z.ZodString;
    authorEmail: z.ZodPipe<z.ZodString, z.ZodEmail>;
    body: z.ZodString;
    photoUrls: z.ZodDefault<z.ZodArray<z.ZodURL>>;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ReviewInput = z.infer<typeof reviewInputSchema>;
/** Forme publique : jamais d'e-mail ni d'IP exposés au storefront. */
export declare const reviewSchema: z.ZodObject<{
    id: z.ZodUUID;
    productId: z.ZodUUID;
    rating: z.ZodNumber;
    authorName: z.ZodString;
    body: z.ZodString;
    photoUrls: z.ZodArray<z.ZodString>;
    status: z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type Review = z.infer<typeof reviewSchema>;
export declare const reviewListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    productId: z.ZodUUID;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
}, z.core.$strip>;
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;
export declare const updateReviewStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>;
}, z.core.$strip>;
export declare const reviewSummarySchema: z.ZodObject<{
    average: z.ZodNumber;
    count: z.ZodNumber;
}, z.core.$strip>;
export type ReviewSummary = z.infer<typeof reviewSummarySchema>;
//# sourceMappingURL=reviews.d.ts.map