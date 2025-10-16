export type BoxTypes = {
	picture: string;
	label: string;
};

// export type ProductsTypes = {
// 	name: {
//     	fr: string;
//     	en: string
//   	};
//   	description: {
//     	fr: string,
//     	en: string
//  	};
// 	category?: string;
// 	link?: string;
// 	variable?: {
// 		color: { label: string; code: string };
// 		size: string[];
// 		image: string[] | StaticImport[];
// 		quantity: number;
// 	}[];
// 	notVariable?: {
// 		color?: { label: string; code: string };
// 		size: string[];
// 		image: string[] | StaticImport[];
// 		quantity?: number;
// 	};
// 	smallDescription?: string;
// 	description?: string;
// 	sku: string,
//   	price: {
//     	amount: 0,
//     	currency: string
//   },
// 	solde?: boolean;
// 	promotion?: {
// 		reduced_price: number;
// 		pourcentage: number;
// 	};
// 	isLoading?: boolean;
// 	label?: string;
// 	isActive: true;
//   	isFeatured: true;
//   	seoMeta: {
//     	title: {
//       		fr: string;
//       		en: string;
//     	},
//     	description: {
//       		fr: string;
//       		en: string;
//     	};
//     	keywords: [
//       		string;
//     	]
//   }
// }

// interface CartItem {
// 	productId: string;
// 	sku: string;
// 	name: {
// 		fr: string;
// 		en: string;
// 	};
// 	description?: {
// 		fr: string;
// 		en: string;
// 	};
// 	color?: { label: string; code: string };
// 	size?: string;
// 	image?: string;
// 	quantity: number;
// 	unitPrice: {
// 		amount: number;
// 		currency: string;
// 	};
// 	promotion?: {
// 		reduced_price: number;
// 		pourcentage: number;
// 	};
// 	totalPrice: {
// 		amount: number;
// 		currency: string;
// 	};
// 	isActive: boolean;
// }

// Panier complet
// type Cart = {
// 	id: string;
// 	userId?: string;
// 	items: CartItem[];
// 	subtotal: {
// 		amount: number;
// 		currency: string;
// 	};
// 	discount?: {
// 		amount: number;
// 		currency: string;
// 	};
// 	total: {
// 		amount: number;
// 		currency: string;
// 	};
// 	currency: string;
// 	updatedAt: string; // ISO date
// };

// type Order = {
// 	id: string;
// 	orderNumber: string;
// 	userId?: string;
// 	items: OrderItem[];
// 	billingAddress: Address;
// 	shippingAddress: Address;
// 	payment: PaymentInfo;
// 	subtotal: {
// 		amount: number;
// 		currency: string;
// 	};
// 	shippingCost?: {
// 		amount: number;
// 		currency: string;
// 	};
// 	discount?: {
// 		amount: number;
// 		currency: string;
// 	};
// 	total: {
// 		amount: number;
// 		currency: string;
// 	};
// 	currency: string;
// 	status:
// 		| "pending"
// 		| "paid"
// 		| "processing"
// 		| "shipped"
// 		| "delivered"
// 		| "cancelled"
// 		| "refunded";
// 	createdAt: string;
// 	updatedAt: string;
// };
