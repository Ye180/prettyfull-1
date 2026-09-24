"use client";

import { useGetCustomerOrders } from "@/features/account/api/get-orders";
import { OrderCard } from "@/features/account/components/order-card";
import { useRegionStore } from "@/stores/useRegion";
import { Button, Skeleton } from "@prettyfull/ui";
import Link from "next/link";
import { OrderIcon } from "../../../../../../../../packages/ui/src/icons/order.icon";

const mapFulfillmentStatus = (
	status: string,
): "pending" | "processing" | "shipped" | "delivered" | "cancelled" => {
	switch (status) {
		case "fulfilled":
		case "delivered":
			return "delivered";
		case "shipped":
		case "partially_shipped":
			return "shipped";
		case "canceled":
			return "cancelled";
		case "not_fulfilled":
			return "processing";
		default:
			return "pending";
	}
};

export default function OrdersPage() {
	const region = useRegionStore((state) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	const { data, isLoading, error } = useGetCustomerOrders();
	const orders = data?.orders ?? [];

	const mappedOrders = orders.map((order: any) => ({
		id: order.id,
		displayId: String(order.display_id),
		createdAt: order.created_at,
		status: mapFulfillmentStatus(order.status || "pending"),
		total: order.total ?? 0,
		currency,
		items: (order.items || []).map((item: any) => ({
			id: item.id,
			title: item.product_title || "Produit",
			quantity: item.quantity,
			thumbnail: item.thumbnail || "/assets/placeholder.jpg",
		})),
	}));

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						Mes commandes
					</h2>
					<p className="mt-1 text-gray-500">
						Suivez et gérez vos commandes récentes.
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="grid gap-6">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="w-full h-60 rounded-2xl" />
					))}
				</div>
			) : error ? (
				<div className="p-6 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
					Impossible de charger vos commandes. Veuillez réessayer.
				</div>
			) : mappedOrders.length > 0 ? (
				<div className="grid gap-6">
					{mappedOrders.map((order: any) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-50 rounded-full">
						<OrderIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900">Aucune commande pour le moment</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-gray-500">
						Vous n&apos;avez pas encore passé de commande. Découvrez nos
						dernières nouveautés et laissez-vous tenter !
					</p>
					<Link href="/products">
						<Button className="px-8 py-6 h-auto text-base text-white bg-black rounded-full hover:bg-gray-800">
							Commencer mes achats
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
