import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

const getCartItems = async (cartId: string) => {
	const { cart } = await sdk.store.cart.retrieve(cartId);
	return cart;
};

export const useGetItemsCart = (cartId: string) => {
	return useQuery({
		queryKey: [CART_ITEMS_CART, cartId],
		queryFn: () => getCartItems(cartId),
		enabled: !!cartId,
	});
};
