"use client";

import { useMutation } from "@tanstack/react-query";

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

export const useUpdateCartAddress = () => {
	return useMutation({
		mutationFn: async ({ shippingAddress }: UpdateCartAddressParams) => {
			return { shipping_address: shippingAddress };
		},
	});
};
