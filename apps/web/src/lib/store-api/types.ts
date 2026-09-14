/**
 * Formes consommées par les vues du storefront.
 *
 * Elles reprennent volontairement la structure que les composants
 * déstructurent déjà (`variants[].calculated_price`, `images[].url`,
 * `options[].value`) : la bascule des données statiques vers l'API réelle se
 * fait ainsi sans toucher aux vues.
 *
 * Ce sont des **types d'affichage**, distincts des contrats de l'API : les
 * adaptateurs de `adapters.ts` font la traduction, et c'est le seul endroit à
 * corriger si l'une des deux formes évolue.
 */

export interface StoreMoney {
	calculated_amount: number;
	/** Prix barré, si le produit/la variante est en réduction. */
	original_amount?: number;
	currency_code: string;
}

export interface StoreVariantOptionValue {
	option_id: string;
	value: string;
}

/**
 * Déclinaison achetable.
 *
 * Attention : c'est une **combinaison** couleur × taille, pas la variante au
 * sens du catalogue. Un produit à 2 coloris et 3 tailles produit ici 6
 * entrées, chacune adressant un point de stock unique - c'est ce que le
 * sélecteur du storefront attend.
 */
export interface StoreVariant {
	id: string;
	title: string;
	sku: string;
	thumbnail?: string;
	/** Galerie complète du coloris (§ catalogue) - le sélecteur en affiche plus que la seule vignette. */
	images: StoreImage[];
	calculated_price: StoreMoney;
	options: StoreVariantOptionValue[];
	manage_inventory: boolean;
	allow_backorder: boolean;
	inventory_quantity: number;
	/** Identifiants d'origine, nécessaires pour commander la bonne ligne. */
	product_id: string;
	variant_id: string | null;
	size_id: string | null;
	/** Code hexadécimal du coloris, pour la pastille du sélecteur. */
	color_hex?: string | null;
}

export interface StoreProductOption {
	id: string;
	title: string;
	values: string[];
}

export interface StoreImage {
	id: string;
	url: string;
}

export interface StoreCollection {
	id: string;
	title: string;
	handle: string;
}

export interface StoreCategoryImage {
	id: string;
	url: string;
	file_id: string;
	type: "thumbnail" | "image";
	category_id: string;
}

export interface StoreCategory {
	id: string;
	name: string;
	handle: string;
	metadata?: Record<string, unknown>;
	product_category_image?: StoreCategoryImage[];
	category_children?: StoreCategory[];
}

export interface StoreProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	thumbnail: string;
	images: StoreImage[];
	collection?: StoreCollection;
	category_id: string;
	options: StoreProductOption[];
	variants: StoreVariant[];
}

export interface StoreAddress {
	first_name: string;
	last_name: string;
	address_2?: string;
	address_1: string;
	city: string;
	postal_code: string;
	country_code: string;
	phone?: string;
}

export interface StoreOrderItem {
	id: string;
	thumbnail?: string;
	product_title: string;
	variant_title: string;
	unit_price: number;
	quantity: number;
}

export interface StoreOrder {
	id: string;
	display_id: number;
	status: "pending" | "shipped" | "delivered" | "canceled";
	created_at: string;
	email: string;
	items: StoreOrderItem[];
	shipping_address: StoreAddress;
	subtotal: number;
	shipping_total: number;
	tax_total: number;
	total: number;
	currency_code: string;
}

export interface StoreShippingOption {
	id: string;
	name: string;
	amount: number;
}

export interface StorePaymentProvider {
	id: string;
	name: string;
}

/**
 * « Région » au sens du storefront : un couple devise / libellé.
 *
 * Le back-office ne raisonne pas en régions mais en devises activées ; les
 * régions sont dérivées de ces devises pour que le sélecteur existant
 * continue de fonctionner.
 */
export interface StoreRegion {
	id: string;
	name: string;
	currency_code: string;
}
