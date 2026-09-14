import { z } from "zod";
import {
	ACTIVATION_STATUSES,
	CONTENT_STATUSES,
	PRODUCT_KINDS,
	STOCK_STATUSES,
} from "./enums.js";
import {
	currencySchema,
	moneySchema,
	partialForUpdate,
	quantitySchema,
	slugSchema,
	translationsSchema,
	uuidSchema,
	paginationQuerySchema,
} from "./common.js";

// --- Catégories ------------------------------------------------------------

export const categoryBaseSchema = z.object({
	name: z.string().trim().min(1).max(160),
	slug: slugSchema,
	description: z.string().max(5_000).nullish(),
	imageUrl: z.string().max(1_000).nullish(),
	bannerUrl: z.string().max(1_000).nullish(),
	parentId: uuidSchema.nullish(),
	status: z.enum(ACTIVATION_STATUSES).default("active"),
	position: z.number().int().min(0).default(0),
	isFeatured: z.boolean().default(false),
	metaTitle: z.string().max(255).nullish(),
	metaDescription: z.string().max(500).nullish(),
	translations: translationsSchema,
});

export const createCategorySchema = categoryBaseSchema;
export const updateCategorySchema = partialForUpdate(categoryBaseSchema);

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const categorySchema = categoryBaseSchema.extend({
	id: uuidSchema,
	depth: z.number().int(),
	path: z.string(),
	productCount: z.number().int().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

/** Nœud d'arbre : la profondeur n'est pas bornée côté modèle (§2.1). */
export type CategoryNode = Category & { children: CategoryNode[] };

/** Réordonnancement en lot depuis le drag & drop du panel. */
export const reorderCategoriesSchema = z.object({
	items: z
		.array(
			z.object({
				id: uuidSchema,
				position: z.number().int().min(0),
				parentId: uuidSchema.nullish(),
			}),
		)
		.min(1),
});

// --- Tailles ---------------------------------------------------------------

/**
 * Une taille est rattachée soit à une variante, soit directement au produit -
 * jamais aux deux. Le rattachement est déduit du contexte de la route, il
 * n'est donc pas exprimé ici.
 */
export const sizeInputSchema = z.object({
	id: uuidSchema.optional(),
	label: z.string().trim().min(1).max(32),
	sku: z.string().trim().max(64).nullish(),
	priceOverride: moneySchema.nullish(),
	position: z.number().int().min(0).default(0),
	status: z.enum(ACTIVATION_STATUSES).default("active"),
	/** Stock initial, uniquement à la création : ensuite tout passe par l'inventaire. */
	initialQuantity: quantitySchema.optional(),
	lowStockThreshold: z.number().int().min(0).nullish(),
});

export type SizeInput = z.infer<typeof sizeInputSchema>;

export const updateSizeSchema = partialForUpdate(sizeInputSchema);
export type UpdateSizeInput = z.infer<typeof updateSizeSchema>;

export const sizeSchema = sizeInputSchema.omit({ initialQuantity: true }).extend({
	id: uuidSchema,
	productId: uuidSchema.nullable(),
	variantId: uuidSchema.nullable(),
	quantity: z.number().int(),
	availableQuantity: z.number().int(),
	stockStatus: z.enum(STOCK_STATUSES),
});

export type Size = z.infer<typeof sizeSchema>;

// --- Images ----------------------------------------------------------------

export const imageInputSchema = z.object({
	id: uuidSchema.optional(),
	url: z.string().min(1).max(1_000),
	alt: z.string().max(255).nullish(),
	position: z.number().int().min(0).default(0),
});

export type ImageInput = z.infer<typeof imageInputSchema>;

// --- Variantes -------------------------------------------------------------

export const variantInputSchema = z.object({
	id: uuidSchema.optional(),
	name: z.string().trim().min(1).max(120),
	colorHex: z
		.string()
		.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Couleur hexadécimale invalide.")
		.nullish(),
	sku: z.string().trim().max(64).nullish(),
	/** Surcoût variante : remplace le prix de base quand il est défini (§2.2). */
	priceOverride: moneySchema.nullish(),
	compareAtPriceOverride: moneySchema.nullish(),
	status: z.enum(ACTIVATION_STATUSES).default("active"),
	position: z.number().int().min(0).default(0),
	images: z.array(imageInputSchema).default([]),
	sizes: z.array(sizeInputSchema).default([]),
	/** Stock au niveau variante, seulement si la variante n'a aucune taille. */
	initialQuantity: quantitySchema.optional(),
	lowStockThreshold: z.number().int().min(0).nullish(),
});

export type VariantInput = z.infer<typeof variantInputSchema>;

export const updateVariantSchema = partialForUpdate(variantInputSchema);
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;

export const variantSchema = variantInputSchema
	.omit({ initialQuantity: true, sizes: true, images: true })
	.extend({
		id: uuidSchema,
		productId: uuidSchema,
		images: z.array(imageInputSchema.extend({ id: uuidSchema })),
		sizes: z.array(sizeSchema),
		quantity: z.number().int(),
		availableQuantity: z.number().int(),
		stockStatus: z.enum(STOCK_STATUSES),
	});

export type Variant = z.infer<typeof variantSchema>;

// --- Produits --------------------------------------------------------------

const productCoreSchema = z.object({
	name: z.string().trim().min(1).max(255),
	slug: slugSchema,
	shortDescription: z.string().max(1_000).nullish(),
	longDescription: z.string().max(50_000).nullish(),
	sku: z.string().trim().max(64).nullish(),
	basePrice: moneySchema,
	/** Prix barré. Doit rester strictement supérieur au prix de base (§2.1). */
	compareAtPrice: moneySchema.nullish(),
	currency: currencySchema,
	status: z.enum(CONTENT_STATUSES).default("draft"),
	weightGrams: z.number().int().min(0).nullish(),
	lengthMm: z.number().int().min(0).nullish(),
	widthMm: z.number().int().min(0).nullish(),
	heightMm: z.number().int().min(0).nullish(),
	tags: z.array(z.string().trim().min(1).max(48)).max(30).default([]),
	publishedAt: z.string().nullish(),
	metaTitle: z.string().max(255).nullish(),
	metaDescription: z.string().max(500).nullish(),
	isFeatured: z.boolean().default(false),
	lowStockThreshold: z.number().int().min(0).default(5),
	categoryIds: z.array(uuidSchema).default([]),
	images: z.array(imageInputSchema).default([]),
	translations: translationsSchema,
});

/**
 * Règle de cohérence du §2.2, appliquée à la validation et non seulement en
 * base : un produit `variant` porte des variantes et aucune taille propre ;
 * un produit `simple` porte ses tailles et aucune variante.
 */
const enforceProductModel = <T extends z.ZodTypeAny>(schema: T) =>
	schema.superRefine((value: unknown, ctx: z.RefinementCtx) => {
		const product = value as {
			kind?: string;
			variants?: unknown[];
			sizes?: unknown[];
			basePrice?: number;
			compareAtPrice?: number | null;
		};

		if (product.kind === "variant") {
			if (!product.variants || product.variants.length === 0) {
				ctx.addIssue({
					code: "custom",
					path: ["variants"],
					message: "Un produit à variantes doit déclarer au moins une variante.",
				});
			}
			if (product.sizes && product.sizes.length > 0) {
				ctx.addIssue({
					code: "custom",
					path: ["sizes"],
					message:
						"Un produit à variantes porte ses tailles au niveau des variantes, pas du produit.",
				});
			}
		}

		if (product.kind === "simple" && product.variants && product.variants.length > 0) {
			ctx.addIssue({
				code: "custom",
				path: ["variants"],
				message: "Un produit simple ne peut pas déclarer de variantes.",
			});
		}

		if (
			product.compareAtPrice != null &&
			product.basePrice != null &&
			product.compareAtPrice <= product.basePrice
		) {
			ctx.addIssue({
				code: "custom",
				path: ["compareAtPrice"],
				message: "Le prix barré doit être supérieur au prix de base.",
			});
		}
	});

export const createProductSchema = enforceProductModel(
	productCoreSchema.extend({
		kind: z.enum(PRODUCT_KINDS),
		variants: z.array(variantInputSchema).default([]),
		sizes: z.array(sizeInputSchema).default([]),
		/** Stock d'un produit simple sans taille (§2.3, dernier niveau de repli). */
		initialQuantity: quantitySchema.optional(),
	}),
);

export type CreateProductInput = z.infer<typeof createProductSchema>;

/**
 * `kind` est absent de la mise à jour : basculer un produit d'un régime à
 * l'autre détruirait son stock et son historique. On duplique le produit.
 */
export const updateProductSchema = partialForUpdate(productCoreSchema);

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const duplicateProductSchema = z.object({
	name: z.string().trim().min(1).max(255).optional(),
	slug: slugSchema.optional(),
	/** Le stock n'est jamais dupliqué : un duplicata part à zéro. */
	includeImages: z.boolean().default(true),
});

export const productSchema = productCoreSchema.extend({
	id: uuidSchema,
	kind: z.enum(PRODUCT_KINDS),
	images: z.array(imageInputSchema.extend({ id: uuidSchema })),
	variants: z.array(variantSchema),
	sizes: z.array(sizeSchema),
	categories: z.array(categorySchema.pick({ id: true, name: true, slug: true })),
	quantity: z.number().int(),
	availableQuantity: z.number().int(),
	stockStatus: z.enum(STOCK_STATUSES),
	createdAt: z.string(),
	updatedAt: z.string(),
	archivedAt: z.string().nullable(),
});

export type Product = z.infer<typeof productSchema>;

// --- Filtres de liste ------------------------------------------------------

export const productListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	status: z.enum(CONTENT_STATUSES).optional(),
	kind: z.enum(PRODUCT_KINDS).optional(),
	categoryId: uuidSchema.optional(),
	categorySlug: slugSchema.optional(),
	collectionSlug: slugSchema.optional(),
	stockStatus: z.enum(STOCK_STATUSES).optional(),
	minPrice: z.coerce.number().int().min(0).optional(),
	maxPrice: z.coerce.number().int().min(0).optional(),
	tag: z.string().trim().max(48).optional(),
	isFeatured: z.stringbool().optional(),
	includeArchived: z.stringbool().optional(),
});

export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const categoryListQuerySchema = paginationQuerySchema.extend({
	q: z.string().trim().max(160).optional(),
	parentId: uuidSchema.optional(),
	status: z.enum(ACTIVATION_STATUSES).optional(),
	isFeatured: z.stringbool().optional(),
	/** `true` renvoie l'arbre complet au lieu d'une page plate. */
	tree: z.stringbool().optional(),
});

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
