import type { FakeProduct, FakeVariant } from "./types";
import { categories } from "./categories";

const IMAGE_POOL = [
	"/banner/banner1.jpg",
	"/banner/banner2.jpg",
	"/banner/banner3.jpg",
	"/banner/banner4.jpg",
	"/banner/banner5.jpg",
	"/banner/banner6.jpg",
	"/banner/banner8.jpg",
	"/home/arrivals-1.jpg",
	"/home/arrivals-2.jpg",
	"/home/arrivals-3.jpg",
	"/home/arrivals-4.jpg",
	"/home/commerce.jpg",
	"/home/commerce1.jpg",
	"/home/cover-box-3.jpg",
	"/home/cover-box-7.jpg",
	"/home/cover-box-second-1.jpg",
	"/home/cover-box-second-3.jpg",
	"/home/cover-box-second-4.jpg",
	"/home/cover-box-second-5.jpg",
	"/collections/banner-mode.jpg",
	"/assets/product_1.jpg",
	"/assets/product_2.jpg",
	"/assets/product5.webp",
];

const COLORS = ["Noir", "Beige", "Bordeaux", "Blanc", "Kaki"];
const SIZES = ["XS", "S", "M", "L", "XL"];

const buildVariants = (
	productId: string,
	basePrice: number,
	colors: string[],
	sizes: string[],
	thumbnails: string[],
): FakeVariant[] => {
	const variants: FakeVariant[] = [];
	colors.forEach((color, colorIndex) => {
		const sizesForColor = sizes.length > 0 ? sizes : [null];
		sizesForColor.forEach((size, sizeIndex) => {
			variants.push({
				id: `variant_${productId}_${colorIndex}_${sizeIndex}`,
				title: size ? `${color} / ${size}` : color,
				sku: `${productId.toUpperCase()}-${color.slice(0, 2).toUpperCase()}${size ? `-${size}` : ""}`,
				thumbnail: thumbnails[colorIndex % thumbnails.length],
				calculated_price: { calculated_amount: basePrice, currency_code: "usd" },
				options: [
					{ option_id: `opt_color_${productId}`, value: color },
					...(size ? [{ option_id: `opt_size_${productId}`, value: size }] : []),
				],
				manage_inventory: true,
				allow_backorder: false,
				inventory_quantity: 12,
			});
		});
	});
	return variants;
};

interface ProductSeed {
	id: string;
	title_fr: string;
	title_en: string;
	description_fr: string;
	categoryId: string;
	price: number;
	colors?: string[];
}

const SEEDS: ProductSeed[] = [
	{ id: "prod-robe-cocktail", title_fr: "Robe Cocktail Satinée", title_en: "Satin Cocktail Dress", description_fr: "Robe satinée mi-longue, coupe cintrée, idéale pour vos soirées.", categoryId: "cat_dresses", price: 89 },
	{ id: "prod-robe-fleurie", title_fr: "Robe Fleurie Été", title_en: "Summer Floral Dress", description_fr: "Robe légère à motifs fleuris, parfaite pour la saison chaude.", categoryId: "cat_dresses", price: 65 },
	{ id: "prod-robe-longue", title_fr: "Robe Longue Fluide", title_en: "Long Flowy Dress", description_fr: "Robe longue en tissu fluide, silhouette élégante et confortable.", categoryId: "cat_dresses", price: 98 },
	{ id: "prod-top-soie", title_fr: "Top en Soie", title_en: "Silk Top", description_fr: "Haut en soie douce, coupe ajustée, à porter en toute occasion.", categoryId: "cat_tops", price: 55 },
	{ id: "prod-top-crop", title_fr: "Crop Top Côtelé", title_en: "Ribbed Crop Top", description_fr: "Crop top côtelé stretch, parfait pour un look casual chic.", categoryId: "cat_tops", price: 32 },
	{ id: "prod-top-chemise", title_fr: "Chemise Oversize", title_en: "Oversized Shirt", description_fr: "Chemise oversize en coton, facile à assortir.", categoryId: "cat_tops", price: 48 },
	{ id: "prod-set-tailleur", title_fr: "Ensemble Tailleur", title_en: "Tailored Set", description_fr: "Ensemble blazer + pantalon assorti, coupe structurée.", categoryId: "cat_sets", price: 140 },
	{ id: "prod-set-jogging", title_fr: "Ensemble Jogging Chic", title_en: "Chic Jogging Set", description_fr: "Ensemble sweat + jogging en molleton doux.", categoryId: "cat_sets", price: 78 },
	{ id: "prod-set-jupe", title_fr: "Ensemble Jupe & Top", title_en: "Skirt & Top Set", description_fr: "Ensemble coordonné jupe midi et top assorti.", categoryId: "cat_sets", price: 92 },
	{ id: "prod-acc-sac", title_fr: "Sac à Main Cuir", title_en: "Leather Handbag", description_fr: "Sac à main en cuir vegan, format quotidien.", categoryId: "cat_accessories", price: 75, colors: ["Noir", "Beige"] },
	{ id: "prod-acc-foulard", title_fr: "Foulard Imprimé", title_en: "Printed Scarf", description_fr: "Foulard en soie imprimée, accessoire polyvalent.", categoryId: "cat_accessories", price: 28, colors: ["Bordeaux", "Blanc"] },
	{ id: "prod-acc-boucles", title_fr: "Boucles d'Oreilles Dorées", title_en: "Gold Earrings", description_fr: "Boucles d'oreilles plaquées or, finition brillante.", categoryId: "cat_accessories", price: 22, colors: ["Beige"] },
	{ id: "prod-new-blazer", title_fr: "Blazer Structuré", title_en: "Structured Blazer", description_fr: "Blazer à épaulettes, coupe droite, nouvelle collection.", categoryId: "cat_new", price: 110 },
	{ id: "prod-new-pantalon", title_fr: "Pantalon Taille Haute", title_en: "High-Waisted Pants", description_fr: "Pantalon taille haute en tissu stretch, coupe droite.", categoryId: "cat_new", price: 62 },
	{ id: "prod-new-manteau", title_fr: "Manteau Long Laine", title_en: "Long Wool Coat", description_fr: "Manteau long en laine mélangée, doublure intérieure.", categoryId: "cat_new", price: 158 },
	{ id: "prod-sale-jean", title_fr: "Jean Slim Délavé", title_en: "Faded Slim Jeans", description_fr: "Jean slim délavé, coupe taille haute.", categoryId: "cat_sale", price: 45 },
	{ id: "prod-sale-pull", title_fr: "Pull en Maille", title_en: "Knit Sweater", description_fr: "Pull en maille douce, coupe ample.", categoryId: "cat_sale", price: 39 },
	{ id: "prod-sale-jupe", title_fr: "Jupe Plissée", title_en: "Pleated Skirt", description_fr: "Jupe plissée midi, taille élastiquée.", categoryId: "cat_sale", price: 35 },
];

let imgCursor = 0;
const nextImages = (count: number) => {
	const picked: string[] = [];
	for (let i = 0; i < count; i++) {
		picked.push(IMAGE_POOL[imgCursor % IMAGE_POOL.length]!);
		imgCursor++;
	}
	return picked;
};

export const products: FakeProduct[] = SEEDS.map((seed) => {
	const category = categories.find((c) => c.id === seed.categoryId)!;
	const images = nextImages(3);
	const colors = seed.colors ?? COLORS.slice(0, 2);
	const sizes = seed.colors ? [] : SIZES.slice(1, 4); // S, M, L for apparel; no sizes for accessories

	const options = [{ id: `opt_color_${seed.id}`, title: "Color", values: colors }];
	if (sizes.length > 0) {
		options.push({ id: `opt_size_${seed.id}`, title: "Size", values: sizes });
	}

	return {
		id: seed.id,
		title: seed.title_fr,
		handle: seed.id,
		description: seed.description_fr,
		thumbnail: images[0]!,
		images: images.map((url, i) => ({ id: `${seed.id}_img_${i}`, url })),
		collection: {
			id: `col_${seed.categoryId}`,
			title: category.name,
			handle: category.handle,
		},
		category_id: seed.categoryId,
		options,
		variants: buildVariants(seed.id, seed.price, colors, sizes, images),
	};
});

export const getProductByHandle = (handle: string) =>
	products.find((p) => p.handle === handle);

export const getProductsByCategoryId = (categoryId: string) =>
	products.filter((p) => p.category_id === categoryId);

export const getProductsByCollectionId = (collectionId: string) =>
	products.filter((p) => p.collection?.id === collectionId);

/**
 * Adapts a FakeProduct into the heavier "raw Medusa entity" shape expected by
 * packages/ui's normalizeCollectionProducts/normalizeStandaloneProducts helpers
 * (RawProduct in packages/ui/src/components/product/types.ts).
 */
export const toRawProduct = (product: FakeProduct) => ({
	id: product.id,
	title: product.title,
	subtitle: null,
	description: product.description,
	handle: product.handle,
	is_giftcard: false,
	discountable: true,
	thumbnail: product.thumbnail,
	collection_id: product.collection?.id ?? null,
	type_id: null,
	weight: null,
	length: null,
	height: null,
	width: null,
	hs_code: null,
	origin_country: null,
	mid_code: null,
	material: null,
	created_at: "",
	updated_at: "",
	type: null,
	collection: product.collection
		? {
				id: product.collection.id,
				title: product.collection.title,
				handle: product.collection.handle,
				metadata: { categorie_id: product.category_id },
				created_at: "",
				updated_at: "",
				deleted_at: null,
			}
		: null,
	options: product.options.map((option) => ({
		id: option.id,
		title: option.title,
		metadata: null,
		product_id: product.id,
		created_at: "",
		updated_at: "",
		deleted_at: null,
		values: option.values.map((value) => ({
			id: `${option.id}_${value}`,
			value,
			metadata: null,
			option_id: option.id,
			created_at: "",
			updated_at: "",
			deleted_at: null,
		})),
	})),
	tags: [],
	images: product.images.map((image, rank) => ({
		id: image.id,
		url: image.url,
		metadata: null,
		rank,
		product_id: product.id,
		created_at: "",
		updated_at: "",
		deleted_at: null,
	})),
	variants: product.variants.map((variant) => ({
		id: variant.id,
		title: variant.title,
		sku: variant.sku,
		barcode: null,
		ean: null,
		upc: null,
		allow_backorder: variant.allow_backorder,
		manage_inventory: variant.manage_inventory,
		hs_code: null,
		origin_country: null,
		mid_code: null,
		material: null,
		weight: null,
		length: null,
		height: null,
		width: null,
		metadata: null,
		variant_rank: 0,
		thumbnail: variant.thumbnail ?? null,
		product_id: product.id,
		created_at: "",
		updated_at: "",
		deleted_at: null,
		inventory_quantity: variant.inventory_quantity,
		calculated_price: variant.calculated_price,
		options: variant.options.map((opt) => {
			const parentOption = product.options.find((o) => o.id === opt.option_id);
			return {
				id: `${opt.option_id}_${opt.value}`,
				value: opt.value,
				metadata: null,
				option_id: opt.option_id,
				option: {
					id: opt.option_id,
					title: parentOption?.title ?? "",
					metadata: null,
					product_id: product.id,
					created_at: "",
					updated_at: "",
					deleted_at: null,
				},
				created_at: "",
				updated_at: "",
				deleted_at: null,
			};
		}),
	})),
});
