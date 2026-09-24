"use client";

import type { InventoryRow } from "@prettyfull/contracts";
import { MANUAL_STOCK_REASONS } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { STOCK_REASON_LABELS } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import {
	Button,
	Field,
	Input,
	Select,
	Textarea,
} from "@/components/ui/primitives";

/**
 * Ajustement manuel de stock (§2.3).
 *
 * Le motif est un champ obligatoire du formulaire, sans valeur par défaut
 * plausible : c'est ce qui fait qu'un mouvement arrive au journal avec une
 * raison exploitable, et non un « correction » posé machinalement.
 *
 * Deux modes, parce que les deux gestes du terrain diffèrent : ajouter ou
 * retirer un écart connu (réception, casse), ou fixer la quantité constatée
 * lors d'un inventaire physique.
 */
export const AdjustStockDialog = ({
	row,
	onClose,
}: {
	row: InventoryRow | null;
	onClose: () => void;
}) => {
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [mode, setMode] = useState<"delta" | "absolute">("delta");
	const [delta, setDelta] = useState("");
	const [absolute, setAbsolute] = useState("");
	const [reason, setReason] = useState<string>("");
	const [note, setNote] = useState("");

	const reset = () => {
		setMode("delta");
		setDelta("");
		setAbsolute("");
		setReason("");
		setNote("");
	};

	const close = () => {
		reset();
		onClose();
	};

	const apply = useMutation({
		mutationFn: () =>
			mode === "delta"
				? api.post("/api/admin/inventory/adjust", {
						inventoryItemId: row!.id,
						delta: Number(delta),
						reason,
						note: note.trim() || undefined,
					})
				: api.post("/api/admin/inventory/set", {
						inventoryItemId: row!.id,
						quantity: Number(absolute),
						reason,
						note: note.trim() || undefined,
					}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ["inventory"] });
			void queryClient.invalidateQueries({ queryKey: ["movements"] });
			void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
			notify("Stock ajusté et historisé.");
			close();
		},
		// L'API refuse un retrait supérieur au stock ou empiétant sur les
		// réservations : son message porte le disponible réel.
		onError: (error) => notifyError(error, "Ajustement impossible."),
	});

	const deltaValue = Number(delta);
	const canSubmit =
		Boolean(reason) &&
		(mode === "delta"
			? Number.isFinite(deltaValue) && deltaValue !== 0
			: absolute !== "" && Number.isFinite(Number(absolute)));

	const projected =
		row && mode === "delta" && Number.isFinite(deltaValue)
			? row.quantity + deltaValue
			: row && mode === "absolute" && absolute !== ""
				? Number(absolute)
				: null;

	return (
		<Dialog
			open={row !== null}
			onClose={close}
			title="Ajuster le stock"
			description={
				row
					? [row.productName, row.variantName, row.sizeLabel]
							.filter(Boolean)
							.join(" · ")
					: undefined
			}
			footer={
				<>
					<Button onClick={close}>Annuler</Button>
					<Button
						variant="primary"
						onClick={() => apply.mutate()}
						loading={apply.isPending}
						disabled={!canSubmit}
					>
						Appliquer
					</Button>
				</>
			}
		>
			{row && (
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-3 gap-3 rounded-md border border-line bg-sunken p-3 text-center">
						<div>
							<p className="text-[12px] text-subtle">En stock</p>
							<p className="text-lg font-semibold text-ink tabular">
								{row.quantity}
							</p>
						</div>
						<div>
							<p className="text-[12px] text-subtle">Réservé</p>
							<p className="text-lg font-semibold text-ink tabular">
								{row.reservedQuantity}
							</p>
						</div>
						<div>
							<p className="text-[12px] text-subtle">Disponible</p>
							<p className="text-lg font-semibold text-ink tabular">
								{row.availableQuantity}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-2">
						{[
							{ key: "delta" as const, label: "Ajouter / retirer" },
							{ key: "absolute" as const, label: "Fixer la quantité" },
						].map((option) => (
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

					{mode === "delta" ? (
						<Field
							label="Variation"
							required
							hint="Positif pour une entrée, négatif pour une sortie. Ex. -3 pour une casse."
						>
							<Input
								autoFocus
								inputMode="numeric"
								value={delta}
								onChange={(event) => setDelta(event.target.value)}
								placeholder="+25"
							/>
						</Field>
					) : (
						<Field label="Quantité constatée" required>
							<Input
								autoFocus
								inputMode="numeric"
								value={absolute}
								onChange={(event) => setAbsolute(event.target.value)}
								placeholder="42"
							/>
						</Field>
					)}

					<Field
						label="Motif"
						required
						hint="Obligatoire : il apparaît au journal des mouvements avec votre nom."
					>
						<Select
							value={reason}
							onChange={(event) => setReason(event.target.value)}
							placeholder="Choisir un motif…"
							options={MANUAL_STOCK_REASONS.map((value) => ({
								value,
								label: STOCK_REASON_LABELS[value] ?? value,
							}))}
						/>
					</Field>

					<Field
						label="Note"
						hint="Facultative - numéro de bon de livraison, précision."
					>
						<Textarea
							rows={2}
							value={note}
							onChange={(event) => setNote(event.target.value)}
							placeholder="Réception commande fournisseur n°412"
						/>
					</Field>

					{projected !== null && (
						<p className="text-[13px] text-muted">
							Stock après opération :{" "}
							<span className="font-medium text-ink tabular">
								{Math.max(0, projected)}
							</span>
							{projected < 0 && (
								<span className="ml-1.5 text-danger">
									- retrait supérieur au stock, l’opération sera refusée.
								</span>
							)}
						</p>
					)}
				</div>
			)}
		</Dialog>
	);
};
