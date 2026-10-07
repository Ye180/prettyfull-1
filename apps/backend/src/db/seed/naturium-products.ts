import { createProductSchema } from "@prettyfull/contracts";
import { and, eq, isNull, sql } from "drizzle-orm";
import { closeDb, db } from "../index.js";
import * as t from "../schema/index.js";
import { getCategoryBySlug } from "../../modules/catalog/categories.service.js";
import { createProduct } from "../../modules/catalog/products.service.js";

/**
 * Ajout de 6 best-sellers Naturium (oct. 2026) : 3 soins visage, 3 soins corps.
 *
 * Additif uniquement : contrairement à dropshipping-catalog.ts, rien n'est
 * archivé. Rejouable : un produit déjà présent (même slug) est ignoré.
 *
 * Photos : visuels Naturium recadrés en 1200×1600 (3:4, format des cartes
 * produit), servis depuis apps/web/public/products/naturium. Prix : prix US
 * convertis en FCFA avec marge import, à ajuster dans l'admin.
 *
 * Lancement : pnpm --filter backend exec tsx src/db/seed/naturium-products.ts
 */

interface SeedProduct {
	categorySlug: string;
	name: string;
	nameEn: string;
	price: number;
	images: number;
	file: string;
	tags: string[];
	short: string;
	shortEn: string;
	long: string;
}

const PRODUCTS: SeedProduct[] = [
	{
		categorySlug: "serums-visage",
		name: "Naturium Sérum Vitamine C Complex",
		nameEn: "Naturium Vitamin C Complex Serum",
		price: 19_500,
		images: 2,
		file: "vitamin-c-serum",
		tags: ["naturium", "vitamine c", "éclat"],
		short:
			"Sérum à la vitamine C stabilisée (acide L-ascorbique et ascorbyl phosphate de sodium) associée à un complexe de fruits. Il protège la peau des agressions extérieures, hydrate instantanément et atténue l'apparence des ridules en 4 semaines pour un teint plus lumineux.",
		shortEn:
			"Stabilised vitamin C serum with a fruit complex that defends against environmental stressors, hydrates instantly and visibly softens fine lines in 4 weeks.",
		long: [
			"Ingrédients clés : complexe de vitamine C stabilisée, ascorbyl phosphate de sodium, extraits de fruits, glycérine.",
			"Utilisation : matin et/ou soir, appliquer quelques gouttes sur le visage et le cou propres, avant la crème hydratante. Le matin, terminer par une protection solaire.",
			"Contenance : 30 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
	{
		categorySlug: "cremes-visage",
		name: "Naturium Crème Hydratante Multi-Peptides",
		nameEn: "Naturium Multi-Peptide Moisturizer",
		price: 18_500,
		images: 2,
		file: "multi-peptide-moisturizer",
		tags: ["naturium", "peptides", "anti-âge"],
		short:
			"Crème hydratante riche en peptides, enrichie en vitamine C encapsulée et en panthénol. Elle cible les ridules et les rides pour une peau plus lisse et d'apparence plus jeune, avec des résultats visibles en 8 semaines.",
		shortEn:
			"Peptide-rich moisturiser with encapsulated vitamin C and panthenol that targets fine lines and wrinkles for smoother, younger-looking skin.",
		long: [
			"Ingrédients clés : complexe multi-peptides, vitamine C encapsulée, panthénol.",
			"Utilisation : matin et soir, masser sur le visage et le cou en mouvements ascendants, après le sérum.",
			"Contenance : 50 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
	{
		categorySlug: "serums-visage",
		name: "Naturium Sérum Avancé Multi-Peptides",
		nameEn: "Naturium Multi-Peptide Advanced Serum",
		price: 22_500,
		images: 2,
		file: "multi-peptide-serum",
		tags: ["naturium", "peptides", "anti-âge"],
		short:
			"Sérum concentré aux peptides de cuivre encapsulés et à l'Argireline® Amplified, associés à l'acide férulique et au collagène. Il affine le grain de peau, atténue les rides et raffermit visiblement la peau.",
		shortEn:
			"Concentrated serum with encapsulated copper peptides, Argireline® Amplified, ferulic acid and collagen to refine texture and visibly firm skin.",
		long: [
			"Ingrédients clés : peptides de cuivre encapsulés, Argireline® Amplified, acide férulique encapsulé, collagène.",
			"Utilisation : matin et soir, appliquer sur le visage et le cou propres, avant la crème hydratante.",
			"Contenance : 30 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
	{
		categorySlug: "gels-douche",
		name: "Naturium Gel Douche Hydratant Glow Getter",
		nameEn: "Naturium The Glow Getter Multi-Oil Hydrating Body Wash",
		price: 15_500,
		images: 3,
		file: "glow-getter-body-wash",
		tags: ["naturium", "huiles", "hydratant"],
		short:
			"Gel douche à la texture huile qui se transforme en mousse douce. Il nettoie sans dessécher grâce à 50 % de glycérine, un mélange d'huiles riches en acide linoléique et du squalane végétal : la peau reste hydratée et nourrie.",
		shortEn:
			"Oil-to-gel body wash with 50% glycerin, linoleic-rich oils and plant squalane that cleanses without stripping moisture.",
		long: [
			"Ingrédients clés : glycérine (50 %), huiles végétales riches en acide linoléique, squalane d'origine végétale.",
			"Utilisation : masser sur peau mouillée avec les mains ou une fleur de douche, puis rincer. Peut aussi s'utiliser comme nettoyant visage.",
			"Contenance : 500 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
	{
		categorySlug: "gels-douche",
		name: "Naturium Gel Douche Acide Mandélique The Energizer",
		nameEn: "Naturium The Energizer Mandelic Acid Body Wash",
		price: 15_500,
		images: 2,
		file: "energizer-body-wash",
		tags: ["naturium", "aha", "rafraîchissant"],
		short:
			"Gel douche rafraîchissant à effet frais immédiat. L'acide mandélique, un AHA doux, et la canne à sucre fermentée lissent la peau et aident à neutraliser les odeurs corporelles, tandis que les notes d'agrumes et de plantes aromatiques donnent un vrai coup d'énergie.",
		shortEn:
			"Cooling body wash with gentle mandelic acid and fermented sugar cane that smooths skin and helps fight body odour, with an energising citrus-herbal scent.",
		long: [
			"Ingrédients clés : acide mandélique, canne à sucre fermentée, lactate de menthyle (effet frais), extraits d'agrumes et de plantes aromatiques.",
			"Utilisation : masser sur peau mouillée avec les mains ou une fleur de douche, puis rincer.",
			"Contenance : 500 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
	{
		categorySlug: "cremes-corps",
		name: "Naturium Beurre Corporel Glow Getter",
		nameEn: "Naturium The Glow Getter Multi-Oil Body Butter",
		price: 18_500,
		images: 3,
		file: "glow-getter-body-butter",
		tags: ["naturium", "beurre de karité", "nourrissant"],
		short:
			"Beurre corporel fouetté qui hydrate intensément, nourrit et apaise la peau. Formulé avec des huiles végétales riches en acide linoléique, du beurre de karité, de la glycérine, du squalane et des peptides végétaux qui raffermissent visiblement. Parfum vanille et coco.",
		shortEn:
			"Whipped body butter with botanical oils, shea butter, squalane and plant peptides that deeply moisturises and visibly firms. Vanilla-coconut scent.",
		long: [
			"Ingrédients clés : beurre de karité, huiles végétales riches en acide linoléique, glycérine, squalane, peptides végétaux.",
			"Utilisation : après la douche, appliquer une noisette sur peau propre et sèche, masser jusqu'à absorption.",
			"Contenance : 222 ml. Produit authentique importé des USA.",
		].join("\n\n"),
	},
];

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

const run = async () => {
	const [admin] = await db
		.select({ id: t.users.id })
		.from(t.users)
		.where(sql`${t.users.email} = 'admin@prettyfull.shop'`)
		.limit(1);
	if (!admin) throw new Error("Compte admin@prettyfull.shop introuvable.");

	let created = 0;
	for (const product of PRODUCTS) {
		const slug = slugify(product.name);
		const [exists] = await db
			.select({ id: t.products.id })
			.from(t.products)
			.where(and(eq(t.products.slug, slug), isNull(t.products.deletedAt)))
			.limit(1);
		if (exists) {
			console.log(`déjà présent : ${slug}`);
			continue;
		}

		const category = await getCategoryBySlug(product.categorySlug);
		await createProduct(
			createProductSchema.parse({
				kind: "simple",
				name: product.name,
				slug,
				shortDescription: product.short,
				longDescription: `${product.short}\n\n${product.long}`,
				basePrice: product.price,
				currency: "xof",
				status: "published",
				tags: product.tags,
				categoryIds: [category.id],
				images: Array.from({ length: product.images }, (_, i) => ({
					url: `/products/naturium/${product.file}-${i + 1}.jpg`,
					alt: product.name,
					position: i,
				})),
				initialQuantity: 20,
				translations: { en: { name: product.nameEn, shortDescription: product.shortEn } },
			}),
			admin.id,
		);
		created++;
		console.log(`créé : ${slug}`);
	}

	console.log(`terminé : ${created} produit(s) créé(s).`);
};

run()
	.catch((error: unknown) => {
		console.error("échec :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
