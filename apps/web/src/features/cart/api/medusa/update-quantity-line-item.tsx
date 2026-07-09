import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { StoreCart } from "@medusajs/types";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateQuantityVars {
	cartId: string;
	itemId: string;
	quantity: number;
}

// Recalcule localement les totaux du panier pour un affichage instantané
// (avant la réponse du serveur). Le serveur reste la source de vérité et
// réconcilie les valeurs exactes (taxes, livraison) via onSuccess.
export const buildOptimisticCart = (
	cart: StoreCart,
	itemId: string,
	quantity: number,
): StoreCart => {
	const items = (cart.items ?? []).map((item) => {
		if (item.id !== itemId) return item;

		const prevQty = item.quantity || 1;
		const ratio = quantity / prevQty;
		const scale = (value?: number | null) =>
			typeof value === "number" ? value * ratio : value;

		return {
			...item,
			quantity,
			subtotal: item.unit_price * quantity,
			total: scale(item.total),
			original_total: scale(item.original_total),
			tax_total: scale(item.tax_total),
			original_tax_total: scale(item.original_tax_total),
			discount_total: scale(item.discount_total),
		};
	});

	const item_subtotal = items.reduce(
		(sum, item) => sum + item.unit_price * item.quantity,
		0,
	);
	const item_total = items.reduce((sum, item) => sum + (item.total ?? 0), 0);
	const item_tax_total = items.reduce(
		(sum, item) => sum + (item.tax_total ?? 0),
		0,
	);

	return {
		...cart,
		items,
		item_subtotal,
		item_total,
		item_tax_total,
		original_item_subtotal: item_subtotal,
	} as StoreCart;
};

/**
 * Gère la mise à jour de la quantité d'une ligne du panier :
 *  - `applyOptimistic` : patch instantané du cache (nombre + total immédiats)
 *  - `persist` : mutation réseau (à débouncer côté appelant) qui réconcilie
 *    le panier avec la réponse serveur, ou refetch en cas d'erreur.
 */
export const useUpdateQuantityLineItem = () => {
	const queryClient = useQueryClient();

	const applyOptimistic = useCallback(
		(cartId: string, itemId: string, quantity: number) => {
			const queryKey = [CART_ITEMS_CART, cartId];
			const current = queryClient.getQueryData<StoreCart>(queryKey);
			if (current) {
				queryClient.setQueryData<StoreCart>(
					queryKey,
					buildOptimisticCart(current, itemId, quantity),
				);
			}
		},
		[queryClient],
	);

	const mutation = useMutation({
		mutationFn: async ({ cartId, itemId, quantity }: UpdateQuantityVars) => {
			const { cart } = await sdk.store.cart.updateLineItem(cartId, itemId, {
				quantity,
			});
			return cart;
		},
		// Réconciliation exacte sans refetch supplémentaire
		onSuccess: (cart, { cartId }) => {
			queryClient.setQueryData([CART_ITEMS_CART, cartId], cart);
		},
		// En cas d'échec, on récupère la vérité serveur (auto-correction)
		onError: (_error, { cartId }) => {
			queryClient.invalidateQueries({ queryKey: [CART_ITEMS_CART, cartId] });
		},
	});

	return { applyOptimistic, persist: mutation.mutate };
};
