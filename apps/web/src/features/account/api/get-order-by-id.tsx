"use client";

import { fetchOrderById } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

const ORDER_DETAIL_QUERY_KEY = "customer-order-detail";

export const useGetOrderById = (orderId: string) =>
	useQuery({
		queryKey: [ORDER_DETAIL_QUERY_KEY, orderId],
		// L'API vérifie que la commande appartient bien à la cliente : une
		// commande d'autrui répond 404, jamais son contenu.
		queryFn: () => fetchOrderById(orderId).catch(() => null),
		enabled: !!orderId,
		retry: false,
	});
