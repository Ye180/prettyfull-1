/**
 * Catalogue de démonstration.
 *
 * Repris à l'identique des données statiques du storefront
 * (`apps/web/src/lib/fake-data`) : mêmes catégories, mêmes produits, mêmes
 * visuels de `/public`. La bascule du storefront vers l'API réelle est donc
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
	imageUrl: "/category/category-principale.jpg",
} as const;

export const SEED_CATEGORIES: SeedCategory[] = [
	{
		slug: "robes",
		name: "Robes",
		nameEn: "Dresses",
		imageUrl: "/category/category-principale.jpg",
		sectionKey: "third_section",
	},
	{ slug: "hauts", name: "Hauts", nameEn: "Tops", imageUrl: "/category/category1.jpg" },
	{
		slug: "ensembles",
		name: "Ensembles",
		nameEn: "Sets",
		imageUrl: "/home/arrivals-1.jpg",
		sectionKey: "sixth_section",
	},
	{
		slug: "accessoires",
		name: "Accessoires",
		nameEn: "Accessories",
		imageUrl: "/home/arrivals-2.jpg",
	},
	{
		slug: "nouveautes",
		name: "Nouveautés",
		nameEn: "New Arrivals",
		imageUrl: "/home/arrivals-3.jpg",
		sectionKey: "eight_section",
	},
	{ slug: "soldes", name: "Soldes", nameEn: "Sale", imageUrl: "/home/arrivals-4.jpg" },
];

/**
 * Visuels déjà présents dans `apps/web/public`, piochés en rotation.
 *
 * Exclut volontairement `/banner/*.jpg` et `/assets/product_1.jpg` : ce sont
 * des gabarits marketing avec du texte (anglais, parfois une autre marque)
 * incrusté dans l'image elle-même, ou une déclinaison sous licence (NFL) -
 * inutilisables comme photo produit générique.
 */
const IMAGE_POOL = [
	"/home/arrivals-1.jpg",
	"/home/arrivals-2.jpg",
	"/home/arrivals-3.jpg",
	"/home/arrivals-4.jpg",
	"/home/commerce.jpg",
	"/home/commerce1.jpg",
	"/home/cover-box-3.jpg",
	"/home/cover-box-7.jpg",
	"/home/cover-box-second-3.jpg",
	"/home/cover-box-second-4.jpg",
	"/home/cover-box-second-5.jpg",
	"/home/cover-desktop.jpg",
	"/home/cover-desktop-1.jpg",
	"/home/promotion.jpg",
	"/collections/banner-mode.jpg",
	"/assets/product_2.jpg",
	"/assets/product5.webp",
	"/products/lifestyle-dressing.jpg",
];

let imageCursor = 0;
const nextImages = (count: number): string[] =>
	Array.from({ length: count }, () => IMAGE_POOL[imageCursor++ % IMAGE_POOL.length]!);

export const COLOR_HEX: Record<string, string> = {
	Noir: "#111111",
	Beige: "#d9c7b0",
	Bordeaux: "#6b1f2e",
	Blanc: "#f5f5f0",
	Kaki: "#6e6b4a",
};

const APPAREL_SIZES = ["S", "M", "L"];
const APPAREL_COLORS = ["Noir", "Beige"];

export interface SeedVariant {
	name: string;
	colorHex: string;
	images: string[];
	sizes: string[];
	/** Stock par taille, aligné sur `sizes` ; sinon stock de la variante. */
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
	/** Produits `simple` avec tailles. */
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
	/** Par défaut : produit à variantes couleur × tailles vestimentaires. */
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
	// --- Robes ---------------------------------------------------------------
	{ slug: "robe-cocktail-satinee", name: "Robe Cocktail Satinée", nameEn: "Satin Cocktail Dress", description: "Robe satinée mi-longue, coupe cintrée, idéale pour vos soirées.", categorySlug: "robes", price: 89, tags: ["soirée", "satin"], isFeatured: true },
	{ slug: "robe-fleurie-ete", name: "Robe Fleurie Été", nameEn: "Summer Floral Dress", description: "Robe légère à motifs fleuris, parfaite pour la saison chaude.", categorySlug: "robes", price: 65, tags: ["été", "fleuri"] },
	{ slug: "robe-longue-fluide", name: "Robe Longue Fluide", nameEn: "Long Flowy Dress", description: "Robe longue en tissu fluide, silhouette élégante et confortable.", categorySlug: "robes", price: 98, tags: ["élégant"], isFeatured: true },

	// --- Hauts ---------------------------------------------------------------
	{ slug: "top-en-soie", name: "Top en Soie", nameEn: "Silk Top", description: "Haut en soie douce, coupe ajustée, à porter en toute occasion.", categorySlug: "hauts", price: 55, tags: ["soie"] },
	// Produit simple à tailles : démontre le second régime du §2.2.
	{ slug: "crop-top-cotele", name: "Crop Top Côtelé", nameEn: "Ribbed Crop Top", description: "Crop top côtelé stretch, parfait pour un look casual chic.", categorySlug: "hauts", price: 32, model: "sizes-only", tags: ["casual"], quantities: [3, 0, 14] },
	{ slug: "chemise-oversize", name: "Chemise Oversize", nameEn: "Oversized Shirt", description: "Chemise oversize en coton, facile à assortir.", categorySlug: "hauts", price: 48, tags: ["coton"] },

	// --- Ensembles -----------------------------------------------------------
	{ slug: "ensemble-tailleur", name: "Ensemble Tailleur", nameEn: "Tailored Set", description: "Ensemble blazer + pantalon assorti, coupe structurée.", categorySlug: "ensembles", price: 140, tags: ["tailleur"], isFeatured: true },
	{ slug: "ensemble-jogging-chic", name: "Ensemble Jogging Chic", nameEn: "Chic Jogging Set", description: "Ensemble sweat + jogging en molleton doux.", categorySlug: "ensembles", price: 78, tags: ["confort"] },
	{ slug: "ensemble-jupe-top", name: "Ensemble Jupe & Top", nameEn: "Skirt & Top Set", description: "Ensemble coordonné jupe midi et top assorti.", categorySlug: "ensembles", price: 92, tags: ["coordonné"] },

	// --- Accessoires ---------------------------------------------------------
	// Variantes couleur sans taille : le stock est porté par la variante.
	{ slug: "sac-a-main-cuir", name: "Sac à Main Cuir", nameEn: "Leather Handbag", description: "Sac à main en cuir vegan, format quotidien.", categorySlug: "accessoires", price: 75, model: "colors-only", colors: ["Noir", "Beige"], tags: ["cuir"] },
	{ slug: "foulard-imprime", name: "Foulard Imprimé", nameEn: "Printed Scarf", description: "Foulard en soie imprimée, accessoire polyvalent.", categorySlug: "accessoires", price: 28, model: "colors-only", colors: ["Bordeaux", "Blanc"], tags: ["soie"] },
	// Produit sans aucune déclinaison : le stock est porté par le produit.
	{ slug: "boucles-oreilles-dorees", name: "Boucles d'Oreilles Dorées", nameEn: "Gold Earrings", description: "Boucles d'oreilles plaquées or, finition brillante.", categorySlug: "accessoires", price: 22, model: "single", tags: ["bijou"], quantities: [4] },

	// --- Nouveautés ----------------------------------------------------------
	{ slug: "blazer-structure", name: "Blazer Structuré", nameEn: "Structured Blazer", description: "Blazer à épaulettes, coupe droite, nouvelle collection.", categorySlug: "nouveautes", price: 110, tags: ["nouveauté"], isFeatured: true },
	{ slug: "pantalon-taille-haute", name: "Pantalon Taille Haute", nameEn: "High-Waisted Pants", description: "Pantalon taille haute en tissu stretch, coupe droite.", categorySlug: "nouveautes", price: 62, tags: ["nouveauté"] },
	{ slug: "manteau-long-laine", name: "Manteau Long Laine", nameEn: "Long Wool Coat", description: "Manteau long en laine mélangée, doublure intérieure.", categorySlug: "nouveautes", price: 158, tags: ["hiver", "laine"] },

	// --- Soldes --------------------------------------------------------------
	{ slug: "jean-slim-delave", name: "Jean Slim Délavé", nameEn: "Faded Slim Jeans", description: "Jean slim délavé, coupe taille haute.", categorySlug: "soldes", price: 45, discountPercent: 30, tags: ["promo", "denim"] },
	{ slug: "pull-en-maille", name: "Pull en Maille", nameEn: "Knit Sweater", description: "Pull en maille douce, coupe ample.", categorySlug: "soldes", price: 39, discountPercent: 25, tags: ["promo"] },
	{ slug: "jupe-plissee", name: "Jupe Plissée", nameEn: "Pleated Skirt", description: "Jupe plissée midi, taille élastiquée.", categorySlug: "soldes", price: 35, discountPercent: 20, tags: ["promo"] },

	// --- Robes (suite) ---------------------------------------------------------
	{ slug: "robe-pailletee-soiree", name: "Robe Pailletée Soirée", nameEn: "Sequin Evening Dress", description: "Robe courte pailletée à bustier, parfaite pour les soirées et événements.", categorySlug: "robes", price: 135, tags: ["soirée", "paillettes"], isFeatured: true, heroImage: "/products/robe-pailletee-soiree.jpg" },
	{ slug: "robe-lin-champetre", name: "Robe en Lin Champêtre", nameEn: "Countryside Linen Dress", description: "Robe longue en lin naturel, manches courtes et taille cintrée par un lien tressé.", categorySlug: "robes", price: 72, tags: ["été", "lin"], heroImage: "/products/robe-lin-champetre.jpg" },
	{ slug: "robe-bustier-blanche", name: "Robe Bustier Blanche", nameEn: "White Bustier Dress", description: "Robe moulante bustier blanche, coupe seconde peau pour une silhouette affirmée.", categorySlug: "robes", price: 68, tags: ["soirée", "moulante"], heroImage: "/products/robe-bustier-blanche.jpg" },
	{ slug: "robe-tunique-brodee", name: "Robe Tunique Brodée", nameEn: "Embroidered Tunic Dress", description: "Robe tunique blanche aux broderies fleuries et col perlé, inspirée des coupes traditionnelles.", categorySlug: "robes", price: 89, tags: ["brodé", "élégant"], heroImage: "/products/robe-tunique-brodee.jpg" },

	// --- Hauts (suite) -----------------------------------------------------------
	{ slug: "chemisier-satine-rose", name: "Chemisier Satiné", nameEn: "Satin Blouse", description: "Chemisier fluide en satin rose poudré, col chemise et manches amples.", categorySlug: "hauts", price: 58, tags: ["satin"], heroImage: "/products/chemisier-satine-rose.jpg" },
	{ slug: "chemise-blanche-intemporelle", name: "Chemise Blanche Intemporelle", nameEn: "Timeless White Shirt", description: "Chemise blanche en coton, coupe classique à porter au bureau comme en ville.", categorySlug: "hauts", price: 45, tags: ["coton", "classique"], heroImage: "/products/chemise-blanche-intemporelle.jpg" },
	{ slug: "pull-jacquard-multicolore", name: "Pull Jacquard Multicolore", nameEn: "Multicolor Jacquard Sweater", description: "Pull en maille jacquard à motifs graphiques, chaud et texturé pour l'hiver.", categorySlug: "hauts", price: 62, tags: ["hiver", "jacquard"], isFeatured: true, heroImage: "/products/pull-jacquard-multicolore.jpg" },
	{ slug: "pull-col-roule-anthracite", name: "Pull Col Roulé Anthracite", nameEn: "Charcoal Turtleneck Sweater", description: "Pull col roulé en maille fine, coupe ajustée, essentiel de la garde-robe froide.", categorySlug: "hauts", price: 49, tags: ["hiver"], heroImage: "/products/pull-col-roule-anthracite.jpg" },

	// --- Ensembles (suite) -------------------------------------------------------
	{ slug: "tailleur-pantalon-rouge", name: "Tailleur Pantalon Rouge", nameEn: "Red Pantsuit", description: "Ensemble blazer et pantalon rouge coquelicot, coupe structurée pour un look affirmé.", categorySlug: "ensembles", price: 155, tags: ["tailleur", "soirée"], isFeatured: true, heroImage: "/products/tailleur-pantalon-rouge.jpg" },
	{ slug: "tailleur-beige-ample", name: "Tailleur Beige Ample", nameEn: "Beige Relaxed Suit", description: "Ensemble blazer oversize et pantalon large beige, silhouette décontractée chic.", categorySlug: "ensembles", price: 132, tags: ["tailleur", "bureau"], heroImage: "/products/tailleur-beige-ample.jpg" },
	{ slug: "blazer-imprime-oversize", name: "Blazer Imprimé Oversize", nameEn: "Oversized Printed Blazer", description: "Blazer long oversize à imprimé magazine, pièce statement à assortir avec un jean brut.", categorySlug: "ensembles", price: 98, tags: ["imprimé", "statement"], heroImage: "/products/blazer-imprime-oversize.jpg" },

	// --- Accessoires (suite) -----------------------------------------------------
	{ slug: "sac-besace-rose", name: "Sac Besace Rose Poudré", nameEn: "Powder Pink Crossbody Bag", description: "Sac besace en simili cuir rose poudré, format compact avec bandoulière ajustable.", categorySlug: "accessoires", price: 48, model: "colors-only", colors: ["Beige", "Noir"], tags: ["sac"], heroImage: "/products/sac-besace-rose.jpg" },
	{ slug: "lunettes-soleil-retro", name: "Lunettes de Soleil Rétro", nameEn: "Retro Sunglasses", description: "Lunettes de soleil rondes à monture dorée, verres teintés effet vintage.", categorySlug: "accessoires", price: 26, model: "single", tags: ["lunettes"], quantities: [15], heroImage: "/products/lunettes-soleil-retro.jpg" },
	{ slug: "lunettes-aviator-jaune", name: "Lunettes Aviator Teintées", nameEn: "Tinted Aviator Sunglasses", description: "Lunettes aviator à monture fine, verres jaunes pour un style affirmé.", categorySlug: "accessoires", price: 24, model: "single", tags: ["lunettes"], quantities: [12], heroImage: "/products/lunettes-aviator-jaune.jpg" },
	{ slug: "parure-bijoux-doree", name: "Parure Bijoux Dorée", nameEn: "Gold Jewelry Set", description: "Parure trois pièces plaquée or : bague, bracelet chaîne et boucles d'oreilles assorties.", categorySlug: "accessoires", price: 42, model: "single", tags: ["bijou"], quantities: [8], isFeatured: true, heroImage: "/products/parure-bijoux-doree.jpg" },

	// --- Nouveautés (suite) --------------------------------------------------------
	{ slug: "blazer-noir-cintre", name: "Blazer Noir Cintré", nameEn: "Fitted Black Blazer", description: "Blazer noir cintré à revers, coupe droite pour un look bureau ou soirée.", categorySlug: "nouveautes", price: 105, tags: ["nouveauté", "bureau"], heroImage: "/products/blazer-noir-cintre.jpg" },
	{ slug: "jean-large-taille-haute", name: "Jean Large Taille Haute", nameEn: "High-Waisted Wide Jeans", description: "Jean large taille haute en denim brut, coupe droite tendance.", categorySlug: "nouveautes", price: 58, tags: ["nouveauté", "denim"], heroImage: "/products/jean-large-taille-haute.jpg" },
	{ slug: "manteau-court-laine-gris", name: "Manteau Court en Laine", nameEn: "Short Wool Coat", description: "Manteau court en laine mélangée grise, coupe croisée et col large.", categorySlug: "nouveautes", price: 128, tags: ["nouveauté", "hiver"], isFeatured: true, heroImage: "/products/manteau-court-laine-gris.jpg" },

	// --- Soldes (suite) --------------------------------------------------------
	{ slug: "pull-torsade-creme", name: "Pull Torsadé Crème", nameEn: "Cream Cable-Knit Sweater", description: "Pull à torsades en maille crème, coupe ample et confortable.", categorySlug: "soldes", price: 44, discountPercent: 25, tags: ["promo", "hiver"], heroImage: "/products/pull-torsade-creme.jpg" },
	{ slug: "boucles-oreilles-perlees", name: "Boucles d'Oreilles Perlées", nameEn: "Pearl Earrings", description: "Boucles d'oreilles ornées de perles nacrées, finition dorée.", categorySlug: "soldes", price: 19, discountPercent: 30, model: "single", tags: ["promo", "bijou"], quantities: [10], heroImage: "/products/boucles-oreilles-perlees.jpg" },
	{ slug: "pull-col-roule-blanc", name: "Pull Col Roulé Blanc", nameEn: "White Turtleneck Sweater", description: "Pull col roulé blanc en maille douce, coupe près du corps.", categorySlug: "soldes", price: 36, discountPercent: 20, tags: ["promo"], heroImage: "/products/pull-col-roule-blanc.jpg" },
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
		const quantities = source.quantities ?? defaultQuantities(APPAREL_SIZES.length, sourceIndex);
		return {
			...base,
			kind: "simple" as const,
			variants: [],
			sizes: APPAREL_SIZES.map((label, index) => ({
				label,
				quantity: quantities[index] ?? 10,
			})),
		};
	}

	const colors = source.colors ?? APPAREL_COLORS;
	const sizes = model === "colors-only" ? [] : APPAREL_SIZES;

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
