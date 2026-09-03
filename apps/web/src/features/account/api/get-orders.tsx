"use client";

import { orders } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const ORDERS_QUERY_KEY = "customer-orders";

const getCustomerOrders = async () => {
	return { orders, count: orders.length };
};

export const useGetCustomerOrders = () => {
	return useQuery({
		queryKey: [ORDERS_QUERY_KEY],
		queryFn: getCustomerOrders,
	});
};
