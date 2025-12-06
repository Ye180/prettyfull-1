"use client";

import { sdk } from "@/lib/api/sdk";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface AddressData {
	email: string;
	first_name: string;
	last_name: string;
	company?: string;
	address_1: string;
	address_2?: string;
	postal_code: string;
	city: string;
	province?: string;
	country_code: string;
	phone: string;
}

interface UpdateCartAddressParams {
	cartId: string;
	shippingAddress: AddressData;
	billingAddress?: AddressData;
}

const updateCartAddress = async ({
	cartId,
	shippingAddress,
	billingAddress,
}: UpdateCartAddressParams) => {
	const { cart } = await sdk.store.cart.update(cartId, {
		email: shippingAddress.email,
		shipping_address: {
			first_name: shippingAddress.first_name,
			last_name: shippingAddress.last_name,
			company: shippingAddress.company,
			address_1: shippingAddress.address_1,
			address_2: shippingAddress.address_2,
			postal_code: shippingAddress.postal_code,
			city: shippingAddress.city,
			province: shippingAddress.province,
			country_code: shippingAddress.country_code,
			phone: shippingAddress.phone,
		},
		billing_address: billingAddress
			? {
					first_name: billingAddress.first_name,
					last_name: billingAddress.last_name,
					company: billingAddress.company,
					address_1: billingAddress.address_1,
					address_2: billingAddress.address_2,
					postal_code: billingAddress.postal_code,
					city: billingAddress.city,
					province: billingAddress.province,
					country_code: billingAddress.country_code,
					phone: billingAddress.phone,
				}
			: {
					first_name: shippingAddress.first_name,
					last_name: shippingAddress.last_name,
					company: shippingAddress.company,
					address_1: shippingAddress.address_1,
					address_2: shippingAddress.address_2,
					postal_code: shippingAddress.postal_code,
					city: shippingAddress.city,
					province: shippingAddress.province,
					country_code: shippingAddress.country_code,
					phone: shippingAddress.phone,
				},
	});

	return cart;
};

export const useUpdateCartAddress = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateCartAddress,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: [CART_ITEMS_CART, variables.cartId],
			});
		},
	});
};
