"use client";

import type { Dashboard } from "@prettyfull/contracts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
import {
	ORDER_STATUS_LABELS,
	formatMoney,
	formatNumber,
	formatPercent,
	formatRelative,
} from "@/lib/format";
import { PageHeader } from "@/components/layout/page-header";
import { RevenueChart } from "@/components/charts/revenue-chart";
import {
	Badge,
	Card,
	CardHeader,
	ErrorState,
	Select,
	Skeleton,
	orderStatusTone,
} from "@/components/ui/primitives";
import { Thumb } from "@/components/ui/table";

/** Tableau de bord (§4.1). */

const PERIODS = [
	{ value: "7", label: "7 derniers jours" },
	{ value: "30", label: "30 derniers jours" },
	{ value: "90", label: "90 derniers jours" },
];

/**
 * Tuile de statistique.
 *
 * La variation porte une couleur *et* un signe : sur un écran monochrome ou en
 * vision déficiente, la couleur seule ne dirait rien. Le chiffre principal
 * garde les chiffres proportionnels - `tabular-nums` desserre les grands
 * nombres et n'a d'intérêt qu'en colonne.
 */
const StatTile = ({
	label,
	value,
	change,
	comparison,
	/** `false` quand une hausse est une mauvaise nouvelle (ruptures de stock). */
	upIsGood = true,
}: {
	label: string;
	value: string;
	change?: number | null;
	comparison?: string;
	upIsGood?: boolean;
}) => {
	const good =
		change === null || change === undefined ? null : change >= 0 === upIsGood;

	return (
		<Card className="p-4">
			<p className="text-[12px] text-muted">{label}</p>
			<p className="mt-1 text-2xl font-semibold tracking-tight text-ink">
				{value}
			</p>

			{change !== undefined && (
				<p className="mt-1.5 flex items-center gap-1.5 text-[12px]">
					<span
						style={{
							color:
								good === null
									? "var(--text-subtle)"
									: good
										? "var(--chart-positive)"
										: "var(--chart-negative)",
						}}
						className="font-medium"
					>
						{formatPercent(change ?? null)}
					</span>
					{comparison && <span className="text-subtle">{comparison}</span>}
				</p>
			)}
		</Card>
	);
};

const DashboardPage = () => {
	const [period, setPeriod] = useState("30");

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["dashboard", period],
		queryFn: () => api.get<Dashboard>(`/api/admin/dashboard?period=${period}`),
	});

	if (error) {
		return (
			<>
				<PageHeader title="Tableau de bord" />
				<Card>
					<ErrorState
						message={
							error instanceof Error ? error.message : "Chargement impossible."
						}
						retry={() => void refetch()}
					/>
				</Card>
			</>
		);
	}

	const comparison = `vs ${period} jours précédents`;

	return (
		<>
			<PageHeader
				title="Tableau de bord"
				description="Activité de la boutique et alertes à traiter."
				actions={
					<Select
						value={period}
						onChange={(event) => setPeriod(event.target.value)}
						options={PERIODS}
						aria-label="Période d'analyse"
						className="w-48"
					/>
				}
			/>

			{isLoading || !data ? (
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{Array.from({ length: 4 }, (_, index) => (
						<Skeleton key={index} className="h-[104px]" />
					))}
				</div>
			) : (
				<>
					<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<StatTile
							label="Chiffre d'affaires"
							value={formatMoney(data.revenue.value, data.currency)}
							change={data.revenue.changePercent}
							comparison={comparison}
						/>
						<StatTile
							label="Commandes"
							value={formatNumber(data.orderCount.value)}
							change={data.orderCount.changePercent}
							comparison={comparison}
						/>
						<StatTile
							label="Panier moyen"
							value={formatMoney(data.averageOrderValue.value, data.currency)}
							change={data.averageOrderValue.changePercent}
							comparison={comparison}
						/>
						<StatTile
							label="Nouvelles clientes"
							value={formatNumber(data.newCustomers.value)}
							change={data.newCustomers.changePercent}
							comparison={comparison}
						/>
					</div>

					<div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						<StatTile
							label="Commandes aujourd'hui"
							value={formatNumber(data.ordersToday)}
						/>
						<StatTile
							label="CA aujourd'hui"
							value={formatMoney(data.revenueToday, data.currency)}
						/>
						<StatTile
							label="Commandes à traiter"
							value={formatNumber(data.pendingOrders)}
						/>
						<StatTile
							label="Ruptures de stock"
							value={formatNumber(data.outOfStockCount)}
							upIsGood={false}
						/>
					</div>

					<Card className="mt-4">
						<CardHeader
							title="Chiffre d'affaires quotidien"
							description="Commandes payées uniquement. Survolez un jour pour le détail."
						/>
						<div className="p-4">
							<RevenueChart
								series={data.revenueSeries}
								currency={data.currency}
							/>
						</div>
					</Card>

					<div className="mt-4 grid gap-4 lg:grid-cols-2">
						<Card>
							<CardHeader
								title="Dernières commandes"
								action={
									<Link
										href="/commandes"
										className="text-[13px] text-muted transition-colors hover:text-ink"
									>
										Tout voir
									</Link>
								}
							/>
							{data.recentOrders.length === 0 ? (
								<p className="px-4 py-8 text-center text-[13px] text-muted">
									Aucune commande pour le moment.
								</p>
							) : (
								<ul className="divide-y divide-[var(--border)]">
									{data.recentOrders.map((order) => (
										<li key={order.id}>
											<Link
												href={`/commandes/${order.id}`}
												className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-sunken"
											>
												<span className="w-14 shrink-0 text-[13px] font-medium text-ink tabular">
													#{order.displayId}
												</span>
												<span className="min-w-0 flex-1 truncate text-[13px] text-muted">
													{order.customerName ?? order.email}
												</span>
												<Badge tone={orderStatusTone(order.status)}>
													{ORDER_STATUS_LABELS[order.status]}
												</Badge>
												<span className="w-24 shrink-0 text-right text-[13px] text-ink tabular">
													{formatMoney(order.total, order.currency)}
												</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</Card>

						<Card>
							<CardHeader
								title="Alertes de stock"
								description={`${data.lowStockCount} article(s) sous le seuil, ${data.outOfStockCount} en rupture.`}
								action={
									<Link
										href="/stocks?lowStockOnly=true"
										className="text-[13px] text-muted transition-colors hover:text-ink"
									>
										Gérer
									</Link>
								}
							/>
							{data.lowStockAlerts.length === 0 ? (
								<p className="px-4 py-8 text-center text-[13px] text-muted">
									Aucune alerte. Tous les stocks sont au-dessus de leur seuil.
								</p>
							) : (
								<ul className="divide-y divide-[var(--border)]">
									{data.lowStockAlerts.map((alert) => (
										<li
											key={alert.inventoryItemId}
											className="flex items-center gap-3 px-4 py-2.5"
										>
											<span className="min-w-0 flex-1">
												<span className="block truncate text-[13px] text-ink">
													{alert.productName}
												</span>
												{(alert.variantName || alert.sizeLabel) && (
													<span className="block truncate text-[12px] text-subtle">
														{[alert.variantName, alert.sizeLabel]
															.filter(Boolean)
															.join(" · ")}
													</span>
												)}
											</span>
											<Badge
												tone={
													alert.availableQuantity <= 0 ? "danger" : "warning"
												}
											>
												{alert.availableQuantity <= 0
													? "Rupture"
													: `${alert.availableQuantity} restant(s)`}
											</Badge>
										</li>
									))}
								</ul>
							)}
						</Card>
					</div>

					{data.topProducts.length > 0 && (
						<Card className="mt-4">
							<CardHeader
								title="Meilleures ventes"
								description={`Sur les ${period} derniers jours.`}
							/>
							<ul className="divide-y divide-[var(--border)]">
								{data.topProducts.map((product) => (
									<li
										key={product.productId}
										className="flex items-center gap-3 px-4 py-2.5"
									>
										<Thumb src={product.thumbnail} alt={product.name} />
										<span className="min-w-0 flex-1 truncate text-[13px] text-ink">
											{product.name}
										</span>
										<span className="shrink-0 text-[13px] text-muted tabular">
											{formatNumber(product.unitsSold)} vendus
										</span>
										<span className="w-28 shrink-0 text-right text-[13px] font-medium text-ink tabular">
											{formatMoney(product.revenue, data.currency)}
										</span>
									</li>
								))}
							</ul>
						</Card>
					)}

					{data.recentOrders[0] && (
						<p className="mt-4 text-center text-[12px] text-subtle">
							Dernière commande {formatRelative(data.recentOrders[0].createdAt)}
							.
						</p>
					)}
				</>
			)}
		</>
	);
};

export default DashboardPage;
