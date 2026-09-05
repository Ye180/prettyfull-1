"use client";

import type { Order, Paginated, User } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { ORDER_STATUS_LABELS, formatDate, formatDateTime, formatMoney } from "@/lib/format";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable, type Column } from "@/components/ui/table";
import {
	Badge,
	Card,
	CardHeader,
	ErrorState,
	Spinner,
	orderStatusTone,
} from "@/components/ui/primitives";

/** Fiche cliente : coordonnées et historique d'achats (§4.5). */
const CustomerDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();

	const { data: customer, isLoading, error, refetch } = useQuery({
		queryKey: ["customer", id],
		queryFn: () => api.get<User>(`/api/admin/customers/${id}`),
	});

	const { data: orders } = useQuery({
		queryKey: ["orders", { userId: id }],
		queryFn: () => api.get<Paginated<Order>>(`/api/admin/orders?userId=${id}&limit=50`),
		// Inutile de charger les commandes tant que la cliente n'est pas résolue.
		enabled: Boolean(customer),
	});

	if (isLoading || !customer) {
		return error ? (
			<Card>
				<ErrorState
					message={error instanceof Error ? error.message : "Cliente introuvable."}
					retry={() => void refetch()}
				/>
			</Card>
		) : (
			<Spinner label="Chargement de la fiche…" />
		);
	}

	const rows = orders?.data ?? [];

	// Le chiffre d'affaires réel exclut ce qui a été remboursé.
	const spent = rows
		.filter((order) => order.paymentStatus === "paid" || order.paymentStatus === "partially_refunded")
		.reduce((total, order) => total + order.total - order.refundedTotal, 0);

	const currency = rows[0]?.currency ?? "xof";

	const columns: Column<Order>[] = [
		{
			key: "displayId",
			header: "N°",
			cell: (order) => <span className="text-ink tabular">#{order.displayId}</span>,
		},
		{
			key: "date",
			header: "Date",
			cell: (order) => (
				<span className="whitespace-nowrap text-muted tabular">
					{formatDateTime(order.placedAt)}
				</span>
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
				<span className="font-medium text-ink">
					{formatMoney(order.total, order.currency)}
				</span>
			),
		},
	];

	return (
		<>
			<PageHeader
				title={`${customer.firstName} ${customer.lastName}`}
				description={customer.email}
				backHref="/clients"
				backLabel="Clients"
				actions={
					<Badge tone={customer.status === "active" ? "success" : "neutral"}>
						{customer.status === "active" ? "Compte actif" : "Compte désactivé"}
					</Badge>
				}
			/>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="p-4">
					<p className="text-[12px] text-muted">Commandes</p>
					<p className="mt-1 text-2xl font-semibold text-ink">{rows.length}</p>
				</Card>
				<Card className="p-4">
					<p className="text-[12px] text-muted">Total dépensé</p>
					<p className="mt-1 text-2xl font-semibold text-ink">
						{formatMoney(spent, currency)}
					</p>
				</Card>
				<Card className="p-4">
					<p className="text-[12px] text-muted">Inscrite le</p>
					<p className="mt-1 text-2xl font-semibold text-ink">
						{formatDate(customer.createdAt)}
					</p>
				</Card>
			</div>

			<Card className="mt-4">
				<CardHeader title="Coordonnées" />
				<div className="space-y-1 px-4 py-3 text-[13px]">
					<p className="text-muted">{customer.email}</p>
					{customer.phone && <p className="text-muted">{customer.phone}</p>}
					<p className="text-subtle">
						Dernière connexion :{" "}
						{customer.lastLoginAt ? formatDateTime(customer.lastLoginAt) : "jamais"}
					</p>
				</div>
			</Card>

			<Card className="mt-4">
				<CardHeader title="Historique d'achats" />
				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(order) => order.id}
					onRowClick={(order) => router.push(`/commandes/${order.id}`)}
					empty={
						<p className="px-4 py-8 text-center text-[13px] text-muted">
							Cette cliente n’a encore passé aucune commande.
						</p>
					}
				/>
			</Card>
		</>
	);
};

export default CustomerDetailPage;
