"use client";

import { getOrderById } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const ORDER_DETAIL_QUERY_KEY = "customer-order-detail";

export const useGetOrderById = (orderId: string) => {
	return useQuery({
		queryKey: [ORDER_DETAIL_QUERY_KEY, orderId],
		queryFn: async () => getOrderById(orderId) ?? null,
		enabled: !!orderId,
	});
};
