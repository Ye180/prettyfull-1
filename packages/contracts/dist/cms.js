import { z } from "zod";
import { BANNER_PLACEMENTS, CONTACT_MESSAGE_STATUSES, CONTENT_STATUSES, FEATURED_KINDS, } from "./enums.js";
import { emailSchema, paginationQuerySchema, slugSchema, translationsSchema, uuidSchema, } from "./common.js";
// --- Bannières (§2.6) ------------------------------------------------------
/**
 * Champs d'une bannière, sans contrôle croisé — même raison que pour les
 * tarifs de livraison : Zod refuse `.partial()` sur un objet raffiné.
 */
export const bannerBaseSchema = z
    .object({
    title: z.string().trim().max(255).nullish(),
    subtitle: z.string().trim().max(500).nullish(),
    imageUrl: z.string().min(1).max(1_000),
    /** Visuel alternatif servi sous 768 px. */
    mobileImageUrl: z.string().max(1_000).nullish(),
    linkUrl: z.string().max(1_000).nullish(),
    ctaLabel: z.string().trim().max(80).nullish(),
    placement: z.enum(BANNER_PLACEMENTS),
    status: z.enum(CONTENT_STATUSES).default("draft"),
    position: z.number().int().min(0).default(0),
    /** Fenêtre de diffusion : hors de cette plage la bannière n'est pas servie. */
    startsAt: z.iso.datetime().nullish(),
    endsAt: z.iso.datetime().nullish(),
    translations: translationsSchema,
});
const enforceSchedule = (value, ctx) => {
    if (value.startsAt && value.endsAt && value.endsAt <= value.startsAt) {
        ctx.addIssue({
            code: "custom",
            path: ["endsAt"],
            message: "La date de fin doit être postérieure à la date de début.",
        });
    }
};
export const bannerInputSchema = bannerBaseSchema.superRefine(enforceSchedule);
export const updateBannerSchema = bannerBaseSchema.partial().superRefine(enforceSchedule);
export const bannerSchema = z.object({
    id: uuidSchema,
    title: z.string().nullable(),
    subtitle: z.string().nullable(),
    imageUrl: z.string(),
    mobileImageUrl: z.string().nullable(),
    linkUrl: z.string().nullable(),
    ctaLabel: z.string().nullable(),
    placement: z.enum(BANNER_PLACEMENTS),
    status: z.enum(CONTENT_STATUSES),
    position: z.number().int(),
    startsAt: z.string().nullable(),
    endsAt: z.string().nullable(),
    translations: translationsSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
});
// --- Pages statiques -------------------------------------------------------
export const staticPageInputSchema = z.object({
    slug: slugSchema,
    title: z.string().trim().min(1).max(255),
    /** Contenu riche en Markdown, rendu côté storefront. */
    content: z.string().max(200_000),
    excerpt: z.string().max(1_000).nullish(),
    status: z.enum(CONTENT_STATUSES).default("draft"),
    metaTitle: z.string().max(255).nullish(),
    metaDescription: z.string().max(500).nullish(),
    translations: translationsSchema,
});
export const staticPageSchema = staticPageInputSchema.extend({
    id: uuidSchema,
    publishedAt: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});
// --- Mises en avant --------------------------------------------------------
/**
 * Entrée « vedette » rattachée à une section de page d'accueil.
 * `sectionKey` reprend les clés déjà utilisées par le storefront
 * (`third_section`, `sixth_section`, …) pour ne pas casser l'existant.
 */
export const featuredEntryInputSchema = z
    .object({
    kind: z.enum(FEATURED_KINDS),
    productId: uuidSchema.nullish(),
    categoryId: uuidSchema.nullish(),
    sectionKey: z.string().trim().min(1).max(64),
    position: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
})
    .superRefine((value, ctx) => {
    if (value.kind === "product" && !value.productId) {
        ctx.addIssue({
            code: "custom",
            path: ["productId"],
            message: "Un produit vedette doit référencer un produit.",
        });
    }
    if (value.kind === "category" && !value.categoryId) {
        ctx.addIssue({
            code: "custom",
            path: ["categoryId"],
            message: "Une catégorie vedette doit référencer une catégorie.",
        });
    }
});
export const featuredEntrySchema = z.object({
    id: uuidSchema,
    kind: z.enum(FEATURED_KINDS),
    productId: uuidSchema.nullable(),
    categoryId: uuidSchema.nullable(),
    sectionKey: z.string(),
    position: z.number().int(),
    isActive: z.boolean(),
    /** Objet résolu (produit ou catégorie), inclus par les routes storefront. */
    target: z.record(z.string(), z.unknown()).nullable().optional(),
});
export const bannerListQuerySchema = paginationQuerySchema.extend({
    placement: z.enum(BANNER_PLACEMENTS).optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
});
export const staticPageListQuerySchema = paginationQuerySchema.extend({
    q: z.string().trim().max(160).optional(),
    status: z.enum(CONTENT_STATUSES).optional(),
});
// --- Messages de contact ---------------------------------------------------
/**
 * Message envoyé depuis le formulaire de contact du storefront.
 *
 * Volontairement minimal : demander plus qu'un nom, un e-mail et un message
 * fait chuter le taux d'envoi, et le reste se demande dans la réponse.
 */
export const contactMessageInputSchema = z.object({
    name: z.string().trim().min(2, "Votre nom est requis.").max(120),
    email: emailSchema,
    phone: z.string().trim().max(32).optional(),
    subject: z.string().trim().max(160).optional(),
    message: z
        .string()
        .trim()
        .min(10, "Votre message doit faire au moins 10 caractères.")
        .max(5_000),
    /**
     * Champ leurre, invisible pour un humain et rempli par les robots.
     *
     * Il accepte n'importe quelle valeur : le rejeter ici renverrait une erreur
     * nommant le champ, ce qui apprendrait au robot comment passer. C'est la
     * route qui l'écarte, en répondant un succès sans rien enregistrer.
     */
    website: z.string().max(200).optional(),
});
export const contactMessageSchema = z.object({
    id: uuidSchema,
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    subject: z.string().nullable(),
    message: z.string(),
    status: z.enum(CONTACT_MESSAGE_STATUSES),
    createdAt: z.string(),
});
export const contactMessageListQuerySchema = paginationQuerySchema.extend({
    status: z.enum(CONTACT_MESSAGE_STATUSES).optional(),
});
export const updateContactMessageSchema = z.object({
    status: z.enum(CONTACT_MESSAGE_STATUSES),
});
//# sourceMappingURL=cms.js.map