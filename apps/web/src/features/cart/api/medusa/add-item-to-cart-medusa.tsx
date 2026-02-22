import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useRegionStore } from "@/stores/useRegion";
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

async function getOrCreateCartId(regionId?: string): Promise<string> {
	const existingCartId = localStorage.getItem("cart_id");
	if (existingCartId) return existingCartId;

	const { cart } = await sdk.store.cart.create({
		region_id: regionId,
	});

	localStorage.setItem("cart_id", cart.id);
	window.dispatchEvent(new Event("cart_id_updated"));
	return cart.id;
}

export const useAddItemToCartMedusa = (): UseMutationResult<
	any,
	Error,
	AddItemDto
> => {
	const queryClient = useQueryClient();
	const region = useRegionStore((state) => state.region);

	return useMutation({
		mutationFn: async (itemDto: AddItemDto) => {
			const cartId = await getOrCreateCartId(region?.id);

			const { cart } = await sdk.store.cart.createLineItem(cartId, {
				variant_id: itemDto.variant_id,
				quantity: itemDto.quantity,
			});

			return cart;
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [CART_ITEMS_CART] });
		},
	});
};
