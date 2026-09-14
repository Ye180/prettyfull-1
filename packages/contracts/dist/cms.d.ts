import { z } from "zod";
/**
 * Champs d'une bannière, sans contrôle croisé - même raison que pour les
 * tarifs de livraison : Zod refuse `.partial()` sur un objet raffiné.
 */
export declare const bannerBaseSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subtitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodString;
    mobileImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linkUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ctaLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    placement: z.ZodEnum<{
        home_hero: "home_hero";
        home_secondary: "home_secondary";
        home_promo: "home_promo";
        collection_top: "collection_top";
        sidebar: "sidebar";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    startsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    endsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export declare const bannerInputSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    subtitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodString;
    mobileImageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    linkUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    ctaLabel: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    placement: z.ZodEnum<{
        home_hero: "home_hero";
        home_secondary: "home_secondary";
        home_promo: "home_promo";
        collection_top: "collection_top";
        sidebar: "sidebar";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    startsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    endsAt: z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export declare const updateBannerSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    subtitle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    imageUrl: z.ZodOptional<z.ZodString>;
    mobileImageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    linkUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    ctaLabel: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    placement: z.ZodOptional<z.ZodEnum<{
        home_hero: "home_hero";
        home_secondary: "home_secondary";
        home_promo: "home_promo";
        collection_top: "collection_top";
        sidebar: "sidebar";
    }>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>>;
    position: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    startsAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>>;
    endsAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodISODateTime>>>;
    translations: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>>;
}, z.core.$strip>;
export type BannerInput = z.infer<typeof bannerInputSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export declare const bannerSchema: z.ZodObject<{
    id: z.ZodUUID;
    title: z.ZodNullable<z.ZodString>;
    subtitle: z.ZodNullable<z.ZodString>;
    imageUrl: z.ZodString;
    mobileImageUrl: z.ZodNullable<z.ZodString>;
    linkUrl: z.ZodNullable<z.ZodString>;
    ctaLabel: z.ZodNullable<z.ZodString>;
    placement: z.ZodEnum<{
        home_hero: "home_hero";
        home_secondary: "home_secondary";
        home_promo: "home_promo";
        collection_top: "collection_top";
        sidebar: "sidebar";
    }>;
    status: z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>;
    position: z.ZodNumber;
    startsAt: z.ZodNullable<z.ZodString>;
    endsAt: z.ZodNullable<z.ZodString>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Banner = z.infer<typeof bannerSchema>;
export declare const staticPageInputSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export type StaticPageInput = z.infer<typeof staticPageInputSchema>;
export declare const staticPageSchema: z.ZodObject<{
    slug: z.ZodString;
    title: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
    id: z.ZodUUID;
    publishedAt: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type StaticPage = z.infer<typeof staticPageSchema>;
/**
 * Entrée « vedette » rattachée à une section de page d'accueil.
 * `sectionKey` reprend les clés déjà utilisées par le storefront
 * (`third_section`, `sixth_section`, …) pour ne pas casser l'existant.
 */
export declare const featuredEntryInputSchema: z.ZodObject<{
    kind: z.ZodEnum<{
        product: "product";
        category: "category";
    }>;
    productId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    categoryId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    sectionKey: z.ZodString;
    position: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type FeaturedEntryInput = z.infer<typeof featuredEntryInputSchema>;
export declare const featuredEntrySchema: z.ZodObject<{
    id: z.ZodUUID;
    kind: z.ZodEnum<{
        product: "product";
        category: "category";
    }>;
    productId: z.ZodNullable<z.ZodUUID>;
    categoryId: z.ZodNullable<z.ZodUUID>;
    sectionKey: z.ZodString;
    position: z.ZodNumber;
    isActive: z.ZodBoolean;
    target: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, z.core.$strip>;
export type FeaturedEntry = z.infer<typeof featuredEntrySchema>;
export declare const bannerListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    placement: z.ZodOptional<z.ZodEnum<{
        home_hero: "home_hero";
        home_secondary: "home_secondary";
        home_promo: "home_promo";
        collection_top: "collection_top";
        sidebar: "sidebar";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
}, z.core.$strip>;
export declare const staticPageListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
}, z.core.$strip>;
/**
 * Message envoyé depuis le formulaire de contact du storefront.
 *
 * Volontairement minimal : demander plus qu'un nom, un e-mail et un message
 * fait chuter le taux d'envoi, et le reste se demande dans la réponse.
 */
export declare const contactMessageInputSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
    phone: z.ZodOptional<z.ZodString>;
    subject: z.ZodOptional<z.ZodString>;
    message: z.ZodString;
    website: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ContactMessageInput = z.infer<typeof contactMessageInputSchema>;
export declare const contactMessageSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
    subject: z.ZodNullable<z.ZodString>;
    message: z.ZodString;
    status: z.ZodEnum<{
        archived: "archived";
        new: "new";
        read: "read";
    }>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export type ContactMessage = z.infer<typeof contactMessageSchema>;
export declare const contactMessageListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        archived: "archived";
        new: "new";
        read: "read";
    }>>;
}, z.core.$strip>;
export declare const updateContactMessageSchema: z.ZodObject<{
    status: z.ZodEnum<{
        archived: "archived";
        new: "new";
        read: "read";
    }>;
}, z.core.$strip>;
//# sourceMappingURL=cms.d.ts.map