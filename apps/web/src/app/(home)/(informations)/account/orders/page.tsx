"use client";

import { useGetCustomerOrders } from "@/features/account/api/get-orders";
import { OrderCard } from "@/features/account/components/order-card";
import { Button, Skeleton } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
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
	const t = useTranslations("Account.orders");

	const { data, isLoading, error } = useGetCustomerOrders();
	const orders = data?.orders ?? [];

	const mappedOrders = orders.map((order: any) => ({
		id: order.id,
		displayId: String(order.display_id),
		createdAt: order.created_at,
		status: mapFulfillmentStatus(order.status || "pending"),
		total: order.total ?? 0,
		currency: order.currency_code ?? "xof",
		items: (order.items || []).map((item: any) => ({
			id: item.id,
			title: item.product_title || t("product"),
			quantity: item.quantity,
			thumbnail: item.thumbnail || "/assets/placeholder.jpg",
		})),
	}));

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
				<div>
					<h2 className="text-[3.6rem]! sm:text-[4.4rem]!">
						{t("pageTitle")}
					</h2>
					<p className="mt-1 text-[1.5rem] text-(--color-surface-muted)">
						{t("pageSubtitle")}
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className="grid gap-4">
					{[1, 2].map((i) => (
						<Skeleton key={i} className="w-full h-60" />
					))}
				</div>
			) : error ? (
				<div className="p-6 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
					{t("loadError")}
				</div>
			) : mappedOrders.length > 0 ? (
				<div className="grid gap-4">
					{mappedOrders.map((order: any) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-(--color-surface-card)">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-white rounded-full">
						<OrderIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-[2.2rem]! font-normal! [font-family:var(--font-display)]!">{t("noOrderTitle")}</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-[1.45rem] text-(--color-surface-muted)">
						{t("noOrderDescription")}
					</p>
					<Link href="/products">
						<Button className="px-10 py-4 h-auto text-[1.35rem] font-semibold tracking-[0.1em] uppercase text-white rounded-none bg-(--color-ink) hover:bg-black">
							{t("startShopping")}
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
