// Shapes intentionally mirror the Medusa Store API response shapes that
// components already destructure (variants[].calculated_price, images[].url,
// options[].value, etc.) so the view/adapter layers don't need to change.

export interface FakeMoney {
	calculated_amount: number;
	currency_code: string;
}

export interface FakeVariantOptionValue {
	option_id: string;
	value: string;
}

export interface FakeVariant {
	id: string;
	title: string;
	sku: string;
	thumbnail?: string;
	calculated_price: FakeMoney;
	options: FakeVariantOptionValue[];
	manage_inventory: boolean;
	allow_backorder: boolean;
	inventory_quantity: number;
}

export interface FakeProductOption {
	id: string;
	title: string;
	values: string[];
}

export interface FakeImage {
	id: string;
	url: string;
}

export interface FakeCollection {
	id: string;
	title: string;
	handle: string;
}

export interface FakeCategoryImage {
	id: string;
	url: string;
	file_id: string;
	type: "thumbnail" | "image";
	category_id: string;
}

export interface FakeCategory {
	id: string;
	name: string;
	handle: string;
	metadata?: Record<string, unknown>;
	product_category_image?: FakeCategoryImage[];
	category_children?: FakeCategory[];
}

export interface FakeProduct {
	id: string;
	title: string;
	handle: string;
	description: string;
	thumbnail: string;
	images: FakeImage[];
	collection?: FakeCollection;
	category_id: string;
	options: FakeProductOption[];
	variants: FakeVariant[];
}

export interface FakeAddress {
	first_name: string;
	last_name: string;
	address_2?: string;
	address_1: string;
	city: string;
	postal_code: string;
	country_code: string;
	phone?: string;
}

export interface FakeOrderItem {
	id: string;
	thumbnail?: string;
	product_title: string;
	variant_title: string;
	unit_price: number;
	quantity: number;
}

export interface FakeOrder {
	id: string;
	display_id: number;
	status: "pending" | "shipped" | "delivered" | "canceled";
	created_at: string;
	email: string;
	items: FakeOrderItem[];
	shipping_address: FakeAddress;
	subtotal: number;
	shipping_total: number;
	tax_total: number;
	total: number;
	currency_code: string;
}

export interface FakeShippingOption {
	id: string;
	name: string;
	amount: number;
}

export interface FakePaymentProvider {
	id: string;
	name: string;
}
