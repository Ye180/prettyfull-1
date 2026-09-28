/**
 * Catalogue de démonstration.
 *
 * Vitamines, minéraux et compléments alimentaires - mêmes visuels que ceux
 * publiés dans `apps/web/public` (photographies sous licence Pexels, libres
 * d'usage commercial). La bascule du storefront vers l'API réelle est donc
 * invisible à l'écran, ce qui rend toute régression facile à repérer.
 *
 * Les prix d'origine étaient exprimés en euros ; ils sont convertis en francs
 * CFA, devise par défaut de la boutique.
 */

/** Convertit un prix en euros vers un montant XOF arrondi au multiple de 500. */
const toXof = (euros: number): number => Math.round((euros * 655.957) / 500) * 500;

export interface SeedCategory {
	slug: string;
	name: string;
	nameEn: string;
	imageUrl: string;
	/** Section de la page d'accueil où la catégorie est mise en avant. */
	sectionKey?: string;
}

/** Les six rayons de la boutique, tous enfants de la racine « Boutique ». */
export const SEED_ROOT_CATEGORY = {
	slug: "boutique",
	name: "Boutique",
	nameEn: "Shop",
	imageUrl: "/category/category-wellness.jpg",
} as const;

export const SEED_CATEGORIES: SeedCategory[] = [
	{
		slug: "vitamines",
		name: "Vitamines",
		nameEn: "Vitamins",
		imageUrl: "/category/category-vitamins.jpg",
		sectionKey: "third_section",
	},
	{
		slug: "mineraux",
		name: "Minéraux",
		nameEn: "Minerals",
		imageUrl: "/category/category-minerals.jpg",
	},
	{
		slug: "proteines",
		name: "Protéines",
		nameEn: "Protein",
		imageUrl: "/category/category-protein.jpg",
		sectionKey: "sixth_section",
	},
	{
		slug: "bien-etre",
		name: "Bien-être",
		nameEn: "Wellness",
		imageUrl: "/category/category-wellness.jpg",
	},
	{
		slug: "nouveautes",
		name: "Nouveautés",
		nameEn: "New Arrivals",
		imageUrl: "/home/supplements-hero-colorful.jpg",
		sectionKey: "eight_section",
	},
	{ slug: "soldes", name: "Soldes", nameEn: "Sale", imageUrl: "/home/supplements-hero-blue-powder.jpg" },
];

/**
 * Visuels déjà présents dans `apps/web/public`, piochés en rotation.
 *
 * Toutes des photographies de produits/compléments sous licence Pexels
 * (usage commercial libre, aucune attribution requise) - voir le détail des
 * sources dans le rapport de sourcing d'images de ce projet.
 */
const IMAGE_POOL = [
	"/products/vitamin-c-bottle.jpg",
	"/products/protein-powder.jpg",
	"/products/omega3-capsules.jpg",
	"/products/multivitamin.jpg",
	"/products/probiotic.jpg",
	"/products/magnesium.jpg",
	"/products/gummies.jpg",
	"/products/fish-oil.jpg",
	"/products/capsules-bottle.jpg",
	"/home/supplements-hero-blue-powder.jpg",
	"/home/supplements-hero-colorful.jpg",
	"/home/supplements-hero-flatlay.jpg",
];

let imageCursor = 0;
const nextImages = (count: number): string[] =>
	Array.from({ length: count }, () => IMAGE_POOL[imageCursor++ % IMAGE_POOL.length]!);

/** Teintes d'étiquette/packaging par saveur, pour la pastille du sélecteur. */
export const COLOR_HEX: Record<string, string> = {
	Neutre: "#f5f5f0",
	"Fruits rouges": "#b5324f",
	Vanille: "#efe0c0",
	Chocolat: "#5c3a21",
	Tropical: "#f2a65a",
	Citron: "#f4d35e",
};

const FORMAT_OPTIONS = ["30 gélules", "60 gélules", "90 gélules"];
const FORMAT_FLAVORS = ["Neutre", "Fruits rouges"];

export interface SeedVariant {
	name: string;
	colorHex: string;
	images: string[];
	sizes: string[];
	/** Stock par format, aligné sur `sizes` ; sinon stock de la variante. */
	quantities: number[];
}

export interface SeedProduct {
	slug: string;
	name: string;
	nameEn: string;
	description: string;
	categorySlug: string;
	price: number;
	compareAtPrice?: number;
	kind: "simple" | "variant";
	images: string[];
	tags: string[];
	/** Produits `variant` uniquement. */
	variants: SeedVariant[];
	/** Produits `simple` avec formats (30/60/90 gélules). */
	sizes: { label: string; quantity: number }[];
	/** Produits `simple` sans aucune déclinaison : stock porté par le produit. */
	quantity?: number;
	isFeatured?: boolean;
}

interface ProductSource {
	slug: string;
	name: string;
	nameEn: string;
	description: string;
	categorySlug: string;
	price: number;
	/** Remise affichée en prix barré, en pourcentage du prix de base. */
	discountPercent?: number;
	/** Par défaut : produit à variantes saveur × formats (nombre de gélules). */
	model?: "apparel" | "colors-only" | "sizes-only" | "single";
	colors?: string[];
	tags?: string[];
	isFeatured?: boolean;
	/** Quantités forcées, pour peupler les alertes de stock du tableau de bord. */
	quantities?: number[];
	/** Visuel principal dédié (sinon pioché dans `IMAGE_POOL`). */
	heroImage?: string;
}

const SOURCES: ProductSource[] = [
	// --- Vitamines -------------------------------------------------------------
	{ slug: "multivitamine-quotidienne", name: "Multivitamine Quotidienne", nameEn: "Daily Multivitamin", description: "Formule complète de 12 vitamines et 8 minéraux essentiels, une gélule par jour.", categorySlug: "vitamines", price: 18, model: "single", tags: ["quotidien"], quantities: [24], isFeatured: true, heroImage: "/products/multivitamin.jpg" },
	{ slug: "vitamine-c-1000", name: "Vitamine C 1000mg", nameEn: "Vitamin C 1000mg", description: "Vitamine C haute dose à libération prolongée, soutien du système immunitaire.", categorySlug: "vitamines", price: 14, model: "sizes-only", tags: ["immunité"], heroImage: "/products/vitamin-c-bottle.jpg" },
	{ slug: "vitamine-d3-k2", name: "Vitamine D3 + K2", nameEn: "Vitamin D3 + K2", description: "Association D3/K2 pour la santé osseuse et l'absorption du calcium.", categorySlug: "vitamines", price: 16, model: "sizes-only", tags: ["os"] },
	{ slug: "complexe-vitamine-b", name: "Complexe Vitamines B", nameEn: "Vitamin B Complex", description: "Les 8 vitamines B réunies pour soutenir l'énergie et le système nerveux.", categorySlug: "vitamines", price: 15, model: "single", tags: ["énergie"], quantities: [18] },

	// --- Minéraux ----------------------------------------------------------------
	{ slug: "magnesium-marin", name: "Magnésium Marin", nameEn: "Marine Magnesium", description: "Magnésium marin hautement assimilable, pour la détente musculaire et nerveuse.", categorySlug: "mineraux", price: 17, model: "sizes-only", tags: ["détente"], isFeatured: true, heroImage: "/products/magnesium.jpg" },
	{ slug: "zinc-cuivre", name: "Zinc & Cuivre", nameEn: "Zinc & Copper", description: "Association zinc/cuivre équilibrée, soutien du système immunitaire et de la peau.", categorySlug: "mineraux", price: 12, model: "single", tags: ["peau"], quantities: [16] },
	{ slug: "fer-vitamine-c", name: "Fer + Vitamine C", nameEn: "Iron + Vitamin C", description: "Fer bisglycinate associé à la vitamine C pour une meilleure absorption.", categorySlug: "mineraux", price: 13, model: "single", tags: ["énergie"], quantities: [20] },
	{ slug: "calcium-magnesium-d3", name: "Calcium Magnésium D3", nameEn: "Calcium Magnesium D3", description: "Trio calcium, magnésium et vitamine D3 pour la solidité osseuse au quotidien.", categorySlug: "mineraux", price: 16, model: "sizes-only", tags: ["os"] },

	// --- Protéines -----------------------------------------------------------
	{ slug: "proteine-whey-chocolat", name: "Protéine Whey", nameEn: "Whey Protein", description: "Whey isolate à haute teneur en protéines, pour la récupération musculaire.", categorySlug: "proteines", price: 42, model: "colors-only", colors: ["Chocolat", "Vanille"], tags: ["sport"], isFeatured: true, heroImage: "/products/protein-powder.jpg" },
	{ slug: "proteine-vegetale", name: "Protéine Végétale", nameEn: "Plant Protein", description: "Mélange de protéines de pois et de riz, 100% végétal, sans lactose.", categorySlug: "proteines", price: 39, model: "colors-only", colors: ["Vanille", "Fruits rouges"], tags: ["végétal"] },
	{ slug: "collagene-marin", name: "Collagène Marin", nameEn: "Marine Collagen", description: "Collagène hydrolysé d'origine marine, pour la peau et les articulations.", categorySlug: "proteines", price: 28, model: "sizes-only", tags: ["beauté"] },
	{ slug: "bcaa-recuperation", name: "BCAA Récupération", nameEn: "BCAA Recovery", description: "Acides aminés essentiels ratio 2:1:1, pour limiter la fatigue musculaire.", categorySlug: "proteines", price: 24, model: "colors-only", colors: ["Tropical", "Citron"], tags: ["sport"] },

	// --- Bien-être -----------------------------------------------------------
	{ slug: "omega-3-huile-de-poisson", name: "Oméga-3 Huile de Poisson", nameEn: "Omega-3 Fish Oil", description: "Huile de poisson riche en EPA/DHA, pour le cœur et la vision.", categorySlug: "bien-etre", price: 19, model: "sizes-only", tags: ["cœur"], isFeatured: true, heroImage: "/products/fish-oil.jpg" },
	{ slug: "probiotique-10-souches", name: "Probiotique 10 Souches", nameEn: "10-Strain Probiotic", description: "10 souches probiotiques et 10 milliards d'UFC, pour le confort digestif.", categorySlug: "bien-etre", price: 22, model: "sizes-only", tags: ["digestion"], heroImage: "/products/probiotic.jpg" },
	{ slug: "melatonine-sommeil", name: "Mélatonine Sommeil", nameEn: "Sleep Melatonin", description: "Mélatonine dosée avec précision, pour faciliter l'endormissement.", categorySlug: "bien-etre", price: 11, model: "single", tags: ["sommeil"], quantities: [30] },
	{ slug: "curcuma-bioperine", name: "Curcuma & Bioperine", nameEn: "Turmeric & Bioperine", description: "Curcuma associé à la bioperine pour une meilleure biodisponibilité.", categorySlug: "bien-etre", price: 15, model: "single", tags: ["articulations"], quantities: [22] },

	// --- Nouveautés ------------------------------------------------------------
	{ slug: "gummies-immunite", name: "Gummies Immunité", nameEn: "Immunity Gummies", description: "Vitamines C, D et zinc en gommes gourmandes, sans sucre ajouté.", categorySlug: "nouveautes", price: 20, tags: ["nouveauté", "gummies"], isFeatured: true, heroImage: "/products/gummies.jpg" },
	{ slug: "gummies-cheveux-peau-ongles", name: "Gummies Cheveux Peau Ongles", nameEn: "Hair Skin Nails Gummies", description: "Biotine et vitamines en gommes pour la beauté des cheveux, de la peau et des ongles.", categorySlug: "nouveautes", price: 21, model: "colors-only", colors: ["Tropical", "Fruits rouges"], tags: ["nouveauté", "beauté"] },
	{ slug: "ashwagandha-stress", name: "Ashwagandha Anti-Stress", nameEn: "Ashwagandha Stress Relief", description: "Extrait titré d'ashwagandha KSM-66, pour la gestion du stress au quotidien.", categorySlug: "nouveautes", price: 18, model: "single", tags: ["nouveauté", "stress"], quantities: [15], isFeatured: true, heroImage: "/home/supplements-hero-flatlay.jpg" },
	{ slug: "biotine-5000", name: "Biotine 5000mcg", nameEn: "Biotin 5000mcg", description: "Biotine haute dose, pour la beauté des cheveux et des ongles.", categorySlug: "nouveautes", price: 13, model: "single", tags: ["nouveauté", "beauté"], quantities: [18] },

	// --- Soldes --------------------------------------------------------------
	{ slug: "pack-multivitamine-magnesium", name: "Pack Multivitamine + Magnésium", nameEn: "Multivitamin + Magnesium Pack", description: "Le duo multivitamine et magnésium marin, pour l'énergie et la détente.", categorySlug: "soldes", price: 30, discountPercent: 25, model: "single", tags: ["promo"], quantities: [12] },
	{ slug: "vitamine-c-effervescente", name: "Vitamine C Effervescente", nameEn: "Effervescent Vitamin C", description: "Vitamine C en comprimés effervescents, saveur agrume.", categorySlug: "soldes", price: 12, discountPercent: 20, model: "single", tags: ["promo"], quantities: [20] },
	{ slug: "omega3-format-familial", name: "Oméga-3 Format Familial", nameEn: "Omega-3 Family Size", description: "Le format économique de notre oméga-3 le plus vendu.", categorySlug: "soldes", price: 26, discountPercent: 30, model: "sizes-only", tags: ["promo"] },
	{ slug: "collagene-marin-promo", name: "Collagène Marin Format Découverte", nameEn: "Marine Collagen Trial Size", description: "Le format découverte de notre collagène marin, saveur au choix.", categorySlug: "soldes", price: 20, discountPercent: 20, model: "colors-only", colors: ["Neutre", "Fruits rouges"], tags: ["promo"] },
];

/** Quantités par défaut, variées pour rendre les écrans de stock parlants. */
const defaultQuantities = (count: number, offset: number): number[] =>
	Array.from({ length: count }, (_, index) => 6 + ((offset + index * 5) % 22));

export const SEED_PRODUCTS: SeedProduct[] = SOURCES.map((source, sourceIndex) => {
	const model = source.model ?? "apparel";
	const images = source.heroImage ? [source.heroImage, ...nextImages(2)] : nextImages(3);
	const price = toXof(source.price);
	const compareAtPrice = source.discountPercent
		? toXof(Math.round(source.price / (1 - source.discountPercent / 100)))
		: undefined;

	const base = {
		slug: source.slug,
		name: source.name,
		nameEn: source.nameEn,
		description: source.description,
		categorySlug: source.categorySlug,
		price,
		compareAtPrice,
		images,
		tags: source.tags ?? [],
		isFeatured: source.isFeatured ?? false,
	};

	if (model === "single") {
		return {
			...base,
			kind: "simple" as const,
			variants: [],
			sizes: [],
			quantity: source.quantities?.[0] ?? 10,
		};
	}

	if (model === "sizes-only") {
		const quantities = source.quantities ?? defaultQuantities(FORMAT_OPTIONS.length, sourceIndex);
		return {
			...base,
			kind: "simple" as const,
			variants: [],
			sizes: FORMAT_OPTIONS.map((label, index) => ({
				label,
				quantity: quantities[index] ?? 10,
			})),
		};
	}

	const colors = source.colors ?? FORMAT_FLAVORS;
	const sizes = model === "colors-only" ? [] : FORMAT_OPTIONS;

	return {
		...base,
		kind: "variant" as const,
		sizes: [],
		variants: colors.map((color, colorIndex) => ({
			name: color,
			colorHex: COLOR_HEX[color] ?? "#cccccc",
			images: [images[colorIndex % images.length]!],
			sizes,
			quantities:
				sizes.length > 0
					? defaultQuantities(sizes.length, sourceIndex + colorIndex * 3)
					: [defaultQuantities(1, sourceIndex + colorIndex)[0]!],
		})),
	};
});
