"use client";

import type { Order } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import { Button, Checkbox, Field, Input, Textarea } from "@/components/ui/primitives";

/**
 * Remboursement total ou partiel (§2.4).
 *
 * Deux modes : par lignes — le cas courant d'un retour, qui permet de remettre
 * les articles en stock — ou par montant libre, pour un geste commercial qui
 * ne correspond à aucun article rendu.
 */
export const RefundDialog = ({
	order,
	open,
	onClose,
}: {
	order: Order;
	open: boolean;
	onClose: () => void;
}) => {
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [mode, setMode] = useState<"items" | "amount">("items");
	const [quantities, setQuantities] = useState<Record<string, number>>({});
	const [amount, setAmount] = useState("");
	const [reason, setReason] = useState("");
	const [restock, setRestock] = useState(true);

	const refundable = order.total - order.refundedTotal;

	const selectedTotal = order.items.reduce((total, item) => {
		const quantity = quantities[item.id] ?? 0;
		return total + item.unitPrice * quantity;
	}, 0);

	const refund = useMutation({
		mutationFn: () =>
			api.post<Order>(`/api/admin/orders/${order.id}/refund`, {
				reason: reason.trim(),
				restock,
				...(mode === "items"
					? {
							items: Object.entries(quantities)
								.filter(([, quantity]) => quantity > 0)
								.map(([orderItemId, quantity]) => ({ orderItemId, quantity })),
						}
					: { amount: Number(amount) }),
			}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["order", order.id] });
			void queryClient.invalidateQueries({ queryKey: ["orders"] });
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			notify("Remboursement enregistré.");
			onClose();
		},
		onError: (error) => notifyError(error, "Remboursement impossible."),
	});

	const canSubmit =
		reason.trim().length > 0 &&
		(mode === "items" ? selectedTotal > 0 : Number(amount) > 0 && Number(amount) <= refundable);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			title="Rembourser la commande"
			description={`Reste remboursable : ${formatMoney(refundable, order.currency)}.`}
			size="md"
			footer={
				<>
					<Button onClick={onClose}>Annuler</Button>
					<Button
						variant="danger"
						onClick={() => refund.mutate()}
						loading={refund.isPending}
						disabled={!canSubmit}
					>
						Rembourser{" "}
						{mode === "items"
							? formatMoney(selectedTotal, order.currency)
							: amount
								? formatMoney(Number(amount), order.currency)
								: ""}
					</Button>
				</>
			}
		>
			<div className="flex flex-col gap-4">
				<div className="grid grid-cols-2 gap-2">
					{(
						[
							{ key: "items" as const, label: "Par articles" },
							{ key: "amount" as const, label: "Montant libre" },
						]
					).map((option) => (
						<button
							key={option.key}
							type="button"
							onClick={() => setMode(option.key)}
							className={`rounded-md border px-3 py-2 text-[13px] transition-colors ${
								mode === option.key
									? "border-line-strong bg-accent-soft font-medium text-ink"
									: "border-line bg-raised text-muted hover:bg-accent-soft"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>

				{mode === "items" ? (
					<div className="flex flex-col gap-2">
						{order.items.map((item) => {
							const remaining = item.quantity - item.refundedQuantity;

							return (
								<div
									key={item.id}
									className="flex items-center gap-3 rounded-md border border-line bg-sunken px-3 py-2"
								>
									<div className="min-w-0 flex-1">
										<p className="truncate text-[13px] text-ink">{item.productName}</p>
										<p className="truncate text-[12px] text-subtle">
											{[item.variantName, item.sizeLabel].filter(Boolean).join(" · ")} ·{" "}
											{formatMoney(item.unitPrice, order.currency)}
										</p>
									</div>

									{remaining === 0 ? (
										<span className="text-[12px] text-subtle">Déjà remboursé</span>
									) : (
										<Input
											inputMode="numeric"
											value={String(quantities[item.id] ?? 0)}
											onChange={(event) => {
												// La quantité est bornée au restant : proposer plus
												// n'aboutirait qu'à un refus de l'API.
												const next = Math.max(
													0,
													Math.min(remaining, Number(event.target.value) || 0),
												);
												setQuantities({ ...quantities, [item.id]: next });
											}}
											className="w-16 text-center"
											aria-label={`Quantité à rembourser pour ${item.productName}`}
										/>
									)}

									<span className="w-8 shrink-0 text-right text-[12px] text-subtle tabular">
										/{remaining}
									</span>
								</div>
							);
						})}

						<Checkbox
							label="Remettre les articles remboursés en stock"
							checked={restock}
							onChange={(event) => setRestock(event.target.checked)}
						/>
					</div>
				) : (
					<Field label="Montant" required hint={`Maximum ${refundable}.`}>
						<Input
							autoFocus
							inputMode="numeric"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
						/>
					</Field>
				)}

				<Field label="Motif" required hint="Conservé dans l'historique de la commande.">
					<Textarea
						rows={2}
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder="Article retourné, taille non adaptée"
					/>
				</Field>
			</div>
		</Dialog>
	);
};
