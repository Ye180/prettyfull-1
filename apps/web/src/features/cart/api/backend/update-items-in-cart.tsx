// src/features/cart/api/update-items-in-cart.ts
import { useUserId } from "@/hooks/useUserId";
import client from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "../../../../../../../packages/store/src/use-cart-store";

export const useUpdateCartItem = () => {
	const queryClient = useQueryClient();
	const userId = useUserId();
	const { setCart } = useCartStore();

	return useMutation({
		mutationFn: async ({
			productId,
			quantity,
			selectedVariants,
		}: {
			productId: string;
			quantity: number;
			selectedVariants?: Record<string, string>;
		}) => {
			if (!userId) throw new Error("User ID manquant");

			// ✅ CORRECT : on envoie les variantes
			const { data } = await client.patch(
				`/carts/${userId}/items/${productId}`,
				{ quantity, selectedVariants },
			);

			return data;
		},

		onSuccess: (data) => {
			if (data?.items) setCart(data.items);
			queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, userId] });
		},

		onError: (error: any) => {
			console.error("Erreur lors de la mise à jour de l'article:", error);
		},
	});
};
