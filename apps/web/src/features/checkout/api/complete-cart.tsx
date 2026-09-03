"use client";

import { createFakeOrder } from "@/lib/fake-data";
import { useCartStore } from "@prettyfull/store";
import { useMutation } from "@tanstack/react-query";
import { useCheckoutStore } from "../stores/use-checkout-store";

interface CompleteCartParams {
	cartId: string;
}

export const useCompleteCart = () => {
	return useMutation({
		mutationFn: async (_: CompleteCartParams) => {
			const { items, clearCart } = useCartStore.getState();
			const { shippingAddress } = useCheckoutStore.getState();

			const order = createFakeOrder({
				email: shippingAddress?.email ?? "guest@prettyfull.shop",
				shipping_address: {
					first_name: shippingAddress?.first_name ?? "",
					last_name: shippingAddress?.last_name ?? "",
					address_1: shippingAddress?.address_1 ?? "",
					city: shippingAddress?.city ?? "",
					postal_code: shippingAddress?.postal_code ?? "",
					country_code: shippingAddress?.country_code ?? "us",
					phone: shippingAddress?.phone,
				},
				items: items.map((item) => ({
					id: item.productId,
					thumbnail: item.product.image,
					product_title: item.product.name,
					variant_title: Object.values(item.selectedVariants || {}).join(" / ") || "Unique",
					unit_price: item.unitPrice?.amount ?? item.product.price?.amount ?? 0,
					quantity: item.quantity,
				})),
			});

			clearCart();
			return order;
		},
	});
};
