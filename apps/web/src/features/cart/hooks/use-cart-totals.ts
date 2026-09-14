import type { CartItem } from "@prettyfull/store";

const TAX_RATE = 0.18;
const SHIPPING_FEE = 10;
const FREE_SHIPPING_THRESHOLD = 50_000;

export interface CartTotals {
	subtotal: number;
	shipping: number;
	taxes: number;
	total: number;
}

/**
 * Sous-total/livraison/taxes/total, calculés localement à partir du panier.
 * Partagé entre la page `/cart` et le tiroir pour ne pas dupliquer le calcul.
 */
export function useCartTotals(items: CartItem[]): CartTotals {
	const subtotal = items.reduce(
		(acc, item) =>
			acc + (item.unitPrice?.amount ?? item.product.price?.amount ?? 0) * item.quantity,
		0,
	);
	const shipping = items.length === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + shipping + taxes;

	return { subtotal, shipping, taxes, total };
}
