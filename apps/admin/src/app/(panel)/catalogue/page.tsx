"use client";

import type { Paginated, Product } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, toQueryString } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import {
	CONTENT_STATUS_LABELS,
	STOCK_STATUS_LABELS,
	formatMoney,
} from "@/lib/format";
import { useDebounced, useListQuery } from "@/lib/use-list-query";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar, FilterSelect } from "@/components/ui/filters";
import {
	DataTable,
	Pagination,
	Thumb,
	type Column,
} from "@/components/ui/table";
import {
	Badge,
	Button,
	Card,
	EmptyState,
	contentStatusTone,
	stockStatusTone,
} from "@/components/ui/primitives";
import { IconDownload, IconPlus, IconUpload } from "@/components/icons";
import { ImportDialog } from "@/features/catalogue/import-dialog";

/** Module « Catalogue » - liste des produits (§4.2). */

const STATUS_OPTIONS = [
	{ value: "draft", label: "Brouillon" },
	{ value: "published", label: "Publié" },
	{ value: "archived", label: "Archivé" },
];

const KIND_OPTIONS = [
	{ value: "simple", label: "Produit simple" },
	{ value: "variant", label: "À variantes" },
];

const STOCK_OPTIONS = [
	{ value: "in_stock", label: "En stock" },
	{ value: "low_stock", label: "Stock faible" },
	{ value: "out_of_stock", label: "Rupture" },
];

const ProductsPage = () => {
	const router = useRouter();
	const { can } = useAuth();
	const { notify, notifyError } = useToast();
	const queryClient = useQueryClient();

	const list = useListQuery({ q: "", status: "", kind: "", stockStatus: "" });
	const debouncedSearch = useDebounced(list.filters.q);
	const [importOpen, setImportOpen] = useState(false);

	const params = { ...list.params, q: debouncedSearch };

	const { data, isLoading } = useQuery({
		queryKey: ["products", params],
		queryFn: () =>
			api.get<Paginated<Product>>(
				`/api/admin/products${toQueryString(params)}`,
			),
	});

	/**
	 * Export CSV.
	 *
	 * Le fichier est récupéré via le client authentifié puis transformé en
	 * lien objet : un simple `<a href>` vers l'API n'emporterait pas le jeton
	 * d'accès et retournerait 401.
	 */
	const exportCsv = useMutation({
		mutationFn: () => api.get<string>("/api/admin/products/export"),
		onSuccess: (csv) => {
			const url = URL.createObjectURL(
				new Blob([csv], { type: "text/csv;charset=utf-8" }),
			);
			const link = document.createElement("a");
			link.href = url;
			link.download = `produits-${new Date().toISOString().slice(0, 10)}.csv`;
			link.click();
			URL.revokeObjectURL(url);
			notify("Export généré.");
		},
		onError: (error) => notifyError(error, "Export impossible."),
	});

	const columns: Column<Product>[] = [
		{
			key: "name",
			header: "Produit",
			cell: (product) => (
				<div className="flex items-center gap-3">
					<Thumb src={product.images[0]?.url} alt={product.name} />
					<div className="min-w-0">
						<p className="truncate font-medium text-ink">{product.name}</p>
						<p className="truncate text-[12px] text-subtle">
							{product.kind === "variant"
								? `${product.variants.length} coloris`
								: product.sizes.length > 0
									? `${product.sizes.length} tailles`
									: "Sans déclinaison"}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "status",
			header: "Statut",
			hideOnMobile: true,
			cell: (product) => (
				<Badge tone={contentStatusTone(product.status)}>
					{CONTENT_STATUS_LABELS[product.status]}
				</Badge>
			),
		},
		{
			key: "stock",
			header: "Stock",
			hideOnMobile: true,
			cell: (product) => (
				<div className="flex items-center gap-2">
					<Badge tone={stockStatusTone(product.stockStatus)}>
						{STOCK_STATUS_LABELS[product.stockStatus]}
					</Badge>
					<span className="text-[12px] text-subtle tabular">
						{product.availableQuantity}
					</span>
				</div>
			),
		},
		{
			key: "price",
			header: "Prix",
			align: "right",
			cell: (product) => (
				<div>
					<span className="font-medium text-ink">
						{formatMoney(product.basePrice, product.currency)}
					</span>
					{product.compareAtPrice && (
						<span className="ml-1.5 text-[12px] text-subtle line-through">
							{formatMoney(product.compareAtPrice, product.currency)}
						</span>
					)}
				</div>
			),
		},
	];

	return (
		<>
			<PageHeader
				title="Catalogue"
				description="Produits, variantes et déclinaisons de la boutique."
				actions={
					<>
						<Link
							href="/catalogue/categories"
							className="inline-flex h-9 items-center rounded-md border border-line-strong bg-raised px-3.5 text-[14px] font-medium text-ink transition-colors hover:bg-accent-soft"
						>
							Catégories
						</Link>

						{can(PERMISSIONS.catalog.read) && (
							<Button
								onClick={() => exportCsv.mutate()}
								loading={exportCsv.isPending}
							>
								<IconDownload width={16} height={16} />
								Exporter
							</Button>
						)}

						{can(PERMISSIONS.catalog.import) && (
							<Button onClick={() => setImportOpen(true)}>
								<IconUpload width={16} height={16} />
								Importer
							</Button>
						)}

						{can(PERMISSIONS.catalog.write) && (
							<Button
								variant="primary"
								onClick={() => router.push("/catalogue/nouveau")}
							>
								<IconPlus width={16} height={16} />
								Nouveau produit
							</Button>
						)}
					</>
				}
			/>

			<Card>
				<FilterBar
					search={list.filters.q}
					onSearchChange={(value) => list.setFilter("q", value)}
					searchPlaceholder="Nom, SKU…"
					onReset={list.reset}
					showReset={list.isFiltered}
				>
					<FilterSelect
						label="Statut"
						placeholder="Tous les statuts"
						value={list.filters.status}
						onChange={(value) => list.setFilter("status", value)}
						options={STATUS_OPTIONS}
					/>
					<FilterSelect
						label="Type"
						placeholder="Tous les types"
						value={list.filters.kind}
						onChange={(value) => list.setFilter("kind", value)}
						options={KIND_OPTIONS}
					/>
					<FilterSelect
						label="Stock"
						placeholder="Tout stock"
						value={list.filters.stockStatus}
						onChange={(value) => list.setFilter("stockStatus", value)}
						options={STOCK_OPTIONS}
					/>
				</FilterBar>

				<DataTable
					columns={columns}
					rows={data?.data ?? []}
					rowKey={(product) => product.id}
					loading={isLoading}
					onRowClick={(product) => router.push(`/catalogue/${product.id}`)}
					empty={
						<EmptyState
							title={
								list.isFiltered
									? "Aucun produit ne correspond"
									: "Aucun produit"
							}
							description={
								list.isFiltered
									? "Modifiez ou réinitialisez les filtres."
									: "Créez votre premier produit pour commencer."
							}
							action={
								list.isFiltered ? (
									<Button size="sm" onClick={list.reset}>
										Réinitialiser
									</Button>
								) : can(PERMISSIONS.catalog.write) ? (
									<Button
										size="sm"
										variant="primary"
										onClick={() => router.push("/catalogue/nouveau")}
									>
										Nouveau produit
									</Button>
								) : undefined
							}
						/>
					}
				/>

				{data && <Pagination meta={data.meta} onChange={list.setPage} />}
			</Card>

			<ImportDialog
				open={importOpen}
				onClose={() => setImportOpen(false)}
				onImported={() => {
					void queryClient.invalidateQueries({ queryKey: ["products"] });
					setImportOpen(false);
				}}
			/>
		</>
	);
};

export default ProductsPage;
