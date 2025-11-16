import { z } from "zod";

const i18nString = z.object({
	fr: z
		.string({ message: "Le texte en français est obligatoire" })
		.min(1, "Le texte en français est obligatoire"),
	en: z
		.string({ message: "Le texte en anglais est obligatoire" })
		.min(1, "Le texte en anglais est obligatoire"),
});

export const siteContentSchema = z.object({
	key: z
		.string({ message: "La clé (categorie) est obligatoire" })
		.min(1, "La clé est obligatoire"),
	isActive: z.boolean().default(true),
	sortOrder: z.coerce.number().min(0).default(0),
	quote: i18nString,

	first: z.object({
		title: i18nString,
		description: i18nString,
		imageUrlDesktop: z.instanceof(File, {
			message: "Image desktop est obligatoire",
		}),

		imageUrlMobile: z.instanceof(File, {
			message: "Image mobile est obligatoire",
		}),
		video: z.any().optional(),
		ctaText: i18nString,
		category: z.string().optional(),
	}),

	secondSection: z.object({
		title: i18nString,
		category: z
			.array(z.string({ message: "La catégorie est obligatoire" }))
			.min(1, "La catégorie est obligatoire"),
		ctaText: i18nString,
		parentCategory: z.string({
			message: "La catégorie parente est obligatoire",
		}),
	}),

	thirdSection: z.object({
		imageUrlDesktop: z.instanceof(File, {
			message: "Image desktop est obligatoire",
		}),
		imageUrlMobile: z.instanceof(File, {
			message: "Image mobile est obligatoire",
		}),
		category: z.string().optional(),
	}),

	fourthSection: z.object({
		title: i18nString,
		description: i18nString,
		imageUrl: z.instanceof(File, {
			message: "Image desktop est obligatoire",
		}),
		category: z.string({ message: "La catégorie est obligatoire" }),
		products: z.array(z.string({ message: "Le produit est obligatoire" })),
	}),

	fiveSection: z.object({
		title: i18nString,
		category: z.string({ message: "La categorie est obligatoire" }),
		ctaText: i18nString,
		subCategory: z.array(
			z.string({ message: "La sous-catégorie est obligatoire" }),
			{ message: "La sous-catégorie est obligatoire" }
		),
	}),

	sixSection: z.object({
		imageUrlDesktop: z.instanceof(File, {
			message: "Image desktop est obligatoire",
		}),

		imageUrlMobile: z.instanceof(File, {
			message: "Image mobile est obligatoire",
		}),
		category: z.string({ message: "La catégorie est obligatoire" }),
	}),

	sevenSection: z.object({
		title: i18nString,
		ctaText: i18nString,
		subCategory: z.string().optional(),
		products: z.array(z.string()).optional(),
	}),

	eightSection: z.object({
		imageUrlDesktop: z.instanceof(File, {
			message: "Image destop est obligatoire",
		}),
		imageUrlMobile: z.instanceof(File, {
			message: "Image mobile est obligatoire",
		}),
		category: z.string({ message: "La catégorie est obligatoire" }),
	}),

	nineSection: z.object({
		title: i18nString,
		ctaText: i18nString,
		category: z.string().optional(),
		subCategory: z.array(z.string()).optional(),
	}),

	tenSection: z.object({
		imageUrlDesktop: z.instanceof(File, {
			message: "Image desktop est obligatoire",
		}),
		imageUrlMobile: z.instanceof(File, {
			message: "Image mobile est obligatoire",
		}),
		category: z.string({ message: "La catégorie est obligatoire" }),
	}),
});
