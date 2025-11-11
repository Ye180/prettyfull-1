import { z } from "zod";

export const categorySchema = z.object({
	nameFr: z
		.string()
		.min(2, "Le nom en français doit contenir au moins 2 caractères"),
	nameEn: z
		.string()
		.min(2, "The name in English must contain at least 2 characters"),
	slug: z
		.string()
		.min(2, "Le slug doit contenir au moins 2 caractères")
		.regex(
			/^[a-z0-9-]+$/,
			"Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
		),
	descriptionFr: z
		.string()
		.min(10, "La description en français doit contenir au moins 10 caractères"),
	descriptionEn: z
		.string()
		.min(10, "The description in English must contain at least 10 characters"),
	parent: z.string().optional(),
	countries: z
		.string()
		.optional()
		.refine((val) => {
			if (!val || val.trim() === "") return true;
			const codes = val.split(",").map((c) => c.trim().toUpperCase());
			return codes.every((code) => code.length === 2);
		}, "Les codes pays doivent être au format ISO alpha-2 (ex: CI, SN, FR)"),
	isActive: z.boolean().default(false),
	isVisible: z.boolean().default(false),
	first: z.boolean().default(false),
	second: z.boolean().default(false),
	displayOrder: z.coerce
		.number()
		.min(0, "L'ordre doit être un nombre positif")
		.default(0),
	icon: z.string().optional(),
	image: z.any().optional(),
	seoTitleFr: z.string().optional(),
	seoTitleEn: z.string().optional(),
	seoDescFr: z.string().optional(),
	seoDescEn: z.string().optional(),
	seoKeywords: z.string().optional(),
});
