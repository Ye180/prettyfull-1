"use client";

import type { Order, Paginated } from "@prettyfull/contracts";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, toQueryString } from "@/lib/api";
import {
	ORDER_STATUS_LABELS,
	PAYMENT_STATUS_LABELS,
	formatDateTime,
	formatMoney,
} from "@/lib/format";
import { useDebounced, useListQuery } from "@/lib/use-list-query";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar, FilterSelect } from "@/components/ui/filters";
import { DataTable, Pagination, type Column } from "@/components/ui/table";
import { Badge, Button, Card, EmptyState, orderStatusTone } from "@/components/ui/primitives";

/** Module « Commandes » — liste filtrable (§4.4). */
const OrdersPage = () => {
	const router = useRouter();
	const list = useListQuery({ q: "", status: "", paymentStatus: "" });
	const debouncedSearch = useDebounced(list.filters.q);

	const params = { ...list.params, q: debouncedSearch };

	const { data, isLoading } = useQuery({
		queryKey: ["orders", params],
		queryFn: () => api.get<Paginated<Order>>(`/api/admin/orders${toQueryString(params)}`),
	});

	const columns: Column<Order>[] = [
		{
			key: "displayId",
			header: "N°",
			width: "1%",
			cell: (order) => (
				<span className="font-medium text-ink tabular">#{order.displayId}</span>
			),
		},
		{
			key: "customer",
			header: "Cliente",
			cell: (order) => (
				<div className="min-w-0">
					<p className="truncate text-ink">
						{order.shippingAddress.firstName} {order.shippingAddress.lastName}
					</p>
					<p className="truncate text-[12px] text-subtle">{order.email}</p>
				</div>
			),
		},
		{
			key: "date",
			header: "Date",
			hideOnMobile: true,
			cell: (order) => (
				<span className="whitespace-nowrap text-muted tabular">
					{formatDateTime(order.placedAt)}
				</span>
			),
		},
		{
			key: "items",
			header: "Articles",
			align: "right",
			hideOnMobile: true,
			cell: (order) => (
				<span className="text-muted">
					{order.items.reduce((total, item) => total + item.quantity, 0)}
				</span>
			),
		},
		{
			key: "payment",
			header: "Paiement",
			hideOnMobile: true,
			cell: (order) => (
				<Badge
					tone={
						order.paymentStatus === "paid"
							? "success"
							: order.paymentStatus === "pending"
								? "warning"
								: order.paymentStatus === "partially_refunded"
									? "info"
									: "danger"
					}
				>
					{PAYMENT_STATUS_LABELS[order.paymentStatus]}
				</Badge>
			),
		},
		{
			key: "status",
			header: "Statut",
			cell: (order) => (
				<Badge tone={orderStatusTone(order.status)}>
					{ORDER_STATUS_LABELS[order.status]}
				</Badge>
			),
		},
		{
			key: "total",
			header: "Total",
			align: "right",
			cell: (order) => (
				<div>
					<span className="font-medium text-ink">
						{formatMoney(order.total, order.currency)}
					</span>
					{order.refundedTotal > 0 && (
						<span className="block text-[12px] text-danger">
							− {formatMoney(order.refundedTotal, order.currency)}
						</span>
					)}
				</div>
			),
		},
	];

	return (
		<>
			<PageHeader
				title="Commandes"
				description="Suivi et traitement des commandes de la boutique."
			/>

			<Card>
				<FilterBar
					search={list.filters.q}
					onSearchChange={(value) => list.setFilter("q", value)}
					searchPlaceholder="N° de commande, e-mail, suivi…"
					onReset={list.reset}
					showReset={list.isFiltered}
				>
					<FilterSelect
						label="Statut"
						placeholder="Tous les statuts"
						value={list.filters.status}
						onChange={(value) => list.setFilter("status", value)}
						options={ORDER_STATUSES.map((value) => ({
							value,
							label: ORDER_STATUS_LABELS[value],
						}))}
					/>
					<FilterSelect
						label="Paiement"
						placeholder="Tous les paiements"
						value={list.filters.paymentStatus}
						onChange={(value) => list.setFilter("paymentStatus", value)}
						options={PAYMENT_STATUSES.map((value) => ({
							value,
							label: PAYMENT_STATUS_LABELS[value],
						}))}
					/>
				</FilterBar>

				<DataTable
					columns={columns}
					rows={data?.data ?? []}
					rowKey={(order) => order.id}
					loading={isLoading}
					onRowClick={(order) => router.push(`/commandes/${order.id}`)}
					empty={
						<EmptyState
							title={list.isFiltered ? "Aucune commande ne correspond" : "Aucune commande"}
							description={
								list.isFiltered
									? "Modifiez ou réinitialisez les filtres."
									: "Les commandes passées sur la boutique apparaîtront ici."
							}
							action={
								list.isFiltered ? (
									<Button size="sm" onClick={list.reset}>
										Réinitialiser
									</Button>
								) : undefined
							}
						/>
					}
				/>

				{data && <Pagination meta={data.meta} onChange={list.setPage} />}
			</Card>
		</>
	);
};

export default OrdersPage;
