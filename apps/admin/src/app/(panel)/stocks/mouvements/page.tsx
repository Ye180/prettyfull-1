"use client";

import type { Paginated, StockMovement } from "@prettyfull/contracts";
import { STOCK_MOVEMENT_REASONS } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import { api, toQueryString } from "@/lib/api";
import { STOCK_REASON_LABELS, formatDateTime } from "@/lib/format";
import { useListQuery } from "@/lib/use-list-query";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar, FilterSelect } from "@/components/ui/filters";
import { DataTable, Pagination, type Column } from "@/components/ui/table";
import { Badge, Button, Card, EmptyState } from "@/components/ui/primitives";

/**
 * Journal d'audit des mouvements de stock (§2.3).
 *
 * En lecture seule : rien dans l'interface ne permet de modifier ni de purger
 * une ligne, c'est ce qui lui donne sa valeur de preuve.
 */
const MovementsPage = () => {
	const list = useListQuery({ reason: "", productId: "" }, 30);

	const { data, isLoading } = useQuery({
		queryKey: ["movements", list.params],
		queryFn: () =>
			api.get<Paginated<StockMovement>>(
				`/api/admin/inventory/movements${toQueryString(list.params)}`,
			),
	});

	const columns: Column<StockMovement>[] = [
		{
			key: "date",
			header: "Date",
			cell: (movement) => (
				<span className="whitespace-nowrap text-muted tabular">
					{formatDateTime(movement.createdAt)}
				</span>
			),
		},
		{
			key: "reason",
			header: "Motif",
			cell: (movement) => (
				<Badge
					tone={
						movement.direction === "in"
							? "success"
							: movement.reason === "damage"
								? "danger"
								: "neutral"
					}
				>
					{STOCK_REASON_LABELS[movement.reason] ?? movement.reason}
				</Badge>
			),
		},
		{
			key: "quantity",
			header: "Variation",
			align: "right",
			cell: (movement) => (
				<span
					className="font-medium"
					style={{
						color:
							movement.direction === "in"
								? "var(--chart-positive)"
								: "var(--chart-negative)",
					}}
				>
					{movement.direction === "in" ? "+" : "−"}
					{movement.quantity}
				</span>
			),
		},
		{
			key: "levels",
			header: "Avant → après",
			align: "right",
			hideOnMobile: true,
			cell: (movement) => (
				<span className="text-muted tabular">
					{movement.quantityBefore} → {movement.quantityAfter}
				</span>
			),
		},
		{
			key: "author",
			header: "Auteur",
			hideOnMobile: true,
			cell: (movement) => (
				<span className="text-muted">
					{movement.userName ?? (movement.orderId ? "Commande" : "Système")}
				</span>
			),
		},
		{
			key: "note",
			header: "Note",
			hideOnMobile: true,
			cell: (movement) => (
				<span className="text-[12px] text-subtle">{movement.note ?? "—"}</span>
			),
		},
	];

	return (
		<>
			<PageHeader
				title="Historique des mouvements"
				description="Chaque variation de stock, avec son motif et son auteur. Journal non modifiable."
				backHref="/stocks"
				backLabel="Stocks"
			/>

			<Card>
				<FilterBar onReset={list.reset} showReset={list.isFiltered}>
					<FilterSelect
						label="Motif"
						placeholder="Tous les motifs"
						value={list.filters.reason}
						onChange={(value) => list.setFilter("reason", value)}
						options={STOCK_MOVEMENT_REASONS.map((value) => ({
							value,
							label: STOCK_REASON_LABELS[value] ?? value,
						}))}
					/>
				</FilterBar>

				<DataTable
					columns={columns}
					rows={data?.data ?? []}
					rowKey={(movement) => movement.id}
					loading={isLoading}
					empty={
						<EmptyState
							title="Aucun mouvement"
							description={
								list.isFiltered
									? "Aucun mouvement ne correspond à ce motif."
									: "Les mouvements apparaîtront ici dès le premier ajustement ou la première vente."
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
		</>
	);
};

export default MovementsPage;
