import type { FakeOrder, FakePaymentProvider, FakeShippingOption } from "./types";
import { products } from "./products";

export const shippingOptions: FakeShippingOption[] = [
	{ id: "so_standard", name: "Standard (5-7 jours)", amount: 6 },
	{ id: "so_express", name: "Express (2-3 jours)", amount: 15 },
];

export const paymentProviders: FakePaymentProvider[] = [
	{ id: "pp_stripe_stripe", name: "Credit / Debit Card (Stripe)" },
];

const buildOrder = (
	id: string,
	displayId: number,
	status: FakeOrder["status"],
	daysAgo: number,
): FakeOrder => {
	const picked = [products[0]!, products[3]!];
	const items = picked.map((p, i) => ({
		id: `${id}_item_${i}`,
		thumbnail: p.thumbnail,
		product_title: p.title,
		variant_title: p.variants[0]!.title,
		unit_price: p.variants[0]!.calculated_price.calculated_amount,
		quantity: 1,
	}));
	const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
	const shipping_total = shippingOptions[0]!.amount;
	const tax_total = 0;

	const created = new Date();
	created.setDate(created.getDate() - daysAgo);

	return {
		id,
		display_id: displayId,
		status,
		created_at: created.toISOString(),
		email: "demo@prettyfull.shop",
		items,
		shipping_address: {
			first_name: "Jane",
			last_name: "Doe",
			address_1: "123 Main St",
			city: "Austin",
			postal_code: "73301",
			country_code: "us",
			phone: "+1 512 555 0100",
		},
		subtotal,
		shipping_total,
		tax_total,
		total: subtotal + shipping_total + tax_total,
		currency_code: "usd",
	};
};

export const orders: FakeOrder[] = [
	buildOrder("order_fake_1", 1001, "delivered", 14),
	buildOrder("order_fake_2", 1002, "shipped", 5),
	buildOrder("order_fake_3", 1003, "pending", 1),
];

export const getOrderById = (id: string) => orders.find((o) => o.id === id);

export const createFakeOrder = (input: {
	items: FakeOrder["items"];
	shipping_address: FakeOrder["shipping_address"];
	email: string;
}): FakeOrder => {
	const subtotal = input.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
	const shipping_total = shippingOptions[0]!.amount;
	const order: FakeOrder = {
		id: `order_fake_${orders.length + 1}`,
		display_id: 1000 + orders.length + 1,
		status: "pending",
		created_at: new Date().toISOString(),
		email: input.email,
		items: input.items,
		shipping_address: input.shipping_address,
		subtotal,
		shipping_total,
		tax_total: 0,
		total: subtotal + shipping_total,
		currency_code: "usd",
	};
	orders.unshift(order);
	return order;
};
