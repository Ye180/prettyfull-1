"use client";

import type { InventoryRow, Paginated } from "@prettyfull/contracts";
import { PERMISSIONS } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { api, toQueryString } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { STOCK_STATUS_LABELS } from "@/lib/format";
import { useDebounced, useListQuery } from "@/lib/use-list-query";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar, FilterSelect } from "@/components/ui/filters";
import { DataTable, Pagination, Thumb, type Column } from "@/components/ui/table";
import {
	Badge,
	Button,
	Card,
	EmptyState,
	Spinner,
	stockStatusTone,
} from "@/components/ui/primitives";
import { AdjustStockDialog } from "@/features/stocks/adjust-dialog";

/** Module « Stocks » — vue consolidée (§4.3). */

const STOCK_OPTIONS = [
	{ value: "in_stock", label: "En stock" },
	{ value: "low_stock", label: "Stock faible" },
	{ value: "out_of_stock", label: "Rupture" },
];

const StocksContent = () => {
	const searchParams = useSearchParams();
	const { can } = useAuth();

	// Le tableau de bord et la fiche produit renvoient ici avec un filtre
	// pré-appliqué : l'alerte cliquée doit ouvrir la bonne vue.
	const list = useListQuery({
		q: "",
		stockStatus: "",
		lowStockOnly: searchParams.get("lowStockOnly") ?? "",
		productId: searchParams.get("productId") ?? "",
	});

	const debouncedSearch = useDebounced(list.filters.q);
	const [adjusting, setAdjusting] = useState<InventoryRow | null>(null);

	const params = { ...list.params, q: debouncedSearch };

	const { data, isLoading } = useQuery({
		queryKey: ["inventory", params],
		queryFn: () =>
			api.get<Paginated<InventoryRow>>(`/api/admin/inventory${toQueryString(params)}`),
	});

	const adjustable = can(PERMISSIONS.inventory.adjust);

	const columns: Column<InventoryRow>[] = [
		{
			key: "product",
			header: "Article",
			cell: (row) => (
				<div className="flex items-center gap-3">
					<Thumb src={row.thumbnail} alt={row.productName} />
					<div className="min-w-0">
						<p className="truncate font-medium text-ink">{row.productName}</p>
						<p className="truncate text-[12px] text-subtle">
							{[row.variantName, row.sizeLabel].filter(Boolean).join(" · ") ||
								"Sans déclinaison"}
						</p>
					</div>
				</div>
			),
		},
		{
			key: "sku",
			header: "SKU",
			hideOnMobile: true,
			cell: (row) => (
				<span className="font-mono text-[12px] text-muted">{row.sku ?? "—"}</span>
			),
		},
		{
			key: "quantity",
			header: "En stock",
			align: "right",
			cell: (row) => <span className="text-ink">{row.quantity}</span>,
		},
		{
			key: "reserved",
			header: "Réservé",
			align: "right",
			hideOnMobile: true,
			cell: (row) => (
				<span className={row.reservedQuantity > 0 ? "text-warning" : "text-subtle"}>
					{row.reservedQuantity}
				</span>
			),
		},
		{
			key: "available",
			header: "Disponible",
			align: "right",
			cell: (row) => (
				<div className="flex items-center justify-end gap-2">
					<span className="font-medium text-ink">{row.availableQuantity}</span>
					<Badge tone={stockStatusTone(row.stockStatus)}>
						{STOCK_STATUS_LABELS[row.stockStatus]}
					</Badge>
				</div>
			),
		},
		{
			key: "actions",
			header: "",
			align: "right",
			width: "1%",
			cell: (row) =>
				adjustable ? (
					<Button size="sm" onClick={() => setAdjusting(row)}>
						Ajuster
					</Button>
				) : null,
		},
	];

	return (
		<>
			<PageHeader
				title="Stocks"
				description="Quantités au niveau le plus fin : variante et taille, ou produit s'il n'a pas de déclinaison."
				actions={
					<Link
						href="/stocks/mouvements"
						className="inline-flex h-9 items-center rounded-md border border-line-strong bg-raised px-3.5 text-[14px] font-medium text-ink transition-colors hover:bg-accent-soft"
					>
						Historique des mouvements
					</Link>
				}
			/>

			<Card>
				<FilterBar
					search={list.filters.q}
					onSearchChange={(value) => list.setFilter("q", value)}
					searchPlaceholder="Produit, SKU…"
					onReset={list.reset}
					showReset={list.isFiltered}
				>
					<FilterSelect
						label="État du stock"
						placeholder="Tous les états"
						value={list.filters.stockStatus}
						onChange={(value) => list.setFilter("stockStatus", value)}
						options={STOCK_OPTIONS}
					/>
					<Button
						size="sm"
						variant={list.filters.lowStockOnly ? "primary" : "secondary"}
						onClick={() =>
							list.setFilter("lowStockOnly", list.filters.lowStockOnly ? "" : "true")
						}
					>
						Alertes uniquement
					</Button>
				</FilterBar>

				<DataTable
					columns={columns}
					rows={data?.data ?? []}
					rowKey={(row) => row.id}
					loading={isLoading}
					empty={
						<EmptyState
							title={
								list.isFiltered
									? "Aucun article ne correspond"
									: "Aucun point de stock"
							}
							description={
								list.isFiltered
									? "Modifiez ou réinitialisez les filtres."
									: "Les points de stock sont créés avec les produits."
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

			<AdjustStockDialog row={adjusting} onClose={() => setAdjusting(null)} />
		</>
	);
};

/** `useSearchParams` impose une frontière de suspension au rendu statique. */
const StocksPage = () => (
	<Suspense fallback={<Spinner />}>
		<StocksContent />
	</Suspense>
);

export default StocksPage;
