"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

const ORDER_DETAIL_QUERY_KEY = "customer-order-detail";

const getOrderById = async (orderId: string) => {
	const { order } = await sdk.store.order.retrieve(orderId, {
		fields:
			"+items,+items.thumbnail,+items.product_title,+items.variant_title,+items.unit_price,+items.quantity,+shipping_address,+billing_address,+shipping_methods,+total,+subtotal,+shipping_total,+tax_total,+discount_total",
	});

	return order;
};

export const useGetOrderById = (orderId: string) => {
	return useQuery({
		queryKey: [ORDER_DETAIL_QUERY_KEY, orderId],
		queryFn: () => getOrderById(orderId),
		enabled: !!orderId,
	});
};
