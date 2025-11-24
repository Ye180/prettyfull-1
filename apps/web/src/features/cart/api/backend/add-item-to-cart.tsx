import { useUserId } from "@/hooks/useUserId";
import client from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";

interface AddItemDto {
	productId: string;
	quantity: number;
	selectedVariants?: Record<string, string>;
}

export const useAddItemToCart = (): UseMutationResult<
	any,
	Error,
	AddItemDto
> => {
	const queryClient = useQueryClient();
	// On n'a plus besoin de setCart ici car l'invalidation s'en occupe
	// const { setCart } = useCartStore();
	const userId = useUserId();

	return useMutation({
		mutationFn: async (itemDto: AddItemDto) => {
			if (!userId) throw new Error("User ID not available");

			const { data } = await client.post(`/carts/${userId}/items`, itemDto);
			return data; // 'data' sera maintenant juste { success: true }
		},

		onSuccess: (data: any) => {
			// ⬇️⬇️⬇️ MODIFICATION ⬇️⬇️⬇️
			// Le backend ne renvoie plus le panier, donc on supprime cette logique
			// qui essayait de mettre à jour le store manuellement.
			/*
      if (data && data.items) {
				setCart(data.items);
			}
      */

			// On se contente d'invalider la query.
			// React Query va appeler 'get-cart-by-userid.tsx' automatiquement
			// pour rafraîchir le panier.
			queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, userId] });
		},
	});
};
