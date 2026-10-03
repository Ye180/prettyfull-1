"use client";

import type { CategoryNode, FeaturedEntry, Paginated, Product } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api, toQueryString } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useDebounced } from "@/lib/use-list-query";
import { useToast } from "@/components/ui/toast";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	CardHeader,
	Checkbox,
	Field,
	Input,
	Select,
	Spinner,
} from "@/components/ui/primitives";
import { Thumb } from "@/components/ui/table";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";

/**
 * Mises en avant (module Contenu > Mises en avant) : épingler un produit ou
 * une catégorie à une section nommée de la page d'accueil (§2.6).
 *
 * La page d'accueil retombe sur son contenu par défaut tant qu'aucune entrée
 * n'est publiée pour la clé qu'elle demande - une section mal configurée ne
 * casse donc jamais l'affichage.
 */

/** Clés déjà consommées côté storefront - la liste s'enrichit au fil du câblage des sections. */
const SECTION_KEY_SUGGESTIONS = [
	{ value: "home_bundle_save", label: "Accueil — Composez votre routine" },
];

interface FeaturedDraft {
	kind: "product" | "category";
	sectionKey: string;
	position: string;
	isActive: boolean;
	targetId: string;
	targetLabel: string;
}

const emptyDraft = (): FeaturedDraft => ({
	kind: "product",
	sectionKey: SECTION_KEY_SUGGESTIONS[0]?.value ?? "",
	position: "0",
	isActive: true,
	targetId: "",
	targetLabel: "",
});

const flattenCategories = (
	nodes: CategoryNode[],
	depth = 0,
): { id: string; label: string }[] =>
	nodes.flatMap((node) => [
		{ id: node.id, label: `${"— ".repeat(depth)}${node.name}` },
		...flattenCategories(node.children, depth + 1),
	]);

const targetLabel = (entry: FeaturedEntry): string => {
	const target = entry.target as { name?: string } | null | undefined;
	return target?.name ?? "(cible introuvable)";
};

const targetThumb = (entry: FeaturedEntry): string | null => {
	const target = entry.target as { thumbnail?: string | null; imageUrl?: string | null } | null | undefined;
	return target?.thumbnail ?? target?.imageUrl ?? null;
};

export const FeaturedEntries = () => {
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const queryClient = useQueryClient();
	const writable = can(PERMISSIONS.content.write);

	const [draft, setDraft] = useState<FeaturedDraft | null>(null);
	const [toDelete, setToDelete] = useState<{ id: string; label: string } | null>(null);
	const [productSearch, setProductSearch] = useState("");
	const debouncedProductSearch = useDebounced(productSearch);

	const { data: entries, isLoading } = useQuery({
		queryKey: ["featured-entries-admin"],
		queryFn: () => api.get<FeaturedEntry[]>("/api/admin/featured"),
	});

	const { data: categoryTree } = useQuery({
		queryKey: ["categories-tree-picker"],
		queryFn: () => api.get<CategoryNode[]>("/api/admin/categories?tree=true"),
		enabled: draft?.kind === "category",
		staleTime: 5 * 60 * 1000,
	});

	const { data: productResults, isFetching: searchingProducts } = useQuery({
		queryKey: ["products-picker", debouncedProductSearch],
		queryFn: () =>
			api.get<Paginated<Product>>(
				`/api/admin/products${toQueryString({ q: debouncedProductSearch, limit: 8 })}`,
			),
		enabled: draft?.kind === "product" && debouncedProductSearch.trim().length > 1,
	});

	const refresh = () => void queryClient.invalidateQueries({ queryKey: ["featured-entries-admin"] });

	const save = useMutation({
		mutationFn: () =>
			api.post("/api/admin/featured", {
				kind: draft!.kind,
				productId: draft!.kind === "product" ? draft!.targetId : null,
				categoryId: draft!.kind === "category" ? draft!.targetId : null,
				sectionKey: draft!.sectionKey.trim(),
				position: Number(draft!.position) || 0,
				isActive: draft!.isActive,
			}),
		onSuccess: () => {
			refresh();
			notify("Mise en avant créée.");
			setDraft(null);
			setProductSearch("");
		},
		onError: (error) => notifyError(error, "Enregistrement impossible."),
	});

	const toggleActive = useMutation({
		mutationFn: (entry: FeaturedEntry) =>
			api.patch(`/api/admin/featured/${entry.id}`, { isActive: !entry.isActive }),
		onSuccess: refresh,
		onError: (error) => notifyError(error, "Mise à jour impossible."),
	});

	const remove = useMutation({
		mutationFn: () => api.delete(`/api/admin/featured/${toDelete!.id}`),
		onSuccess: () => {
			refresh();
			notify("Mise en avant supprimée.");
			setToDelete(null);
		},
		onError: (error) => {
			notifyError(error, "Suppression impossible.");
			setToDelete(null);
		},
	});

	const categoryOptions = categoryTree ? flattenCategories(categoryTree) : [];

	return (
		<>
			<CardHeader
				title="Mises en avant"
				description="Épingle un produit ou une catégorie à un emplacement de la page d'accueil (ex. « home_bundle_save »)."
				action={
					writable && (
						<Button size="sm" variant="primary" onClick={() => setDraft(emptyDraft())}>
							<IconPlus width={14} height={14} />
							Mise en avant
						</Button>
					)
				}
			/>

			{isLoading ? (
				<Spinner />
			) : (entries ?? []).length === 0 ? (
				<p className="px-4 py-8 text-center text-[13px] text-muted">
					Aucune mise en avant. Les sections concernées affichent leur contenu par défaut.
				</p>
			) : (
				<ul className="divide-y divide-[var(--border)]">
					{(entries ?? []).map((entry) => (
						<li key={entry.id} className="flex items-center gap-3 px-4 py-3">
							<Thumb src={targetThumb(entry)} alt="" />

							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-medium text-ink">
									{targetLabel(entry)}
								</p>
								<p className="truncate text-[12px] text-subtle">
									{entry.sectionKey} · position {entry.position} ·{" "}
									{entry.kind === "product" ? "Produit" : "Catégorie"}
								</p>
							</div>

							<Badge tone={entry.isActive ? "success" : "neutral"}>
								{entry.isActive ? "Active" : "Désactivée"}
							</Badge>

							{writable && (
								<>
									<Button
										size="sm"
										variant="ghost"
										aria-label={entry.isActive ? "Désactiver" : "Activer"}
										onClick={() => toggleActive.mutate(entry)}
										loading={toggleActive.isPending}
									>
										<IconEdit width={15} height={15} />
									</Button>
									<Button
										size="sm"
										variant="ghost"
										aria-label="Supprimer"
										onClick={() =>
											setToDelete({ id: entry.id, label: targetLabel(entry) })
										}
									>
										<IconTrash width={15} height={15} />
									</Button>
								</>
							)}
						</li>
					))}
				</ul>
			)}

			<Dialog
				open={draft !== null}
				onClose={() => {
					setDraft(null);
					setProductSearch("");
				}}
				title="Nouvelle mise en avant"
				size="md"
				footer={
					<>
						<Button onClick={() => setDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => save.mutate()}
							loading={save.isPending}
							disabled={!draft?.targetId || !draft?.sectionKey.trim()}
						>
							Enregistrer
						</Button>
					</>
				}
			>
				{draft && (
					<div className="flex flex-col gap-4">
						<Field label="Type">
							<Select
								value={draft.kind}
								onChange={(event) =>
									setDraft({
										...draft,
										kind: event.target.value as FeaturedDraft["kind"],
										targetId: "",
										targetLabel: "",
									})
								}
								options={[
									{ value: "product", label: "Produit" },
									{ value: "category", label: "Catégorie" },
								]}
							/>
						</Field>

						{draft.kind === "product" ? (
							<Field label="Produit" required>
								<Input
									placeholder="Rechercher un produit…"
									value={draft.targetId ? draft.targetLabel : productSearch}
									onChange={(event) => {
										setProductSearch(event.target.value);
										setDraft({ ...draft, targetId: "", targetLabel: "" });
									}}
								/>
								{!draft.targetId && productSearch.trim().length > 1 && (
									<div className="mt-1 max-h-48 overflow-y-auto rounded border border-line">
										{searchingProducts ? (
											<div className="p-3">
												<Spinner />
											</div>
										) : (productResults?.data ?? []).length === 0 ? (
											<p className="p-3 text-[12px] text-subtle">Aucun résultat.</p>
										) : (
											(productResults?.data ?? []).map((product) => (
												<button
													key={product.id}
													type="button"
													className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] hover:bg-sunken"
													onClick={() => {
														setDraft({
															...draft,
															targetId: product.id,
															targetLabel: product.name,
														});
														setProductSearch("");
													}}
												>
													<Thumb src={product.images[0]?.url} alt="" />
													{product.name}
												</button>
											))
										)}
									</div>
								)}
							</Field>
						) : (
							<Field label="Catégorie" required>
								<Select
									value={draft.targetId}
									onChange={(event) => {
										const id = event.target.value;
										setDraft({
											...draft,
											targetId: id,
											targetLabel:
												categoryOptions.find((option) => option.id === id)?.label ?? "",
										});
									}}
									options={[
										{ value: "", label: "— Choisir —" },
										...categoryOptions.map((option) => ({
											value: option.id,
											label: option.label,
										})),
									]}
								/>
							</Field>
						)}

						<Field
							label="Section"
							required
							hint="Clé de l'emplacement ciblé sur la page d'accueil."
						>
							<Input
								list="featured-section-keys"
								value={draft.sectionKey}
								onChange={(event) => setDraft({ ...draft, sectionKey: event.target.value })}
								placeholder="home_bundle_save"
							/>
							<datalist id="featured-section-keys">
								{SECTION_KEY_SUGGESTIONS.map((suggestion) => (
									<option key={suggestion.value} value={suggestion.value}>
										{suggestion.label}
									</option>
								))}
							</datalist>
						</Field>

						<div className="grid gap-4 sm:grid-cols-2">
							<Field label="Position" hint="Ordre d'affichage, du plus petit au plus grand.">
								<Input
									type="number"
									min={0}
									value={draft.position}
									onChange={(event) => setDraft({ ...draft, position: event.target.value })}
								/>
							</Field>

							<Field label="Statut">
								<Checkbox
									label="Active"
									checked={draft.isActive}
									onChange={(event) =>
										setDraft({ ...draft, isActive: event.target.checked })
									}
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
				title="Supprimer cette mise en avant ?"
				message={`« ${toDelete?.label} » ne sera plus épinglé à son emplacement. Cette action est irréversible.`}
				confirmLabel="Supprimer"
			/>
		</>
	);
};

export default FeaturedEntries;
