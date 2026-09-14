import type {
	Banner,
	Category,
	CategoryNode,
	Order,
	Product,
	ShippingOption,
	Size,
	Variant,
} from "@prettyfull/contracts";
import type {
	StoreCategory,
	StoreOrder,
	StoreProduct,
	StoreShippingOption,
	StoreVariant,
} from "./types";

/**
 * Traduction des contrats de l'API vers les formes attendues par les vues.
 *
 * C'est **le seul endroit** où les deux modèles se rencontrent. Les vues du
 * storefront n'ont jamais connaissance du modèle métier, et l'API n'a jamais à
 * se plier à une contrainte d'affichage.
 */

const OPTION_COLOR = "Color";
const OPTION_SIZE = "Size";

/** Prix effectif : cascade taille → variante → produit, comme côté API. */
const priceFor = (
	product: Product,
	variant?: Variant | null,
	size?: Size | null,
): number => size?.priceOverride ?? variant?.priceOverride ?? product.basePrice;

/**
 * Prix barré, s'il existe : cascade variante → produit (les tailles n'ont pas
 * de dérogation propre). `undefined` s'il ne dépasse pas le prix effectif -
 * la carte produit n'affiche une réduction que si elle en est vraiment une.
 */
const compareAtPriceFor = (
	product: Product,
	price: number,
	variant?: Variant | null,
): number | undefined => {
	const compareAt = variant?.compareAtPriceOverride ?? product.compareAtPrice ?? undefined;
	return compareAt != null && compareAt > price ? compareAt : undefined;
};

/**
 * Déplie un produit en combinaisons achetables.
 *
 * Le storefront raisonne en « une variante = un article commandable », là où
 * le catalogue sépare coloris et tailles. Chaque combinaison conserve le
 * triplet d'origine (`product_id`, `variant_id`, `size_id`) : c'est lui que le
 * panier renvoie à l'API pour cibler le bon point de stock.
 */
const buildVariants = (product: Product): StoreVariant[] => {
	const colorOptionId = `opt_color_${product.id}`;
	const sizeOptionId = `opt_size_${product.id}`;

	const base = {
		manage_inventory: true,
		allow_backorder: false,
		product_id: product.id,
	};

	if (product.variants.length > 0) {
		return product.variants.flatMap((variant): StoreVariant[] => {
			const images = (variant.images.length > 0 ? variant.images : product.images).map(
				(image) => ({ id: image.id, url: image.url }),
			);
			const thumbnail = images[0]?.url;

			if (variant.sizes.length === 0) {
				return [
					{
						...base,
						id: variant.id,
						variant_id: variant.id,
						size_id: null,
						title: variant.name,
						sku: variant.sku ?? "",
						thumbnail,
						images,
						calculated_price: {
							calculated_amount: priceFor(product, variant),
							original_amount: compareAtPriceFor(product, priceFor(product, variant), variant),
							currency_code: product.currency,
						},
						options: [{ option_id: colorOptionId, value: variant.name }],
						inventory_quantity: variant.availableQuantity,
						color_hex: variant.colorHex,
					},
				];
			}

			return variant.sizes.map((size) => ({
				...base,
				id: size.id,
				variant_id: variant.id,
				size_id: size.id,
				title: `${variant.name} / ${size.label}`,
				sku: size.sku ?? variant.sku ?? "",
				thumbnail,
				images,
				calculated_price: {
					calculated_amount: priceFor(product, variant, size),
					original_amount: compareAtPriceFor(product, priceFor(product, variant, size), variant),
					currency_code: product.currency,
				},
				options: [
					{ option_id: colorOptionId, value: variant.name },
					{ option_id: sizeOptionId, value: size.label },
				],
				inventory_quantity: size.availableQuantity,
				color_hex: variant.colorHex,
			}));
		});
	}

	if (product.sizes.length > 0) {
		const images = product.images.map((image) => ({ id: image.id, url: image.url }));
		return product.sizes.map((size) => ({
			...base,
			id: size.id,
			variant_id: null,
			size_id: size.id,
			title: size.label,
			sku: size.sku ?? product.sku ?? "",
			thumbnail: images[0]?.url,
			images,
			calculated_price: {
				calculated_amount: priceFor(product, null, size),
				original_amount: compareAtPriceFor(product, priceFor(product, null, size)),
				currency_code: product.currency,
			},
			options: [{ option_id: sizeOptionId, value: size.label }],
			inventory_quantity: size.availableQuantity,
		}));
	}

	// Produit sans déclinaison : une combinaison unique, pour que le
	// storefront ait toujours quelque chose à mettre au panier.
	const images = product.images.map((image) => ({ id: image.id, url: image.url }));
	return [
		{
			...base,
			id: product.id,
			variant_id: null,
			size_id: null,
			title: product.name,
			sku: product.sku ?? "",
			thumbnail: images[0]?.url,
			images,
			calculated_price: {
				calculated_amount: product.basePrice,
				original_amount: compareAtPriceFor(product, product.basePrice),
				currency_code: product.currency,
			},
			options: [],
			inventory_quantity: product.availableQuantity,
		},
	];
};

export const toStoreProduct = (product: Product): StoreProduct => {
	const primaryCategory = product.categories[0];

	const options: StoreProduct["options"] = [];

	if (product.variants.length > 0) {
		options.push({
			id: `opt_color_${product.id}`,
			title: OPTION_COLOR,
			values: product.variants.map((variant) => variant.name),
		});
	}

	// Les libellés de taille sont dédoublonnés : deux coloris partagent en
	// général la même grille, et le sélecteur ne doit pas afficher « M » deux fois.
	const sizeLabels = [
		...new Set([
			...product.variants.flatMap((variant) => variant.sizes.map((size) => size.label)),
			...product.sizes.map((size) => size.label),
		]),
	];

	if (sizeLabels.length > 0) {
		options.push({
			id: `opt_size_${product.id}`,
			title: OPTION_SIZE,
			values: sizeLabels,
		});
	}

	return {
		id: product.id,
		title: product.name,
		handle: product.slug,
		description: product.shortDescription ?? product.longDescription ?? "",
		thumbnail: product.images[0]?.url ?? "",
		images: product.images.map((image) => ({ id: image.id, url: image.url })),
		collection: primaryCategory
			? {
					id: `col_${primaryCategory.id}`,
					title: primaryCategory.name,
					handle: primaryCategory.slug,
				}
			: undefined,
		category_id: primaryCategory?.id ?? "",
		options,
		variants: buildVariants(product),
	};
};

/**
 * Traduit une catégorie.
 *
 * `sectionKeys` provient des mises en avant du back-office : la page d'accueil
 * repère ses rayons par une clé de section présente dans `metadata`
 * (`third_section`, `sixth_section`…). L'injecter ici permet de piloter ces
 * emplacements depuis le panel sans modifier le front.
 */
export const toStoreCategory = (
	category: Category | CategoryNode,
	sectionKeys: Map<string, string> = new Map(),
): StoreCategory => {
	const sectionKey = sectionKeys.get(category.id);

	const metadata: Record<string, unknown> = {
		...(category.translations?.en?.name ? { name_en: category.translations.en.name } : {}),
		...(sectionKey ? { [sectionKey]: true } : {}),
	};

	return {
		id: category.id,
		name: category.name,
		handle: category.slug,
		metadata,
		// Deux entrées attendues par la page d'accueil : la bannière large en
		// premier (desktop), la vignette ensuite (mobile). Quand une seule est
		// renseignée, elle sert aux deux plutôt que de laisser un trou.
		product_category_image: [
			...(category.bannerUrl
				? [
						{
							id: `catbanner_${category.id}`,
							url: category.bannerUrl,
							file_id: category.bannerUrl.split("/").pop() ?? "",
							type: "image" as const,
							category_id: category.id,
						},
					]
				: []),
			...(category.imageUrl
				? [
						{
							id: `catimg_${category.id}`,
							url: category.imageUrl,
							file_id: category.imageUrl.split("/").pop() ?? "",
							type: "thumbnail" as const,
							category_id: category.id,
						},
					]
				: []),
		],
		category_children:
			"children" in category && category.children.length > 0
				? category.children.map((child) => toStoreCategory(child, sectionKeys))
				: undefined,
	};
};

/**
 * Statut de commande simplifié pour l'espace client.
 *
 * Le cycle de vie du back-office compte huit états ; la cliente n'a besoin de
 * savoir que si sa commande est en cours, partie, arrivée ou annulée.
 */
const toStoreStatus = (order: Order): StoreOrder["status"] => {
	if (order.status === "delivered") return "delivered";
	if (order.status === "shipped") return "shipped";
	if (order.status === "cancelled" || order.status === "refunded") return "canceled";
	return "pending";
};

export const toStoreOrder = (order: Order): StoreOrder => ({
	id: order.id,
	display_id: order.displayId,
	status: toStoreStatus(order),
	created_at: order.placedAt,
	email: order.email,
	items: order.items.map((item) => ({
		id: item.id,
		thumbnail: item.thumbnail ?? undefined,
		product_title: item.productName,
		variant_title:
			[item.variantName, item.sizeLabel].filter(Boolean).join(" / ") || "Unique",
		unit_price: item.unitPrice,
		quantity: item.quantity,
	})),
	shipping_address: {
		first_name: order.shippingAddress.firstName ?? "",
		last_name: order.shippingAddress.lastName ?? "",
		address_1: order.shippingAddress.address1 ?? "",
		address_2: order.shippingAddress.address2 ?? undefined,
		city: order.shippingAddress.city ?? "",
		postal_code: order.shippingAddress.postalCode ?? "",
		country_code: order.shippingAddress.countryCode ?? "",
		phone: order.shippingAddress.phone ?? undefined,
	},
	subtotal: order.subtotal,
	shipping_total: order.shippingTotal,
	tax_total: order.taxTotal,
	total: order.total,
	currency_code: order.currency,
});

export const toStoreShippingOption = (option: ShippingOption): StoreShippingOption => ({
	id: option.rateId,
	name: option.name,
	amount: option.amount,
});

/** Bannière : seules l'image et le lien intéressent les vues d'accueil. */
export const toStoreBanner = (banner: Banner) => ({
	id: banner.id,
	title: banner.title ?? "",
	subtitle: banner.subtitle ?? "",
	image: banner.imageUrl,
	mobileImage: banner.mobileImageUrl ?? banner.imageUrl,
	link: banner.linkUrl ?? "",
	cta: banner.ctaLabel ?? "",
	placement: banner.placement,
});

/**
 * Forme « entité brute » attendue par `normalizeCollectionProducts` de
 * `@prettyfull/ui`.
 *
 * Ces normaliseurs ont été écrits contre la réponse Medusa et lisent des
 * champs que notre modèle n'a pas (`hs_code` pour le code couleur,
 * `variant_rank`, horodatages). On les remplit à partir de nos données plutôt
 * que de réécrire les normaliseurs, qui alimentent les grilles produit de tout
 * le storefront.
 */
export const toRawProduct = (product: Product) => {
	const view = toStoreProduct(product);
	const colorByVariantName = new Map(
		product.variants.map((variant) => [variant.name, variant.colorHex ?? null]),
	);

	const timestamps = { created_at: "", updated_at: "", deleted_at: null };

	return {
		id: view.id,
		title: view.title,
		subtitle: null,
		description: view.description,
		handle: view.handle,
		is_giftcard: false,
		discountable: true,
		thumbnail: view.thumbnail,
		collection_id: view.collection?.id ?? null,
		type_id: null,
		weight: product.weightGrams ?? null,
		length: product.lengthMm ?? null,
		height: product.heightMm ?? null,
		width: product.widthMm ?? null,
		// `hs_code` porte le code couleur dans ce modèle brut ; il n'est
		// renseigné qu'au niveau variante, plus bas.
		hs_code: null,
		origin_country: null,
		mid_code: null,
		material: null,
		created_at: product.createdAt,
		updated_at: product.updatedAt,
		type: null,
		collection: view.collection
			? { ...view.collection, metadata: { categorie_id: view.category_id }, ...timestamps }
			: null,
		options: view.options.map((option) => ({
			id: option.id,
			title: option.title,
			metadata: null,
			product_id: view.id,
			...timestamps,
			values: option.values.map((value) => ({
				id: `${option.id}_${value}`,
				value,
				metadata: null,
				option_id: option.id,
				...timestamps,
			})),
		})),
		tags: product.tags,
		images: view.images.map((image, rank) => ({
			id: image.id,
			url: image.url,
			metadata: null,
			rank,
			product_id: view.id,
			...timestamps,
		})),
		variants: view.variants.map((variant, index) => {
			const colorValue = variant.options.find((option) =>
				option.option_id.startsWith("opt_color"),
			)?.value;

			return {
				id: variant.id,
				title: variant.title,
				sku: variant.sku || null,
				barcode: null,
				ean: null,
				upc: null,
				allow_backorder: variant.allow_backorder,
				manage_inventory: variant.manage_inventory,
				hs_code: colorValue ? (colorByVariantName.get(colorValue) ?? null) : null,
				origin_country: null,
				mid_code: null,
				material: null,
				weight: null,
				length: null,
				height: null,
				width: null,
				metadata: null,
				variant_rank: index,
				thumbnail: variant.thumbnail ?? null,
				product_id: view.id,
				...timestamps,
				inventory_quantity: variant.inventory_quantity,
				calculated_price: variant.calculated_price,
				variant_id: variant.variant_id,
				size_id: variant.size_id,
				options: variant.options.map((option) => ({
					id: `${option.option_id}_${option.value}`,
					value: option.value,
					metadata: null,
					option_id: option.option_id,
					option: {
						id: option.option_id,
						title: option.option_id.startsWith("opt_color") ? OPTION_COLOR : OPTION_SIZE,
						metadata: null,
						product_id: view.id,
						...timestamps,
					},
					...timestamps,
				})),
			};
		}),
	};
};
