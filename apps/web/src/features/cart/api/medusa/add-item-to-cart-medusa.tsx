import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import {
	useMutation,
	UseMutationResult,
	useQueryClient,
} from "@tanstack/react-query";

interface AddItemDto {
	cartId: string;
	quantity: number;
	variant_id: string;
}

export const useAddItemToCartMedusa = (): UseMutationResult<
	any,
	Error,
	AddItemDto
> => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (itemDto: AddItemDto) => {
			await sdk.store.cart
				.createLineItem(itemDto.cartId, {
					variant_id: itemDto.variant_id,
					quantity: itemDto.quantity,
				})
				.then(({ cart }) => {
					// Utiliser le panier mis à jour
					alert(cart);
				});
		},

		onSuccess: (data: any) => {
			queryClient.invalidateQueries({ queryKey: [CART_ITEMS_CART] });
		},
	});
};
