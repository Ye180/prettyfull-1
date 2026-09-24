"use client";

import { UPLOAD_ENDPOINTS, type Product } from "@prettyfull/contracts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/toast";
import { Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	Card,
	CardHeader,
	Field,
	Input,
	stockStatusTone,
} from "@/components/ui/primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";
import { ImageUploadList } from "@/components/ui/image-upload";

/**
 * Gestion incrémentale des variantes et des tailles d'un produit existant.
 *
 * L'écran s'adapte au régime du produit (§2.2) : un produit simple ne propose
 * jamais d'ajouter une variante, un produit à variantes n'expose de tailles
 * qu'au niveau des coloris. La règle est donc rendue impossible à enfreindre
 * depuis l'interface, en plus d'être refusée par l'API.
 */
export const VariantManager = ({
	product,
	disabled,
}: {
	product: Product;
	disabled: boolean;
}) => {
	const queryClient = useQueryClient();
	const { notify, notifyError } = useToast();

	const [variantDialog, setVariantDialog] = useState(false);
	const [editDialog, setEditDialog] = useState<{ variantId: string } | null>(null);
	const [sizeDialog, setSizeDialog] = useState<{ variantId: string | null } | null>(null);

	const [variantDraft, setVariantDraft] = useState({
		name: "",
		colorHex: "#111111",
		quantity: "0",
		imageUrls: [] as string[],
	});
	const [editDraft, setEditDraft] = useState({
		name: "",
		colorHex: "#111111",
		imageUrls: [] as string[],
	});
	const [sizeDraft, setSizeDraft] = useState({ label: "", quantity: "0" });

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["product", product.id] });
		void queryClient.invalidateQueries({ queryKey: ["products"] });
	};

	const addVariant = useMutation({
		mutationFn: () =>
			api.post(`/api/admin/products/${product.id}/variants`, {
				name: variantDraft.name.trim(),
				colorHex: variantDraft.colorHex,
				initialQuantity: Number(variantDraft.quantity) || 0,
				images: variantDraft.imageUrls
					.map((url) => url.trim())
					.filter(Boolean)
					.map((url, position) => ({ url, position })),
			}),
		onSuccess: () => {
			refresh();
			setVariantDialog(false);
			setVariantDraft({ name: "", colorHex: "#111111", quantity: "0", imageUrls: [] });
			notify("Variante ajoutée.");
		},
		onError: (error) => notifyError(error, "Ajout impossible."),
	});

	const openEdit = (variant: Product["variants"][number]) => {
		setEditDraft({
			name: variant.name,
			colorHex: variant.colorHex ?? "#111111",
			imageUrls: [...variant.images]
				.sort((a, b) => a.position - b.position)
				.map((image) => image.url),
		});
		setEditDialog({ variantId: variant.id });
	};

	const updateVariant = useMutation({
		mutationFn: () =>
			api.patch(`/api/admin/products/${product.id}/variants/${editDialog?.variantId}`, {
				name: editDraft.name.trim(),
				colorHex: editDraft.colorHex,
				images: editDraft.imageUrls
					.map((url) => url.trim())
					.filter(Boolean)
					.map((url, position) => ({ url, position })),
			}),
		onSuccess: () => {
			refresh();
			setEditDialog(null);
			notify("Variante mise à jour.");
		},
		onError: (error) => notifyError(error, "Mise à jour impossible."),
	});

	const removeVariant = useMutation({
		mutationFn: (variantId: string) =>
			api.delete(`/api/admin/products/${product.id}/variants/${variantId}`),
		onSuccess: () => {
			refresh();
			notify("Variante retirée.");
		},
		onError: (error) => notifyError(error, "Suppression impossible."),
	});

	const addSize = useMutation({
		mutationFn: () =>
			api.post(`/api/admin/products/${product.id}/sizes`, {
				label: sizeDraft.label.trim(),
				variantId: sizeDialog?.variantId ?? null,
				initialQuantity: Number(sizeDraft.quantity) || 0,
			}),
		onSuccess: () => {
			refresh();
			setSizeDialog(null);
			setSizeDraft({ label: "", quantity: "0" });
			notify("Taille ajoutée.");
		},
		onError: (error) => notifyError(error, "Ajout impossible."),
	});

	const removeSize = useMutation({
		mutationFn: (sizeId: string) =>
			api.delete(`/api/admin/products/${product.id}/sizes/${sizeId}`),
		onSuccess: () => {
			refresh();
			notify("Taille retirée.");
		},
		onError: (error) => notifyError(error, "Suppression impossible."),
	});

	return (
		<>
			<Card>
				<CardHeader
					title={product.kind === "variant" ? "Variantes de couleur" : "Tailles"}
					description={
						product.kind === "variant"
							? "Chaque coloris porte sa galerie, ses tailles et son stock."
							: "Les tailles de ce produit simple. Sans aucune taille, le stock est porté par le produit."
					}
					action={
						!disabled &&
						(product.kind === "variant" ? (
							<Button size="sm" onClick={() => setVariantDialog(true)}>
								<IconPlus width={14} height={14} />
								Variante
							</Button>
						) : (
							<Button size="sm" onClick={() => setSizeDialog({ variantId: null })}>
								<IconPlus width={14} height={14} />
								Taille
							</Button>
						))
					}
				/>

				{product.kind === "variant" ? (
					<div className="divide-y divide-[var(--border)]">
						{product.variants.map((variant) => (
							<div key={variant.id} className="p-4">
								<div className="flex items-center gap-3">
									<span
										className="size-5 shrink-0 rounded-full border border-line"
										style={{ background: variant.colorHex ?? "transparent" }}
										aria-hidden="true"
									/>
									<span className="flex-1 font-medium text-ink">{variant.name}</span>
									<Badge tone={stockStatusTone(variant.stockStatus)}>
										{variant.availableQuantity} en stock
									</Badge>

									{!disabled && (
										<>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => openEdit(variant)}
												aria-label={`Modifier ${variant.name}`}
											>
												<IconEdit width={15} height={15} />
											</Button>
											<Button
												size="sm"
												onClick={() => setSizeDialog({ variantId: variant.id })}
											>
												<IconPlus width={14} height={14} />
												Taille
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeVariant.mutate(variant.id)}
												aria-label={`Retirer ${variant.name}`}
											>
												<IconTrash width={15} height={15} />
											</Button>
										</>
									)}
								</div>

								{variant.sizes.length > 0 && (
									<div className="mt-3 flex flex-wrap gap-2">
										{variant.sizes.map((size) => (
											<span
												key={size.id}
												className="inline-flex items-center gap-1.5 rounded-md border border-line bg-sunken px-2 py-1 text-[12px]"
											>
												<span className="font-medium text-ink">{size.label}</span>
												<span className="text-subtle tabular">{size.availableQuantity}</span>
												{!disabled && (
													<button
														type="button"
														onClick={() => removeSize.mutate(size.id)}
														className="text-subtle hover:text-danger"
														aria-label={`Retirer la taille ${size.label}`}
													>
														<IconTrash width={12} height={12} />
													</button>
												)}
											</span>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				) : product.sizes.length > 0 ? (
					<div className="flex flex-wrap gap-2 p-4">
						{product.sizes.map((size) => (
							<span
								key={size.id}
								className="inline-flex items-center gap-2 rounded-md border border-line bg-sunken px-2.5 py-1.5 text-[13px]"
							>
								<span className="font-medium text-ink">{size.label}</span>
								<Badge tone={stockStatusTone(size.stockStatus)}>
									{size.availableQuantity}
								</Badge>
								{!disabled && (
									<button
										type="button"
										onClick={() => removeSize.mutate(size.id)}
										className="text-subtle hover:text-danger"
										aria-label={`Retirer la taille ${size.label}`}
									>
										<IconTrash width={13} height={13} />
									</button>
								)}
							</span>
						))}
					</div>
				) : (
					<p className="px-4 py-6 text-center text-[13px] text-muted">
						Ce produit n’a aucune taille : son stock est géré au niveau du produit.
					</p>
				)}
			</Card>

			<Dialog
				open={variantDialog}
				onClose={() => setVariantDialog(false)}
				title="Ajouter une variante"
				description="Un coloris, avec son propre stock."
				footer={
					<>
						<Button onClick={() => setVariantDialog(false)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => addVariant.mutate()}
							loading={addVariant.isPending}
							disabled={!variantDraft.name.trim()}
						>
							Ajouter
						</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Field label="Nom du coloris" required>
						<Input
							autoFocus
							value={variantDraft.name}
							onChange={(event) =>
								setVariantDraft({ ...variantDraft, name: event.target.value })
							}
							placeholder="Bordeaux"
						/>
					</Field>

					<Field label="Couleur">
						<div className="flex items-center gap-2">
							<input
								type="color"
								value={variantDraft.colorHex}
								onChange={(event) =>
									setVariantDraft({ ...variantDraft, colorHex: event.target.value })
								}
								className="h-9 w-12 shrink-0 cursor-pointer rounded border border-line bg-raised"
								aria-label="Couleur"
							/>
							<Input
								value={variantDraft.colorHex}
								onChange={(event) =>
									setVariantDraft({ ...variantDraft, colorHex: event.target.value })
								}
							/>
						</div>
					</Field>

					<Field
						label="Photos du coloris"
						hint="La première sert de vignette quand la cliente sélectionne ce coloris."
					>
						<ImageUploadList
							endpoint={UPLOAD_ENDPOINTS.catalog}
							values={variantDraft.imageUrls}
							onChange={(imageUrls) => setVariantDraft({ ...variantDraft, imageUrls })}
						/>
					</Field>

					<Field label="Stock initial" hint="Vous pourrez ensuite lui ajouter des tailles.">
						<Input
							inputMode="numeric"
							value={variantDraft.quantity}
							onChange={(event) =>
								setVariantDraft({ ...variantDraft, quantity: event.target.value })
							}
						/>
					</Field>
				</div>
			</Dialog>

			<Dialog
				open={editDialog !== null}
				onClose={() => setEditDialog(null)}
				title="Modifier la variante"
				description="Nom, couleur et galerie de ce coloris."
				footer={
					<>
						<Button onClick={() => setEditDialog(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => updateVariant.mutate()}
							loading={updateVariant.isPending}
							disabled={!editDraft.name.trim()}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Field label="Nom du coloris" required>
						<Input
							autoFocus
							value={editDraft.name}
							onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
							placeholder="Bordeaux"
						/>
					</Field>

					<Field label="Couleur">
						<div className="flex items-center gap-2">
							<input
								type="color"
								value={editDraft.colorHex}
								onChange={(event) =>
									setEditDraft({ ...editDraft, colorHex: event.target.value })
								}
								className="h-9 w-12 shrink-0 cursor-pointer rounded border border-line bg-raised"
								aria-label="Couleur"
							/>
							<Input
								value={editDraft.colorHex}
								onChange={(event) =>
									setEditDraft({ ...editDraft, colorHex: event.target.value })
								}
							/>
						</div>
					</Field>

					<Field
						label="Photos du coloris"
						hint="Ajoutez, réordonnez ou retirez des visuels pour ce coloris."
					>
						<ImageUploadList
							endpoint={UPLOAD_ENDPOINTS.catalog}
							values={editDraft.imageUrls}
							onChange={(imageUrls) => setEditDraft({ ...editDraft, imageUrls })}
						/>
					</Field>
				</div>
			</Dialog>

			<Dialog
				open={sizeDialog !== null}
				onClose={() => setSizeDialog(null)}
				title="Ajouter une taille"
				footer={
					<>
						<Button onClick={() => setSizeDialog(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => addSize.mutate()}
							loading={addSize.isPending}
							disabled={!sizeDraft.label.trim()}
						>
							Ajouter
						</Button>
					</>
				}
			>
				<div className="flex flex-col gap-4">
					<Field label="Libellé" required>
						<Input
							autoFocus
							value={sizeDraft.label}
							onChange={(event) => setSizeDraft({ ...sizeDraft, label: event.target.value })}
							placeholder="XL"
						/>
					</Field>

					<Field label="Stock initial">
						<Input
							inputMode="numeric"
							value={sizeDraft.quantity}
							onChange={(event) =>
								setSizeDraft({ ...sizeDraft, quantity: event.target.value })
							}
						/>
					</Field>
				</div>
			</Dialog>
		</>
	);
};
