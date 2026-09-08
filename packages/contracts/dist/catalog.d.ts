import { z } from "zod";
export declare const categoryBaseSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bannerUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export declare const createCategorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bannerUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export declare const updateCategorySchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    imageUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    bannerUrl: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    parentId: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodUUID>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>>;
    position: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    translations: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>>;
}, z.core.$strip>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export declare const categorySchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    bannerUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    parentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
    id: z.ZodUUID;
    depth: z.ZodNumber;
    path: z.ZodString;
    productCount: z.ZodOptional<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Category = z.infer<typeof categorySchema>;
/** Nœud d'arbre : la profondeur n'est pas bornée côté modèle (§2.1). */
export type CategoryNode = Category & {
    children: CategoryNode[];
};
/** Réordonnancement en lot depuis le drag & drop du panel. */
export declare const reorderCategoriesSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        position: z.ZodNumber;
        parentId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Une taille est rattachée soit à une variante, soit directement au produit —
 * jamais aux deux. Le rattachement est déduit du contexte de la route, il
 * n'est donc pas exprimé ici.
 */
export declare const sizeInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    label: z.ZodString;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    position: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    initialQuantity: z.ZodOptional<z.ZodNumber>;
    lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type SizeInput = z.infer<typeof sizeInputSchema>;
export declare const sizeSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    label: z.ZodString;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    id: z.ZodUUID;
    productId: z.ZodNullable<z.ZodUUID>;
    variantId: z.ZodNullable<z.ZodUUID>;
    quantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    stockStatus: z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>;
}, z.core.$strip>;
export type Size = z.infer<typeof sizeSchema>;
export declare const imageInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    position: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type ImageInput = z.infer<typeof imageInputSchema>;
export declare const variantInputSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodUUID>;
    name: z.ZodString;
    colorHex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    compareAtPriceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    position: z.ZodDefault<z.ZodNumber>;
    images: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        position: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    sizes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        label: z.ZodString;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        position: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        initialQuantity: z.ZodOptional<z.ZodNumber>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>;
    initialQuantity: z.ZodOptional<z.ZodNumber>;
    lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export type VariantInput = z.infer<typeof variantInputSchema>;
export declare const variantSchema: z.ZodObject<{
    status: z.ZodDefault<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    name: z.ZodString;
    position: z.ZodDefault<z.ZodNumber>;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    colorHex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    compareAtPriceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    id: z.ZodUUID;
    productId: z.ZodUUID;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        position: z.ZodDefault<z.ZodNumber>;
        id: z.ZodUUID;
    }, z.core.$strip>>;
    sizes: z.ZodArray<z.ZodObject<{
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        position: z.ZodDefault<z.ZodNumber>;
        label: z.ZodString;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        id: z.ZodUUID;
        productId: z.ZodNullable<z.ZodUUID>;
        variantId: z.ZodNullable<z.ZodUUID>;
        quantity: z.ZodNumber;
        availableQuantity: z.ZodNumber;
        stockStatus: z.ZodEnum<{
            in_stock: "in_stock";
            low_stock: "low_stock";
            out_of_stock: "out_of_stock";
        }>;
    }, z.core.$strip>>;
    quantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    stockStatus: z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>;
}, z.core.$strip>;
export type Variant = z.infer<typeof variantSchema>;
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    longDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    basePrice: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    weightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lengthMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    widthMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    heightMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    categoryIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
    images: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        position: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
    kind: z.ZodEnum<{
        simple: "simple";
        variant: "variant";
    }>;
    variants: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        name: z.ZodString;
        colorHex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        compareAtPriceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        position: z.ZodDefault<z.ZodNumber>;
        images: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodUUID>;
            url: z.ZodString;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            position: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>>>;
        sizes: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodOptional<z.ZodUUID>;
            label: z.ZodString;
            sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            position: z.ZodDefault<z.ZodNumber>;
            status: z.ZodDefault<z.ZodEnum<{
                active: "active";
                inactive: "inactive";
            }>>;
            initialQuantity: z.ZodOptional<z.ZodNumber>;
            lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        }, z.core.$strip>>>;
        initialQuantity: z.ZodOptional<z.ZodNumber>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>;
    sizes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        label: z.ZodString;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        position: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        initialQuantity: z.ZodOptional<z.ZodNumber>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.core.$strip>>>;
    initialQuantity: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
/**
 * `kind` est absent de la mise à jour : basculer un produit d'un régime à
 * l'autre détruirait son stock et son historique. On duplique le produit.
 */
export declare const updateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    longDescription: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    sku: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    compareAtPrice: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    currency: z.ZodOptional<z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>>;
    weightGrams: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    lengthMm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    widthMm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    heightMm: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    publishedAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metaTitle: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    metaDescription: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    lowStockThreshold: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    categoryIds: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodUUID>>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        position: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>>;
    translations: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>>;
}, z.core.$strip>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export declare const duplicateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    includeImages: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const productSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    shortDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    longDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    basePrice: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        draft: "draft";
        published: "published";
        archived: "archived";
    }>>;
    weightGrams: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    lengthMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    widthMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    heightMm: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaTitle: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metaDescription: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    lowStockThreshold: z.ZodDefault<z.ZodNumber>;
    categoryIds: z.ZodDefault<z.ZodArray<z.ZodUUID>>;
    translations: z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        fr: "fr";
        en: "en";
    }> & z.core.$partial, z.ZodRecord<z.ZodString, z.ZodString>>>;
    id: z.ZodUUID;
    kind: z.ZodEnum<{
        simple: "simple";
        variant: "variant";
    }>;
    images: z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        position: z.ZodDefault<z.ZodNumber>;
        id: z.ZodUUID;
    }, z.core.$strip>>;
    variants: z.ZodArray<z.ZodObject<{
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        name: z.ZodString;
        position: z.ZodDefault<z.ZodNumber>;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        colorHex: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        compareAtPriceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        id: z.ZodUUID;
        productId: z.ZodUUID;
        images: z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            alt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            position: z.ZodDefault<z.ZodNumber>;
            id: z.ZodUUID;
        }, z.core.$strip>>;
        sizes: z.ZodArray<z.ZodObject<{
            status: z.ZodDefault<z.ZodEnum<{
                active: "active";
                inactive: "inactive";
            }>>;
            position: z.ZodDefault<z.ZodNumber>;
            label: z.ZodString;
            sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            id: z.ZodUUID;
            productId: z.ZodNullable<z.ZodUUID>;
            variantId: z.ZodNullable<z.ZodUUID>;
            quantity: z.ZodNumber;
            availableQuantity: z.ZodNumber;
            stockStatus: z.ZodEnum<{
                in_stock: "in_stock";
                low_stock: "low_stock";
                out_of_stock: "out_of_stock";
            }>;
        }, z.core.$strip>>;
        quantity: z.ZodNumber;
        availableQuantity: z.ZodNumber;
        stockStatus: z.ZodEnum<{
            in_stock: "in_stock";
            low_stock: "low_stock";
            out_of_stock: "out_of_stock";
        }>;
    }, z.core.$strip>>;
    sizes: z.ZodArray<z.ZodObject<{
        status: z.ZodDefault<z.ZodEnum<{
            active: "active";
            inactive: "inactive";
        }>>;
        position: z.ZodDefault<z.ZodNumber>;
        label: z.ZodString;
        sku: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        priceOverride: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        lowStockThreshold: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        id: z.ZodUUID;
        productId: z.ZodNullable<z.ZodUUID>;
        variantId: z.ZodNullable<z.ZodUUID>;
        quantity: z.ZodNumber;
        availableQuantity: z.ZodNumber;
        stockStatus: z.ZodEnum<{
            in_stock: "in_stock";
            low_stock: "low_stock";
            out_of_stock: "out_of_stock";
        }>;
    }, z.core.$strip>>;
    categories: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        slug: z.ZodString;
        name: z.ZodString;
    }, z.core.$strip>>;
    quantity: z.ZodNumber;
    availableQuantity: z.ZodNumber;
    stockStatus: z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
    archivedAt: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type Product = z.infer<typeof productSchema>;
export declare const productListQuerySchema: z.ZodObject<{
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
    kind: z.ZodOptional<z.ZodEnum<{
        simple: "simple";
        variant: "variant";
    }>>;
    categoryId: z.ZodOptional<z.ZodUUID>;
    categorySlug: z.ZodOptional<z.ZodString>;
    collectionSlug: z.ZodOptional<z.ZodString>;
    stockStatus: z.ZodOptional<z.ZodEnum<{
        in_stock: "in_stock";
        low_stock: "low_stock";
        out_of_stock: "out_of_stock";
    }>>;
    minPrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxPrice: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    tag: z.ZodOptional<z.ZodString>;
    isFeatured: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
    includeArchived: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
}, z.core.$strip>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
export declare const categoryListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    parentId: z.ZodOptional<z.ZodUUID>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        inactive: "inactive";
    }>>;
    isFeatured: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
    tree: z.ZodOptional<z.ZodCodec<z.ZodString, z.ZodBoolean>>;
}, z.core.$strip>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
//# sourceMappingURL=catalog.d.ts.map