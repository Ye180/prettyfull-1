import { z } from "zod";

// Schéma pour Step 1 - Informations générales du produit
export const productStep1Schema = z.object({
	nameFr: z.string().min(1, "Le nom en français est requis"),
	nameEn: z.string().min(1, "Le nom en anglais est requis"),

	descriptionFr: z.string().min(1, "La description en français est requise"),
	descriptionEn: z.string().min(1, "La description en anglais est requise"),

	smallDescriptionFr: z
		.string()
		.min(1, "La courte description en français est requise"),
	smallDescriptionEn: z
		.string()
		.min(1, "La courte description en anglais est requise"),

	categoryId: z.string().min(1, "La catégorie est requise"),
	link: z.string().min(1, "Le lien produit est requis"),
	sku: z.string().min(1, "Le SKU est requis"),
	slug: z.string().min(1, "Le slug est requis"),

	priceAmountFr: z.coerce
		.number({ required_error: "Le prix en XOF est requis" })
		.positive("Le prix doit être positif"),
	priceAmountEn: z.coerce
		.number({ required_error: "Le prix en USD est requis" })
		.positive("Le prix doit être positif"),
	currencyFr: z.string().min(1, "La monnaie française est requise"),
	currencyEn: z.string().min(1, "La devise anglaise est requise"),

	solde: z.boolean().default(false),
	reducedPrice: z.coerce
		.number()
		.min(0, "Le prix réduit doit être positif ou nul")
		.optional(),
	pourcentage: z.coerce
		.number()
		.min(0, "Le pourcentage doit être positif ou nul")
		.max(100, "Le pourcentage ne peut pas dépasser 100")
		.optional(),
	labelFr: z.string().optional(),
	labelEn: z.string().optional(),

	isActive: z.boolean().default(true),
	isFeatured: z.boolean().default(false),
	stock: z.coerce.number().min(0, "Le stock doit être positif ou nul"),

	seoTitleFr: z.string().min(1, "Le titre SEO en français est requis"),
	seoTitleEn: z.string().min(1, "Le titre SEO en anglais est requis"),
	seoDescFr: z.string().min(1, "La description SEO en français est requise"),
	seoDescEn: z.string().min(1, "La description SEO en anglais est requise"),
	seoKeywords: z.string().optional(),
});

// Schéma pour Step 2 - Variantes du produit
export const variantSchema = z.object({
	colorLabel: z.string().min(1, "Le nom de couleur est requis"),
	colorCode: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i, "Code couleur invalide (format: #RRGGBB)"),
	size: z.string().min(1, "Au moins une taille est requise"),
	quantity: z.coerce.number().min(0, "La quantité doit être positive ou nulle"),
	image: z.any().optional(), // FileList validation is complex, keeping flexible
});

export const productStep2Schema = z
	.object({
		variants: z
			.array(variantSchema)
			.min(1, "Au moins une variante est requise"),
	})
	.refine(
		(data) => {
			// Vérifier les doublons de colorCode
			const colorCodes = data.variants.map((v) => v.colorCode.toLowerCase());
			const uniqueColorCodes = new Set(colorCodes);
			return colorCodes.length === uniqueColorCodes.size;
		},
		{
			message: "Vous ne pouvez pas créer deux variantes avec la même couleur",
			path: ["variants"],
		}
	);
