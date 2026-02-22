"use client";

import { sdk } from "@/lib/api/sdk";
import { useQuery } from "@tanstack/react-query";

const ORDERS_QUERY_KEY = "customer-orders";

const getCustomerOrders = async () => {
	const { orders, count } = await sdk.store.order.list(
		{
			fields:
				"+items,+items.thumbnail,+items.product_title,+items.variant_title,+items.unit_price,+items.quantity,+shipping_address,+total,+subtotal,+shipping_total,+tax_total",
			order: "-created_at",
		},
	);

	return { orders, count };
};

export const useGetCustomerOrders = () => {
	return useQuery({
		queryKey: [ORDERS_QUERY_KEY],
		queryFn: getCustomerOrders,
	});
};
