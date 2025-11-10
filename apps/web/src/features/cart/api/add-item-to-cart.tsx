import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";
import client from "@/shared/lib/client";
import { CART_QUERY_KEY } from "@/shared/utils/query-keys";
import { useUserId } from "@/hooks/useUserId"; // <-- 1. IMPORTER LE NOUVEAU HOOK
import { useCartStore } from "../../../../../../packages/store/src/use-cart-store";

interface AddItemDto {
	productId: string;
	quantity: number;
	selectedVariants?: Record<string, string>;
}

// 2. SUPPRIMER 'useAuth', 'GUEST_ID_STORAGE_KEY' et la fonction 'getUserId' locale

export const useAddItemToCart = (): UseMutationResult<
	any,
	Error,
	AddItemDto
> => {
	const queryClient = useQueryClient();
	const { setCart } = useCartStore();
	const userId = useUserId(); // <-- 3. UTILISER LE NOUVEAU HOOK

	return useMutation({
		mutationFn: async (itemDto: AddItemDto) => {
			if (!userId) throw new Error("User ID not available"); // Sécurité

			const { data } = await client.post(`/carts/${userId}/items`, itemDto);
			return data;
		},

		onSuccess: (data: any) => {
			if (data && data.items) {
				setCart(data.items);
			}
			// Invalider la query avec la clé exacte
			queryClient.invalidateQueries({ queryKey: [CART_QUERY_KEY, userId] });
		},
	});
};