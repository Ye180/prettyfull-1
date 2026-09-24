"use client";

import { fetchOrders } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

const ORDERS_QUERY_KEY = "customer-orders";

/** Historique de commandes de la cliente connectée. */
export const useGetCustomerOrders = () =>
	useQuery({
		queryKey: [ORDERS_QUERY_KEY],
		queryFn: fetchOrders,
		// Session expirée : l'espace compte redirige, inutile d'insister.
		retry: false,
	});
