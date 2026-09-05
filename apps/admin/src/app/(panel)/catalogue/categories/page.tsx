"use client";

import type { Category, CategoryNode } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ApiRequestError, api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog, Dialog } from "@/components/ui/dialog";
import {
	Badge,
	Button,
	Card,
	Checkbox,
	EmptyState,
	Field,
	Input,
	Select,
	Spinner,
	Textarea,
} from "@/components/ui/primitives";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";
import { slugify } from "@/features/catalogue/product-fields";

/** Arborescence des catégories (§2.1). */

interface CategoryDraft {
	id?: string;
	name: string;
	slug: string;
	description: string;
	imageUrl: string;
	parentId: string;
	status: "active" | "inactive";
	isFeatured: boolean;
	nameEn: string;
}

const emptyDraft = (parentId = ""): CategoryDraft => ({
	name: "",
	slug: "",
	description: "",
	imageUrl: "",
	parentId,
	status: "active",
	isFeatured: false,
	nameEn: "",
});

/** Aplatit l'arbre pour le sélecteur de parent, avec indentation visuelle. */
const flatten = (
	nodes: CategoryNode[],
	depth = 0,
): { value: string; label: string }[] =>
	nodes.flatMap((node) => [
		{ value: node.id, label: `${"— ".repeat(depth)}${node.name}` },
		...flatten(node.children, depth + 1),
	]);

const CategoryRow = ({
	node,
	depth,
	onEdit,
	onAddChild,
	onDelete,
	writable,
}: {
	node: CategoryNode;
	depth: number;
	onEdit: (node: CategoryNode) => void;
	onAddChild: (parentId: string) => void;
	onDelete: (node: CategoryNode) => void;
	writable: boolean;
}) => (
	<>
		<li className="flex items-center gap-3 border-b border-line px-4 py-2.5 last:border-0">
			<span style={{ paddingLeft: depth * 20 }} className="min-w-0 flex-1">
				<span className="block truncate text-[13px] font-medium text-ink">{node.name}</span>
				<span className="block truncate text-[12px] text-subtle">/{node.slug}</span>
			</span>

			{node.isFeatured && <Badge tone="info">Mise en avant</Badge>}
			<Badge tone={node.status === "active" ? "success" : "neutral"}>
				{node.status === "active" ? "Active" : "Inactive"}
			</Badge>

			{writable && (
				<>
					<Button size="sm" variant="ghost" onClick={() => onAddChild(node.id)} aria-label="Ajouter une sous-catégorie">
						<IconPlus width={15} height={15} />
					</Button>
					<Button size="sm" variant="ghost" onClick={() => onEdit(node)} aria-label="Modifier">
						<IconEdit width={15} height={15} />
					</Button>
					<Button size="sm" variant="ghost" onClick={() => onDelete(node)} aria-label="Archiver">
						<IconTrash width={15} height={15} />
					</Button>
				</>
			)}
		</li>

		{node.children.map((child) => (
			<CategoryRow
				key={child.id}
				node={child}
				depth={depth + 1}
				onEdit={onEdit}
				onAddChild={onAddChild}
				onDelete={onDelete}
				writable={writable}
			/>
		))}
	</>
);

const CategoriesPage = () => {
	const queryClient = useQueryClient();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();

	const [draft, setDraft] = useState<CategoryDraft | null>(null);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [toDelete, setToDelete] = useState<CategoryNode | null>(null);

	const { data: tree, isLoading } = useQuery({
		queryKey: ["categories", "tree"],
		queryFn: () => api.get<CategoryNode[]>("/api/admin/categories?tree=true"),
	});

	const refresh = () => {
		void queryClient.invalidateQueries({ queryKey: ["categories"] });
	};

	const save = useMutation({
		mutationFn: () => {
			const payload = {
				name: draft!.name.trim(),
				slug: draft!.slug.trim(),
				description: draft!.description.trim() || null,
				imageUrl: draft!.imageUrl.trim() || null,
				parentId: draft!.parentId || null,
				status: draft!.status,
				isFeatured: draft!.isFeatured,
				translations: draft!.nameEn.trim()
					? { en: { name: draft!.nameEn.trim() } }
					: undefined,
			};

			return draft!.id
				? api.patch<Category>(`/api/admin/categories/${draft!.id}`, payload)
				: api.post<Category>("/api/admin/categories", payload);
		},
		onSuccess: () => {
			refresh();
			notify(draft?.id ? "Catégorie mise à jour." : "Catégorie créée.");
			setDraft(null);
			setErrors({});
		},
		onError: (error) => {
			if (error instanceof ApiRequestError && error.details) setErrors(error.details);
			notifyError(error, "Enregistrement impossible.");
		},
	});

	const archive = useMutation({
		mutationFn: (id: string) => api.delete(`/api/admin/categories/${id}`),
		onSuccess: () => {
			refresh();
			notify("Catégorie archivée.");
			setToDelete(null);
		},
		onError: (error) => {
			// L'API refuse d'archiver une catégorie qui contient encore des
			// produits ou des sous-catégories : son message est explicite.
			notifyError(error, "Archivage impossible.");
			setToDelete(null);
		},
	});

	const writable = can(PERMISSIONS.catalog.write);
	const parentOptions = tree ? flatten(tree) : [];

	return (
		<>
			<PageHeader
				title="Catégories"
				description="Arborescence des rayons de la boutique. Un produit peut appartenir à plusieurs catégories."
				backHref="/catalogue"
				backLabel="Catalogue"
				actions={
					writable && (
						<Button variant="primary" onClick={() => setDraft(emptyDraft())}>
							<IconPlus width={16} height={16} />
							Nouvelle catégorie
						</Button>
					)
				}
			/>

			<Card>
				{isLoading ? (
					<Spinner />
				) : !tree || tree.length === 0 ? (
					<EmptyState
						title="Aucune catégorie"
						description="Créez un premier rayon pour organiser le catalogue."
						action={
							writable && (
								<Button size="sm" variant="primary" onClick={() => setDraft(emptyDraft())}>
									Nouvelle catégorie
								</Button>
							)
						}
					/>
				) : (
					<ul>
						{tree.map((node) => (
							<CategoryRow
								key={node.id}
								node={node}
								depth={0}
								writable={writable}
								onAddChild={(parentId) => setDraft(emptyDraft(parentId))}
								onEdit={(target) =>
									setDraft({
										id: target.id,
										name: target.name,
										slug: target.slug,
										description: target.description ?? "",
										imageUrl: target.imageUrl ?? "",
										parentId: target.parentId ?? "",
										status: target.status,
										isFeatured: target.isFeatured,
										nameEn: target.translations?.en?.name ?? "",
									})
								}
								onDelete={setToDelete}
							/>
						))}
					</ul>
				)}
			</Card>

			<Dialog
				open={draft !== null}
				onClose={() => {
					setDraft(null);
					setErrors({});
				}}
				title={draft?.id ? "Modifier la catégorie" : "Nouvelle catégorie"}
				size="md"
				footer={
					<>
						<Button onClick={() => setDraft(null)}>Annuler</Button>
						<Button
							variant="primary"
							onClick={() => save.mutate()}
							loading={save.isPending}
							disabled={!draft?.name.trim() || !draft.slug.trim()}
						>
							{draft?.id ? "Enregistrer" : "Créer"}
						</Button>
					</>
				}
			>
				{draft && (
					<div className="flex flex-col gap-4">
						<Field label="Nom" required error={errors.name?.[0]}>
							<Input
								autoFocus
								value={draft.name}
								onChange={(event) => {
									const name = event.target.value;
									setDraft({
										...draft,
										name,
										// Le slug d'une catégorie existante n'est pas réécrit
										// automatiquement : il est déjà en circulation dans les URL.
										slug: draft.id ? draft.slug : slugify(name),
									});
								}}
								placeholder="Robes"
							/>
						</Field>

						<Field label="Slug" required error={errors.slug?.[0]}>
							<Input
								value={draft.slug}
								onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })}
							/>
						</Field>

						<Field label="Nom (anglais)">
							<Input
								value={draft.nameEn}
								onChange={(event) => setDraft({ ...draft, nameEn: event.target.value })}
								placeholder="Dresses"
							/>
						</Field>

						<Field label="Catégorie parente" error={errors.parentId?.[0]}>
							<Select
								value={draft.parentId}
								onChange={(event) => setDraft({ ...draft, parentId: event.target.value })}
								options={parentOptions.filter((option) => option.value !== draft.id)}
								placeholder="Aucune (racine)"
							/>
						</Field>

						<Field label="Image" hint="Bannière affichée en tête du rayon.">
							<Input
								value={draft.imageUrl}
								onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
								placeholder="/category/category1.jpg"
							/>
						</Field>

						<Field label="Description">
							<Textarea
								rows={3}
								value={draft.description}
								onChange={(event) => setDraft({ ...draft, description: event.target.value })}
							/>
						</Field>

						<Field label="Statut">
							<Select
								value={draft.status}
								onChange={(event) =>
									setDraft({ ...draft, status: event.target.value as "active" | "inactive" })
								}
								options={[
									{ value: "active", label: "Active" },
									{ value: "inactive", label: "Inactive" },
								]}
							/>
						</Field>

						<Checkbox
							label="Mettre en avant sur la page d'accueil"
							checked={draft.isFeatured}
							onChange={(event) => setDraft({ ...draft, isFeatured: event.target.checked })}
						/>
					</div>
				)}
			</Dialog>

			<ConfirmDialog
				open={toDelete !== null}
				onClose={() => setToDelete(null)}
				onConfirm={() => toDelete && archive.mutate(toDelete.id)}
				loading={archive.isPending}
				title="Archiver cette catégorie ?"
				message={`« ${toDelete?.name} » sera retirée de la boutique. L'opération est refusée si elle contient encore des produits ou des sous-catégories.`}
				confirmLabel="Archiver"
			/>
		</>
	);
};

export default CategoriesPage;
