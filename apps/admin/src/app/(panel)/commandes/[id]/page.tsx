"use client";

import type { Order, OrderStatus } from "@prettyfull/contracts";
import { ORDER_STATUS_TRANSITIONS, PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { api, getAccessToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
	ORDER_STATUS_LABELS,
	PAYMENT_STATUS_LABELS,
	formatDateTime,
	formatMoney,
} from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Thumb } from "@/components/ui/table";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	ErrorState,
	Field,
	Input,
	Spinner,
	orderStatusTone,
} from "@/components/ui/primitives";
import { IconDownload } from "@/components/icons";
import { RefundDialog } from "@/features/commandes/refund-dialog";

/**
 * Détail d'une commande (§4.4).
 *
 * Les transitions proposées viennent du graphe des contrats : le panel
 * n'affiche que ce que l'API accepterait, plutôt que de laisser cliquer sur un
 * bouton qui reviendra en erreur.
 */
const OrderDetailPage = () => {
	const { id } = useParams<{ id: string }>();
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();

	const [refundOpen, setRefundOpen] = useState(false);
	const [confirmCancel, setConfirmCancel] = useState(false);
	const [tracking, setTracking] = useState<string | null>(null);

	const { data: order, isLoading, error, refetch } = useQuery({
		queryKey: ["order", id],
		queryFn: () => api.get<Order>(`/api/admin/orders/${id}`),
	});

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["order", id] });
		void queryClient.invalidateQueries({ queryKey: ["orders"] });
	};

	const changeStatus = useMutation({
		mutationFn: (status: OrderStatus) =>
			api.patch<Order>(`/api/admin/orders/${id}/status`, { status }),
		onSuccess: (updated) => {
			refresh();
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			notify(`Commande passée en « ${ORDER_STATUS_LABELS[updated.status]} ».`);
		},
		onError: (caught) => notifyError(caught, "Changement de statut impossible."),
	});

	const markPaid = useMutation({
		mutationFn: () => api.post<Order>(`/api/admin/orders/${id}/mark-paid`, {}),
		onSuccess: () => {
			refresh();
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			notify("Encaissement confirmé, stock décrémenté.");
		},
		onError: (caught) => notifyError(caught, "Confirmation impossible."),
	});

	const saveTracking = useMutation({
		mutationFn: () =>
			api.patch<Order>(`/api/admin/orders/${id}/fulfillment`, {
				trackingNumber: tracking?.trim() || null,
			}),
		onSuccess: () => {
			refresh();
			setTracking(null);
			notify("Numéro de suivi enregistré.");
		},
		onError: (caught) => notifyError(caught, "Enregistrement impossible."),
	});

	/**
	 * Facture : récupérée avec le jeton puis ouverte dans un onglet.
	 * Un lien direct vers l'API n'emporterait pas l'en-tête d'autorisation.
	 */
	const openInvoice = useMutation({
		mutationFn: async () => {
			const response = await fetch(
				`${api.baseUrl}/api/admin/orders/${id}/invoice`,
				{ headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` } },
			);
			if (!response.ok) throw new Error("Facture indisponible.");
			return response.text();
		},
		onSuccess: (html) => {
			const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
			window.open(url, "_blank", "noopener");
			// Révocation différée : révoquer tout de suite couperait le chargement
			// de l'onglet qui vient de s'ouvrir.
			setTimeout(() => URL.revokeObjectURL(url), 60_000);
		},
		onError: (caught) => notifyError(caught, "Facture indisponible."),
	});

	if (isLoading || !order) {
		return error ? (
			<Card>
				<ErrorState
					message={error instanceof Error ? error.message : "Commande introuvable."}
					retry={() => void refetch()}
				/>
			</Card>
		) : (
			<Spinner label="Chargement de la commande…" />
		);
	}

	const writable = can(PERMISSIONS.orders.write);
	const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status].filter(
		(status) => status !== "cancelled" && status !== "refunded",
	);

	const address = order.shippingAddress;

	return (
		<>
			<PageHeader
				title={`Commande #${order.displayId}`}
				description={`Passée le ${formatDateTime(order.placedAt)} · ${order.email}`}
				backHref="/commandes"
				backLabel="Commandes"
				actions={
					<>
						<Badge tone={orderStatusTone(order.status)}>
							{ORDER_STATUS_LABELS[order.status]}
						</Badge>

						<Button onClick={() => openInvoice.mutate()} loading={openInvoice.isPending}>
							<IconDownload width={16} height={16} />
							Facture
						</Button>

						{writable && order.paymentStatus === "pending" && (
							<Button variant="primary" onClick={() => markPaid.mutate()} loading={markPaid.isPending}>
								Marquer payée
							</Button>
						)}

						{writable &&
							nextStatuses.map((status) => (
								<Button
									key={status}
									variant="primary"
									onClick={() => changeStatus.mutate(status)}
									loading={changeStatus.isPending && changeStatus.variables === status}
								>
									{ORDER_STATUS_LABELS[status]}
								</Button>
							))}

						{can(PERMISSIONS.orders.refund) &&
							(order.paymentStatus === "paid" ||
								order.paymentStatus === "partially_refunded") && (
								<Button variant="danger" onClick={() => setRefundOpen(true)}>
									Rembourser
								</Button>
							)}

						{writable && ORDER_STATUS_TRANSITIONS[order.status].includes("cancelled") && (
							<Button variant="danger" onClick={() => setConfirmCancel(true)}>
								Annuler
							</Button>
						)}
					</>
				}
			/>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="flex flex-col gap-4 lg:col-span-2">
					<Card>
						<CardHeader
							title="Articles"
							description="Libellés et prix figés au moment de l'achat."
						/>
						<ul className="divide-y divide-[var(--border)]">
							{order.items.map((item) => (
								<li key={item.id} className="flex items-center gap-3 px-4 py-3">
									<Thumb src={item.thumbnail} alt={item.productName} />
									<div className="min-w-0 flex-1">
										<p className="truncate text-[13px] font-medium text-ink">
											{item.productName}
										</p>
										<p className="truncate text-[12px] text-subtle">
											{[item.variantName, item.sizeLabel].filter(Boolean).join(" · ")}
											{item.sku && ` · ${item.sku}`}
										</p>
										{item.refundedQuantity > 0 && (
											<p className="text-[12px] text-danger">
												{item.refundedQuantity} remboursé(s)
											</p>
										)}
									</div>
									<span className="shrink-0 text-[13px] text-muted tabular">
										{formatMoney(item.unitPrice, order.currency)} × {item.quantity}
									</span>
									<span className="w-24 shrink-0 text-right text-[13px] font-medium text-ink tabular">
										{formatMoney(item.lineTotal, order.currency)}
									</span>
								</li>
							))}
						</ul>

						<div className="space-y-1.5 border-t border-line px-4 py-3 text-[13px]">
							<div className="flex justify-between text-muted">
								<span>Sous-total</span>
								<span className="tabular">{formatMoney(order.subtotal, order.currency)}</span>
							</div>
							<div className="flex justify-between text-muted">
								<span>{order.shippingMethod?.name ?? "Livraison"}</span>
								<span className="tabular">
									{formatMoney(order.shippingTotal, order.currency)}
								</span>
							</div>
							{order.taxTotal > 0 && (
								<div className="flex justify-between text-muted">
									<span>Taxes</span>
									<span className="tabular">{formatMoney(order.taxTotal, order.currency)}</span>
								</div>
							)}
							<div className="flex justify-between border-t border-line pt-1.5 font-semibold text-ink">
								<span>Total</span>
								<span className="tabular">{formatMoney(order.total, order.currency)}</span>
							</div>
							{order.refundedTotal > 0 && (
								<div className="flex justify-between text-danger">
									<span>Remboursé</span>
									<span className="tabular">
										− {formatMoney(order.refundedTotal, order.currency)}
									</span>
								</div>
							)}
						</div>
					</Card>

					<Card>
						<CardHeader title="Historique" description="Chaque changement de statut, daté et signé." />
						<ul className="divide-y divide-[var(--border)]">
							{(order.statusHistory ?? []).map((entry) => (
								<li key={entry.id} className="flex items-start gap-3 px-4 py-2.5">
									<span className="w-36 shrink-0 text-[12px] text-subtle tabular">
										{formatDateTime(entry.createdAt)}
									</span>
									<span className="min-w-0 flex-1">
										<span className="text-[13px] text-ink">
											{entry.fromStatus
												? `${ORDER_STATUS_LABELS[entry.fromStatus]} → ${ORDER_STATUS_LABELS[entry.toStatus]}`
												: ORDER_STATUS_LABELS[entry.toStatus]}
										</span>
										{entry.comment && (
											<span className="block text-[12px] text-muted">{entry.comment}</span>
										)}
									</span>
									{entry.userName && (
										<span className="shrink-0 text-[12px] text-subtle">{entry.userName}</span>
									)}
								</li>
							))}
						</ul>
					</Card>

					{(order.transactions ?? []).length > 0 && (
						<Card>
							<CardHeader title="Transactions" />
							<ul className="divide-y divide-[var(--border)]">
								{(order.transactions ?? []).map((transaction) => (
									<li
										key={transaction.id}
										className="flex items-center gap-3 px-4 py-2.5 text-[13px]"
									>
										<span className="w-36 shrink-0 text-[12px] text-subtle tabular">
											{formatDateTime(transaction.createdAt)}
										</span>
										<span className="flex-1 text-ink">
											{transaction.providerKey} ·{" "}
											{transaction.kind === "refund" ? "Remboursement" : "Paiement"}
										</span>
										<Badge
											tone={
												transaction.status === "success"
													? "success"
													: transaction.status === "pending"
														? "warning"
														: "danger"
											}
										>
											{transaction.status}
										</Badge>
										<span className="w-24 shrink-0 text-right tabular">
											{formatMoney(transaction.amount, transaction.currency)}
										</span>
									</li>
								))}
							</ul>
						</Card>
					)}
				</div>

				<div className="flex flex-col gap-4">
					<Card>
						<CardHeader title="Cliente" />
						<div className="space-y-1 px-4 py-3 text-[13px]">
							<p className="font-medium text-ink">
								{address.firstName} {address.lastName}
							</p>
							<p className="text-muted">{order.email}</p>
							{order.phone && <p className="text-muted">{order.phone}</p>}
						</div>
					</Card>

					<Card>
						<CardHeader title="Livraison" />
						<div className="space-y-1 px-4 py-3 text-[13px] text-muted">
							<p>{address.address1}</p>
							{address.address2 && <p>{address.address2}</p>}
							<p>
								{address.postalCode} {address.city}
							</p>
							<p>{address.countryCode?.toUpperCase()}</p>

							<div className="border-t border-line pt-2">
								<p className="text-ink">{order.shippingMethod?.name ?? "—"}</p>
								<Badge tone="neutral" className="mt-1">
									{PAYMENT_STATUS_LABELS[order.paymentStatus]}
								</Badge>
							</div>
						</div>

						{writable && (
							<div className="border-t border-line px-4 py-3">
								<Field label="Numéro de suivi">
									<div className="flex gap-2">
										<Input
											value={tracking ?? order.trackingNumber ?? ""}
											onChange={(event) => setTracking(event.target.value)}
											placeholder="PF-CI-004921"
										/>
										<Button
											onClick={() => saveTracking.mutate()}
											loading={saveTracking.isPending}
											disabled={tracking === null}
										>
											Enregistrer
										</Button>
									</div>
								</Field>
							</div>
						)}
					</Card>

					{order.note && (
						<Card>
							<CardHeader title="Note de la cliente" />
							<p className="px-4 py-3 text-[13px] text-muted">{order.note}</p>
						</Card>
					)}
				</div>
			</div>

			<RefundDialog order={order} open={refundOpen} onClose={() => setRefundOpen(false)} />

			<ConfirmDialog
				open={confirmCancel}
				onClose={() => setConfirmCancel(false)}
				onConfirm={() => {
					changeStatus.mutate("cancelled");
					setConfirmCancel(false);
				}}
				title="Annuler cette commande ?"
				message="Le stock réservé sera libéré, et les articles déjà décrémentés remis en stock. L'opération est définitive."
				confirmLabel="Annuler la commande"
			/>
		</>
	);
};

export default OrderDetailPage;
