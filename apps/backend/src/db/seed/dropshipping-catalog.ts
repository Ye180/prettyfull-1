import { createCategorySchema, createProductSchema } from "@prettyfull/contracts";
import { and, eq, isNull, ne, notInArray, sql } from "drizzle-orm";
import { closeDb, db } from "../index.js";
import * as t from "../schema/index.js";
import {
	createCategory,
	getCategoryBySlug,
	updateCategory,
} from "../../modules/catalog/categories.service.js";
import { createProduct, updateProduct } from "../../modules/catalog/products.service.js";

/**
 * Bascule du catalogue vers l'offre dropshipping (oct. 2026).
 *
 * Exécuté une fois sur la base peuplée, via les services de l'admin (pour un
 * `depth`/`path` cohérents). Rejouable : catégorie ou produit déjà présent
 * (même slug) est réutilisé, pas recréé.
 *
 * L'ancien catalogue vitamines n'est pas supprimé : catégories passées en
 * « inactive » et produits en « archived », tous deux réactivables depuis
 * le panel, l'historique des commandes reste intact.
 *
 * Prix : estimations marché en FCFA, à ajuster dans l'admin. Photos : Pexels
 * (licence libre, usage commercial), servies depuis apps/web/public.
 */

const OLD_CATEGORY_SLUGS = ["vitamines", "mineraux", "proteines", "bien-etre", "nouveautes", "soldes"];

interface SeedProduct {
	name: string;
	nameEn: string;
	price: number;
	image: string;
	description: string;
}

interface SeedCategory {
	slug: string;
	name: string;
	nameEn: string;
	image: string;
	products?: SeedProduct[];
	children?: SeedCategory[];
}

const img = (name: string) => `/products/shop/${name}.jpg`;

const EFFECTS = [
	{ fr: "éclaircissant", frF: "éclaircissante", en: "Brightening", desc: "aide à unifier et illuminer le teint" },
	{ fr: "hydratant", frF: "hydratante", en: "Hydrating", desc: "hydrate en profondeur et laisse la peau souple" },
	{ fr: "nourrissant", frF: "nourrissante", en: "Nourishing", desc: "nourrit et apaise les peaux sèches" },
	{ fr: "clarifiant", frF: "clarifiante", en: "Clarifying", desc: "aide à purifier la peau et affiner le grain" },
] as const;

const careRange = (
	labelFr: string,
	labelEn: string,
	feminine: boolean,
	price: number,
	image: string,
): SeedProduct[] =>
	EFFECTS.map((effect) => ({
		name: `${labelFr} ${feminine ? effect.frF : effect.fr}`,
		nameEn: `${effect.en} ${labelEn}`,
		price,
		image: img(image),
		description: `${labelFr} ${feminine ? effect.frF : effect.fr} fabriqué${feminine ? "e" : ""} aux USA : ${effect.desc}.`,
	}));

const NEW_IPHONES: [string, number, string][] = [
	["17", 700_000, "iphone-new"],
	["17 Pro", 900_000, "iphone-pro"],
	["17 Pro Max", 1_050_000, "iphone-pro"],
	["18 Pro", 1_000_000, "iphone-pro"],
	["18 Pro Max", 1_150_000, "iphone-pro"],
];

const USED_IPHONES: [string, number][] = [
	["X", 110_000], ["XR", 120_000], ["XS", 130_000], ["XS Max", 150_000],
	["11", 170_000], ["11 Pro", 200_000], ["11 Pro Max", 230_000],
	["SE (2e gén.)", 90_000],
	["12 mini", 190_000], ["12", 220_000], ["12 Pro", 270_000], ["12 Pro Max", 310_000],
	["SE (3e gén.)", 130_000],
	["13 mini", 260_000], ["13", 290_000], ["13 Pro", 360_000], ["13 Pro Max", 410_000],
	["14", 340_000], ["14 Plus", 370_000], ["14 Pro", 450_000], ["14 Pro Max", 510_000],
	["15", 420_000], ["15 Plus", 460_000], ["15 Pro", 560_000], ["15 Pro Max", 640_000],
	["16", 520_000], ["16 Plus", 570_000], ["16 Pro", 680_000], ["16 Pro Max", 770_000],
	["16e", 380_000], ["Air", 600_000],
];

const CATALOG: SeedCategory[] = [
	{
		slug: "soins-visage",
		name: "Soins du visage",
		nameEn: "Skincare",
		image: img("face-serum"),
		children: [
			{ slug: "cremes-visage", name: "Crèmes de visage", nameEn: "Face creams", image: img("face-cream"), products: careRange("Crème visage", "Face Cream", true, 17_000, "face-cream") },
			{ slug: "serums-visage", name: "Sérums de visage", nameEn: "Face serums", image: img("face-serum"), products: careRange("Sérum visage", "Face Serum", false, 19_000, "face-serum") },
		],
	},
	{
		slug: "soins-corps",
		name: "Soins du corps",
		nameEn: "Bodycare",
		image: img("body-cream"),
		children: [
			{ slug: "cremes-corps", name: "Crèmes de corps", nameEn: "Body creams", image: img("body-cream"), products: careRange("Crème corps", "Body Cream", true, 15_000, "body-cream") },
			{ slug: "gels-douche", name: "Gels douche", nameEn: "Shower gels", image: img("shower-gel"), products: careRange("Gel douche", "Shower Gel", false, 9_000, "shower-gel") },
			{ slug: "huiles-corps", name: "Huiles de corps", nameEn: "Body oils", image: img("body-oil"), products: careRange("Huile corps", "Body Oil", true, 13_000, "body-oil") },
		],
	},
	{
		slug: "telephones-informatique",
		name: "Téléphones & Informatique",
		nameEn: "Phones & Computers",
		image: img("iphone-new"),
		children: [
			{
				slug: "iphone",
				name: "iPhone",
				nameEn: "iPhone",
				image: img("iphone-new"),
				children: [
					{
						slug: "iphone-neuf",
						name: "Neuf & scellé",
						nameEn: "New & sealed",
						image: img("iphone-new"),
						products: NEW_IPHONES.map(([model, price, image]) => ({
							name: `iPhone ${model} (neuf, scellé)`,
							nameEn: `iPhone ${model} (new, sealed)`,
							price,
							image: img(image),
							description: `iPhone ${model} neuf, scellé dans son emballage d'origine (maison mère).`,
						})),
					},
					{
						slug: "iphone-seconde-main",
						name: "Seconde main",
						nameEn: "Pre-owned",
						image: img("iphone-used"),
						products: USED_IPHONES.map(([model, price]) => ({
							name: `iPhone ${model} (seconde main)`,
							nameEn: `iPhone ${model} (pre-owned)`,
							price,
							image: img("iphone-used"),
							description: `iPhone ${model} de seconde main, en bon état, comme neuf.`,
						})),
					},
				],
			},
			{
				slug: "ordinateurs",
				name: "Ordinateurs",
				nameEn: "Computers",
				image: img("laptop"),
				products: [
					{ name: "Ordinateur portable (sélection USA)", nameEn: "Laptop (US selection)", price: 450_000, image: img("laptop"), description: "Ordinateur portable importé des USA, modèle et configuration sur demande." },
				],
			},
		],
	},
	{
		slug: "hygiene-bucco-dentaire",
		name: "Hygiène bucco-dentaire",
		nameEn: "Oral care",
		image: img("toothpaste"),
		children: [
			{
				slug: "dentifrices",
				name: "Dentifrices",
				nameEn: "Toothpaste",
				image: img("toothpaste"),
				products: [
					{ name: "Dentifrice Colgate", nameEn: "Colgate Toothpaste", price: 3_000, image: img("toothpaste-alt"), description: "Dentifrice Colgate importé des USA." },
					{ name: "Dentifrice Crest", nameEn: "Crest Toothpaste", price: 4_500, image: img("toothpaste"), description: "Dentifrice Crest importé des USA." },
					{ name: "Dentifrice Sensodyne", nameEn: "Sensodyne Toothpaste", price: 5_000, image: img("toothpaste-alt"), description: "Dentifrice Sensodyne pour dents sensibles, importé des USA." },
					{ name: "Dentifrice TheraBreath", nameEn: "TheraBreath Toothpaste", price: 9_000, image: img("toothpaste"), description: "Dentifrice TheraBreath pour une haleine fraîche, importé des USA." },
				],
			},
			{
				slug: "blanchiment-dents",
				name: "Blanchiment des dents",
				nameEn: "Teeth whitening",
				image: img("whitening"),
				products: [
					{ name: "Kit de blanchiment des dents", nameEn: "Teeth Whitening Kit", price: 25_000, image: img("whitening"), description: "Kit de blanchiment dentaire à utiliser à domicile, importé des USA." },
				],
			},
			{
				slug: "bains-de-bouche",
				name: "Bains de bouche",
				nameEn: "Mouthwash",
				image: img("mouthwash"),
				products: [
					{ name: "Bain de bouche TheraBreath", nameEn: "TheraBreath Mouthwash", price: 12_000, image: img("mouthwash"), description: "Bain de bouche TheraBreath, haleine fraîche longue durée, importé des USA." },
				],
			},
		],
	},
	{
		slug: "parfums",
		name: "Parfums",
		nameEn: "Fragrances",
		image: img("perfume"),
		products: [
			{ name: "Eau de parfum (sélection USA)", nameEn: "Eau de Parfum (US selection)", price: 45_000, image: img("perfume"), description: "Parfum importé des USA, fragrance au choix sur demande." },
		],
	},
	{
		slug: "cheveux",
		name: "Cheveux",
		nameEn: "Hair",
		image: img("hair"),
		children: [
			{
				slug: "raw-hair",
				name: "Raw hair (Made in USA)",
				nameEn: "Raw hair (Made in USA)",
				image: img("hair"),
				products: [
					{ name: "Raw hair, mèches naturelles", nameEn: "Raw Hair Bundles", price: 85_000, image: img("hair"), description: "Cheveux naturels non transformés (raw hair), Made in USA. Longueur et texture sur demande." },
				],
			},
		],
	},
	{
		slug: "mode-accessoires",
		name: "Mode & Accessoires",
		nameEn: "Fashion & Accessories",
		image: img("handbag"),
		children: [
			{
				slug: "vetements",
				name: "Vêtements",
				nameEn: "Clothing",
				image: img("activewear"),
				products: [
					{ name: "Vêtements Lululemon", nameEn: "Lululemon Apparel", price: 55_000, image: img("activewear"), description: "Vêtements Lululemon, modèle et taille sur demande." },
					{ name: "Vêtements Alo", nameEn: "Alo Apparel", price: 50_000, image: img("activewear"), description: "Vêtements Alo, modèle et taille sur demande." },
					{ name: "Vêtements, autres marques", nameEn: "Apparel, other brands", price: 25_000, image: img("activewear"), description: "Vêtements de marques américaines, modèle et taille sur demande." },
				],
			},
			{
				slug: "sacs",
				name: "Sacs",
				nameEn: "Bags",
				image: img("handbag"),
				products: [
					{ name: "Sac Coach New York", nameEn: "Coach New York Bag", price: 180_000, image: img("handbag"), description: "Sac Coach New York, modèle sur demande." },
					{ name: "Sac, autres marques", nameEn: "Bag, other brands", price: 60_000, image: img("handbag"), description: "Sacs de marques américaines, modèle sur demande." },
				],
			},
			{
				slug: "valises-voyage",
				name: "Valises de voyage",
				nameEn: "Travel luggage",
				image: img("suitcase"),
				products: [
					{ name: "Valise de voyage", nameEn: "Travel Suitcase", price: 75_000, image: img("suitcase"), description: "Valise de voyage importée des USA, taille et coloris sur demande." },
				],
			},
		],
	},
	{
		slug: "epicerie-americaine",
		name: "Épicerie américaine",
		nameEn: "American groceries",
		image: img("spices"),
		children: [
			{
				slug: "epices-americaines",
				name: "Épices américaines",
				nameEn: "American spices",
				image: img("spices"),
				products: [
					{ name: "Assortiment d'épices américaines", nameEn: "American Spice Assortment", price: 6_000, image: img("spices"), description: "Épices et assaisonnements importés des USA." },
				],
			},
			{
				slug: "biscuits-americains",
				name: "Biscuits américains",
				nameEn: "American cookies",
				image: img("cookies"),
				products: [
					{ name: "Assortiment de biscuits américains", nameEn: "American Cookie Assortment", price: 4_000, image: img("cookies"), description: "Biscuits et cookies importés des USA." },
				],
			},
		],
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

	const root = await getCategoryBySlug("boutique");
	const createdSlugs: string[] = [];
	let categoriesCreated = 0;
	let productsCreated = 0;

	const ensureCategory = async (seed: SeedCategory, parentId: string, position: number) => {
		const existing = await getCategoryBySlug(seed.slug).catch(() => null);
		if (existing) return existing;
		categoriesCreated++;
		return createCategory(
			createCategorySchema.parse({
				name: seed.name,
				slug: seed.slug,
				imageUrl: seed.image,
				parentId,
				position,
				translations: { en: { name: seed.nameEn } },
			}),
		);
	};

	const walk = async (seeds: SeedCategory[], parentId: string) => {
		for (const [position, seed] of seeds.entries()) {
			const category = await ensureCategory(seed, parentId, position);

			for (const product of seed.products ?? []) {
				const slug = slugify(product.name);
				createdSlugs.push(slug);
				const [exists] = await db
					.select({ id: t.products.id })
					.from(t.products)
					.where(and(eq(t.products.slug, slug), isNull(t.products.deletedAt)))
					.limit(1);
				if (exists) continue;

				await createProduct(
					createProductSchema.parse({
						kind: "simple",
						name: product.name,
						slug,
						shortDescription: product.description,
						longDescription: product.description,
						basePrice: product.price,
						currency: "xof",
						status: "published",
						categoryIds: [category.id],
						images: [{ url: product.image, alt: product.name }],
						initialQuantity: 20,
						translations: { en: { name: product.nameEn } },
					}),
					admin.id,
				);
				productsCreated++;
			}

			await walk(seed.children ?? [], category.id);
		}
	};

	await walk(CATALOG, root.id);

	// Ancien catalogue : rayons masqués (sous-rayons compris), produits archivés.
	const oldCategories = await db
		.select({ id: t.categories.id, slug: t.categories.slug })
		.from(t.categories)
		.where(
			and(
				isNull(t.categories.deletedAt),
				sql`split_part(${t.categories.path}, '/', 2) in ${OLD_CATEGORY_SLUGS}`,
			),
		);
	for (const category of oldCategories) {
		await updateCategory(category.id, { status: "inactive" });
	}

	const oldProducts = await db
		.select({ id: t.products.id })
		.from(t.products)
		.where(
			and(
				isNull(t.products.deletedAt),
				ne(t.products.status, "archived"),
				notInArray(t.products.slug, createdSlugs),
			),
		);
	for (const product of oldProducts) {
		await updateProduct(product.id, { status: "archived" });
	}

	console.log(
		`terminé : ${categoriesCreated} catégorie(s) créée(s), ${productsCreated} produit(s) créé(s), ` +
			`${oldCategories.length} ancienne(s) catégorie(s) masquée(s), ${oldProducts.length} ancien(s) produit(s) archivé(s).`,
	);
};

run()
	.catch((error: unknown) => {
		console.error("échec :", error);
		process.exitCode = 1;
	})
	.finally(() => closeDb());
