import type { CartItem } from "@prettyfull/store";

const TAX_RATE = 0.18;
/** Même seuil que le bandeau d'annonce du header. */
export const FREE_SHIPPING_THRESHOLD = 25_000;

export interface CartTotals {
	subtotal: number;
	taxes: number;
	total: number;
	/** Le port réel dépend de la zone choisie à la caisse ; seule la gratuité est connue ici. */
	freeShipping: boolean;
	remainingForFreeShipping: number;
}

/**
 * Sous-total/taxes/total, calculés localement à partir du panier.
 * Partagé entre la page `/cart` et le tiroir pour ne pas dupliquer le calcul.
 */
export function useCartTotals(items: CartItem[]): CartTotals {
	const subtotal = items.reduce(
		(acc, item) =>
			acc + (item.unitPrice?.amount ?? item.product.price?.amount ?? 0) * item.quantity,
		0,
	);
	const taxes = subtotal * TAX_RATE;

	return {
		subtotal,
		taxes,
		total: subtotal + taxes,
		freeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
		remainingForFreeShipping: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
	};
}
