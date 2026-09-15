"use client";

import type { Paginated, PromoCode } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Field,
	Input,
	Select,
	Spinner,
	Textarea,
} from "@/components/ui/primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";

/** Module « Codes promo » (§2.9, §4.7). */

interface PromoCodeDraft {
	id?: string;
	code: string;
	description: string;
	discountType: "percentage" | "fixed";
	discountValue: string;
	minOrderAmount: string;
	maxDiscountAmount: string;
	usageLimit: string;
	status: "active" | "inactive";
	startsAt: string;
	endsAt: string;
}

const emptyDraft = (): PromoCodeDraft => ({
	code: "",
	description: "",
	discountType: "percentage",
	discountValue: "",
	minOrderAmount: "",
	maxDiscountAmount: "",
	usageLimit: "",
	status: "active",
	startsAt: "",
	endsAt: "",
});

/** ISO (UTC, stocké) <-> valeur locale d'un `<input type="datetime-local">`. */
const isoToLocalInput = (iso: string | null): string => {
	if (!iso) return "";
	const date = new Date(iso);
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const localInputToIso = (value: string): string | null => (value ? new Date(value).toISOString() : null);

const formatDiscount = (promo: Pick<PromoCode, "discountType" | "discountValue">): string =>
	promo.discountType === "percentage" ? `${promo.discountValue}%` : `${promo.discountValue} FCFA`;

const formatUsage = (promo: Pick<PromoCode, "usageCount" | "usageLimit">): string =>
	promo.usageLimit != null ? `${promo.usageCount} / ${promo.usageLimit}` : `${promo.usageCount} (illimité)`;

const PromotionsPage = () => {
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const writable = can(PERMISSIONS.promotions.write);

	const [draft, setDraft] = useState<PromoCodeDraft | null>(null);
	const [toDelete, setToDelete] = useState<{ id: string; label: string } | null>(null);

	const { data: promoCodes, isLoading } = useQuery({
		queryKey: ["promo-codes"],
		queryFn: () => api.get<Paginated<PromoCode>>("/api/admin/promo-codes?limit=100"),
	});

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
	};

	const save = useMutation({
		mutationFn: () => {
			const payload = {
				code: draft!.code.trim(),
				description: draft!.description.trim() || null,
				discountType: draft!.discountType,
				discountValue: Number(draft!.discountValue) || 0,
				minOrderAmount: draft!.minOrderAmount.trim() ? Number(draft!.minOrderAmount) : null,
				maxDiscountAmount: draft!.maxDiscountAmount.trim()
					? Number(draft!.maxDiscountAmount)
					: null,
				usageLimit: draft!.usageLimit.trim() ? Number(draft!.usageLimit) : null,
				status: draft!.status,
				startsAt: localInputToIso(draft!.startsAt),
				endsAt: localInputToIso(draft!.endsAt),
			};

			return draft!.id
				? api.patch(`/api/admin/promo-codes/${draft!.id}`, payload)
				: api.post("/api/admin/promo-codes", payload);
		},
		onSuccess: () => {
			refresh();
			notify(draft?.id ? "Code promo mis à jour." : "Code promo créé.");
			setDraft(null);
		},
		onError: (error) => notifyError(error, "Enregistrement impossible."),
	});

	const remove = useMutation({
		mutationFn: () => api.delete(`/api/admin/promo-codes/${toDelete!.id}`),
		onSuccess: () => {
			refresh();
			notify("Code promo supprimé.");
			setToDelete(null);
		},
		onError: (error) => {
			notifyError(error, "Suppression impossible.");
			setToDelete(null);
		},
	});

	const isValid =
		!!draft?.code.trim() && Number(draft.discountValue) > 0 &&
		(draft.discountType !== "percentage" || Number(draft.discountValue) <= 100);

	return (
		<>
			<PageHeader
				title="Codes promo"
				description="Remises appliquées au panier storefront, en pourcentage ou en montant fixe."
			/>

			<Card>
				<CardHeader
					title="Codes"
					description="Un code n'est appliqué que s'il est actif et dans sa fenêtre de validité."
					action={
						writable && (
							<Button size="sm" variant="primary" onClick={() => setDraft(emptyDraft())}>
								<IconPlus width={14} height={14} />
								Code promo
							</Button>
						)
					}
				/>

				{isLoading ? (
					<Spinner />
				) : (promoCodes?.data ?? []).length === 0 ? (
					<p className="px-4 py-8 text-center text-[13px] text-muted">
						Aucun code promo pour l&apos;instant.
					</p>
				) : (
					<ul className="divide-y divide-[var(--border)]">
						{(promoCodes?.data ?? []).map((promo) => (
							<li key={promo.id} className="flex items-center gap-3 px-4 py-3">
								<div className="min-w-0 flex-1">
									<p className="truncate text-[13px] font-mono font-semibold tracking-wide text-ink">
										{promo.code}
									</p>
									<p className="truncate text-[12px] text-subtle">
										{promo.description || "Aucune description"}
										{" · "}
										{formatDiscount(promo)}
										{promo.minOrderAmount != null && ` · dès ${promo.minOrderAmount} FCFA`}
										{(promo.startsAt || promo.endsAt) &&
											` · ${promo.startsAt ? formatDateTime(promo.startsAt) : "…"} → ${
												promo.endsAt ? formatDateTime(promo.endsAt) : "…"
											}`}
									</p>
								</div>

								<Badge tone="neutral">{formatUsage(promo)}</Badge>

								<Badge tone={promo.status === "active" ? "success" : "neutral"}>
									{promo.status === "active" ? "Actif" : "Inactif"}
								</Badge>

								{writable && (
									<>
										<Button
											size="sm"
											variant="ghost"
											aria-label="Modifier"
											onClick={() =>
												setDraft({
													id: promo.id,
													code: promo.code,
													description: promo.description ?? "",
													discountType: promo.discountType,
													discountValue: String(promo.discountValue),
													minOrderAmount:
														promo.minOrderAmount != null ? String(promo.minOrderAmount) : "",
													maxDiscountAmount:
														promo.maxDiscountAmount != null
															? String(promo.maxDiscountAmount)
															: "",
													usageLimit: promo.usageLimit != null ? String(promo.usageLimit) : "",
													status: promo.status,
													startsAt: isoToLocalInput(promo.startsAt),
													endsAt: isoToLocalInput(promo.endsAt),
												})
											}
										>
											<IconEdit width={15} height={15} />
										</Button>
										<Button
											size="sm"
											variant="ghost"
											aria-label="Supprimer"
											onClick={() => setToDelete({ id: promo.id, label: promo.code })}
										>
											<IconTrash width={15} height={15} />
										</Button>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</Card>

			<Dialog
				open={draft !== null}
				onClose={() => setDraft(null)}
				title={draft?.id ? "Modifier le code promo" : "Nouveau code promo"}
				size="md"
				footer={
					<>
						<Button onClick={() => setDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => save.mutate()}
							loading={save.isPending}
							disabled={!isValid}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				{draft && (
					<div className="flex flex-col gap-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Code" required hint="Lettres, chiffres, tirets - converti en majuscules.">
								<Input
									autoFocus
									value={draft.code}
									onChange={(event) =>
										setDraft({ ...draft, code: event.target.value.toUpperCase() })
									}
									placeholder="SOLDES20"
								/>
							</Field>

							<Field label="Statut">
								<Select
									value={draft.status}
									onChange={(event) =>
										setDraft({ ...draft, status: event.target.value as PromoCodeDraft["status"] })
									}
									options={[
										{ value: "active", label: "Actif" },
										{ value: "inactive", label: "Inactif" },
									]}
								/>
							</Field>
						</div>

						<Field label="Description" hint="Usage interne, non affiché à la cliente.">
							<Textarea
								rows={2}
								value={draft.description}
								onChange={(event) => setDraft({ ...draft, description: event.target.value })}
							/>
						</Field>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Type de remise">
								<Select
									value={draft.discountType}
									onChange={(event) =>
										setDraft({
											...draft,
											discountType: event.target.value as PromoCodeDraft["discountType"],
										})
									}
									options={[
										{ value: "percentage", label: "Pourcentage" },
										{ value: "fixed", label: "Montant fixe" },
									]}
								/>
							</Field>

							<Field
								label={draft.discountType === "percentage" ? "Pourcentage (%)" : "Montant (FCFA)"}
								required
							>
								<Input
									type="number"
									min={1}
									max={draft.discountType === "percentage" ? 100 : undefined}
									value={draft.discountValue}
									onChange={(event) => setDraft({ ...draft, discountValue: event.target.value })}
								/>
							</Field>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field
								label="Sous-total minimum"
								hint="Laisser vide = pas de minimum."
							>
								<Input
									type="number"
									min={0}
									value={draft.minOrderAmount}
									onChange={(event) => setDraft({ ...draft, minOrderAmount: event.target.value })}
									placeholder="FCFA"
								/>
							</Field>

							<Field
								label="Plafond de la remise"
								hint="Utile surtout pour un pourcentage sans limite."
							>
								<Input
									type="number"
									min={0}
									value={draft.maxDiscountAmount}
									onChange={(event) =>
										setDraft({ ...draft, maxDiscountAmount: event.target.value })
									}
									placeholder="FCFA"
								/>
							</Field>
						</div>

						<Field label="Limite d'utilisations" hint="Laisser vide = illimité, tous clients confondus.">
							<Input
								type="number"
								min={1}
								value={draft.usageLimit}
								onChange={(event) => setDraft({ ...draft, usageLimit: event.target.value })}
							/>
						</Field>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Début de validité" hint="Laisser vide = actif dès l'enregistrement.">
								<Input
									type="datetime-local"
									value={draft.startsAt}
									onChange={(event) => setDraft({ ...draft, startsAt: event.target.value })}
								/>
							</Field>

							<Field label="Fin de validité" hint="Laisser vide = pas d'expiration.">
								<Input
									type="datetime-local"
									value={draft.endsAt}
									onChange={(event) => setDraft({ ...draft, endsAt: event.target.value })}
								/>
							</Field>
						</div>
					</div>
				)}
			</Dialog>

			<ConfirmDialog
				open={toDelete !== null}
				onClose={() => setToDelete(null)}
				onConfirm={() => remove.mutate()}
				loading={remove.isPending}
				title="Supprimer ce code promo ?"
				message={`« ${toDelete?.label} » sera définitivement supprimé. Les commandes déjà passées avec ce code conservent leur remise.`}
				confirmLabel="Supprimer"
			/>
		</>
	);
};

export default PromotionsPage;
