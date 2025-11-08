export interface Product {
	name: {
		fr: string;
		en: string;
	};
	description: {
		fr: string;
		en: string;
	};
	categoryId: string;
	link: string;
	variable: ProductVariant[];
	smallDescription: string;
	sku: string;
	price: {
		amount: number;
		currency: string;
	};
	solde: boolean;
	promotion?: {
		reduced_price: number;
		pourcentage: number;
	};
	isLoading: boolean;
	label?: string;
	isActive: boolean;
	isFeatured: boolean;
	stock: number;
	seoMeta?: {
		title: {
			fr: string;
			en: string;
		};
		description: {
			fr: string;
			en: string;
		};
		keywords: string[];
	};
}

export interface ProductVariant {
	color: {
		label: string;
		code: string;
	};
	size: string[];
	image: string[];
	quantity: number;
}
