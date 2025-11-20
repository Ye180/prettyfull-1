// Types Medusa pour le composant CardProduct
// Ces types sont basés sur la structure des données retournées par l'API Medusa

export interface ProductOption {
	id: string;
	title: string;
	product_id: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
	values?: ProductOptionValue[];
}

export interface ProductOptionValue {
	id: string;
	value: string;
	option_id: string;
	variant_id?: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface ProductVariantOption {
	id: string;
	value: string;
	option_id: string;
	variant_id: string;
	metadata?: Record<string, any> | null;
}

export interface MoneyAmount {
	id?: string;
	currency_code: string;
	amount: number;
	calculated_amount?: number;
	min_quantity?: number;
	max_quantity?: number;
	price_list_id?: string | null;
	variant_id?: string;
	region_id?: string | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface ProductVariant {
	id: string;
	title: string | null;
	product_id: string;
	sku?: string | null;
	barcode?: string | null;
	ean?: string | null;
	upc?: string | null;
	variant_rank?: number;
	inventory_quantity?: number;
	allow_backorder?: boolean;
	manage_inventory?: boolean;
	hs_code?: string | null;
	origin_country?: string | null;
	mid_code?: string | null;
	material?: string | null;
	weight?: string | null;
	length?: string | null;
	height?: string | null;
	width?: string | null;
	metadata?: Record<string, any> | null;
	thumbnail?: string | null;
	options?: ProductVariantOption[];
	prices?: MoneyAmount[];
	calculated_price?: number | MoneyAmount;
	original_price?: number | MoneyAmount;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface ProductImage {
	id: string;
	url: string;
	product_id?: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
	rank?: number;
}

export interface ProductCollection {
	id: string;
	title: string;
	handle: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface ProductType {
	id: string;
	value: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface ProductTag {
	id: string;
	value: string;
	metadata?: Record<string, any> | null;
	created_at?: string;
	updated_at?: string;
	deleted_at?: string | null;
}

export interface PricedProduct {
	id: string;
	title: string;
	subtitle?: string | null;
	description?: string | null;
	handle?: string | null;
	is_giftcard?: boolean;
	status?: string;
	thumbnail?: string | null;
	profile_id?: string;
	weight?: string | number | null;
	length?: string | number | null;
	height?: string | number | null;
	width?: string | number | null;
	hs_code?: string | null;
	origin_country?: string | null;
	mid_code?: string | null;
	material?: string | null;
	collection_id?: string | null;
	collection?: ProductCollection | null;
	type_id?: string | null;
	type?: ProductType | null;
	tags?: ProductTag[] | null;
	discountable?: boolean;
	external_id?: string | null;
	metadata?: Record<string, any> | null;
	created_at?: string | null;
	updated_at?: string | null;
	deleted_at?: string | null;
	variants?: ProductVariant[] | null;
	options?: ProductOption[] | null;
	images?: ProductImage[] | null;
}
