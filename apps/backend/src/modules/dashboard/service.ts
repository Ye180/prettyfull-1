import type { Dashboard } from "@prettyfull/contracts";
import { and, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { listLowStockAlerts } from "../inventory/service.js";
import { getStoreSettings } from "../settings/service.js";

/**
 * Tableau de bord (§4.1).
 *
 * Ne comptabilise que les commandes **payées** : intégrer les paniers en
 * attente de paiement gonflerait artificiellement le chiffre d'affaires, et
 * une bonne part n'aboutira jamais.
 */

/** Variation en pourcentage ; `null` quand la période précédente est vide. */
const changePercent = (value: number, previous: number): number | null => {
	if (previous === 0) return null;
	return Math.round(((value - previous) / previous) * 1000) / 10;
};

const REVENUE_STATUSES = ["paid", "preparing", "shipped", "delivered"] as const;

export const getDashboard = async (periodDays: number): Promise<Dashboard> => {
	const settings = await getStoreSettings();

	const now = new Date();
	const periodStart = new Date(now.getTime() - periodDays * 86_400_000);
	const previousStart = new Date(now.getTime() - periodDays * 2 * 86_400_000);
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	const paidOrders = inArray(t.orders.status, [...REVENUE_STATUSES]);

	const [
		[currentPeriod],
		[previousPeriod],
		[today],
		[newCustomers],
		[previousCustomers],
		[pending],
		[stockCounts],
		series,
		recentOrders,
		lowStockAlerts,
		topProducts,
	] = await Promise.all([
		db
			.select({
				revenue: sql<number>`coalesce(sum(${t.orders.total} - ${t.orders.refundedTotal}), 0)::int`,
				orders: count(),
			})
			.from(t.orders)
			.where(and(paidOrders, gte(t.orders.createdAt, periodStart))),

		db
			.select({
				revenue: sql<number>`coalesce(sum(${t.orders.total} - ${t.orders.refundedTotal}), 0)::int`,
				orders: count(),
			})
			.from(t.orders)
			.where(
				and(paidOrders, gte(t.orders.createdAt, previousStart), lt(t.orders.createdAt, periodStart)),
			),

		db
			.select({
				revenue: sql<number>`coalesce(sum(${t.orders.total} - ${t.orders.refundedTotal}), 0)::int`,
				orders: count(),
			})
			.from(t.orders)
			.where(and(paidOrders, gte(t.orders.createdAt, todayStart))),

		db
			.select({ total: count() })
			.from(t.users)
			.where(and(eq(t.users.kind, "customer"), gte(t.users.createdAt, periodStart))),

		db
			.select({ total: count() })
			.from(t.users)
			.where(
				and(
					eq(t.users.kind, "customer"),
					gte(t.users.createdAt, previousStart),
					lt(t.users.createdAt, periodStart),
				),
			),

		db
			.select({ total: count() })
			.from(t.orders)
			.where(inArray(t.orders.status, ["pending_payment", "paid", "preparing"])),

		db
			.select({
				low: sql<number>`count(*) filter (
					where ${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity} > 0
					  and ${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity} <= ${t.inventoryItems.lowStockThreshold}
				)::int`,
				out: sql<number>`count(*) filter (
					where ${t.inventoryItems.quantity} - ${t.inventoryItems.reservedQuantity} <= 0
				)::int`,
			})
			.from(t.inventoryItems)
			.innerJoin(t.products, eq(t.products.id, t.inventoryItems.productId))
			.where(eq(t.products.status, "published")),

		// Série journalière : `generate_series` produit aussi les jours sans
		// commande, sinon le graphique afficherait des trous.
		//
		// Les bornes sont passées en chaînes ISO : `db.execute` transmet les
		// paramètres bruts au pilote, qui refuse un objet `Date` — contrairement
		// au constructeur de requêtes, qui les sérialise lui-même.
		db.execute<{ date: string; revenue: number; orders: number }>(sql`
			select
				to_char(day, 'YYYY-MM-DD') as date,
				coalesce(sum(o.total - o.refunded_total), 0)::int as revenue,
				count(o.id)::int as orders
			from generate_series(
				${periodStart.toISOString()}::date,
				${now.toISOString()}::date,
				'1 day'
			) as day
			left join ${t.orders} o
				on o.created_at::date = day
			   and o.status in ('paid', 'preparing', 'shipped', 'delivered')
			group by day
			order by day
		`),

		db
			.select({
				id: t.orders.id,
				displayId: t.orders.displayId,
				email: t.orders.email,
				customerName: sql<
					string | null
				>`nullif(trim(coalesce(${t.users.firstName}, '') || ' ' || coalesce(${t.users.lastName}, '')), '')`,
				status: t.orders.status,
				total: t.orders.total,
				currency: t.orders.currency,
				createdAt: t.orders.createdAt,
			})
			.from(t.orders)
			.leftJoin(t.users, eq(t.users.id, t.orders.userId))
			.orderBy(desc(t.orders.createdAt))
			.limit(8),

		listLowStockAlerts(8),

		db
			.select({
				productId: t.orderItems.productId,
				name: sql<string>`max(${t.orderItems.productName})`,
				thumbnail: sql<string | null>`max(${t.orderItems.thumbnail})`,
				unitsSold: sql<number>`sum(${t.orderItems.quantity})::int`,
				revenue: sql<number>`sum(${t.orderItems.lineTotal})::int`,
			})
			.from(t.orderItems)
			.innerJoin(t.orders, eq(t.orders.id, t.orderItems.orderId))
			.where(and(paidOrders, gte(t.orders.createdAt, periodStart)))
			.groupBy(t.orderItems.productId)
			.orderBy(desc(sql`sum(${t.orderItems.lineTotal})`))
			.limit(5),
	]);

	const revenue = currentPeriod?.revenue ?? 0;
	const previousRevenue = previousPeriod?.revenue ?? 0;
	const orderCount = currentPeriod?.orders ?? 0;
	const previousOrderCount = previousPeriod?.orders ?? 0;

	const averageOrderValue = orderCount > 0 ? Math.round(revenue / orderCount) : 0;
	const previousAverage =
		previousOrderCount > 0 ? Math.round(previousRevenue / previousOrderCount) : 0;

	return {
		currency: settings.defaultCurrency,
		revenue: {
			value: revenue,
			previousValue: previousRevenue,
			changePercent: changePercent(revenue, previousRevenue),
		},
		orderCount: {
			value: orderCount,
			previousValue: previousOrderCount,
			changePercent: changePercent(orderCount, previousOrderCount),
		},
		averageOrderValue: {
			value: averageOrderValue,
			previousValue: previousAverage,
			changePercent: changePercent(averageOrderValue, previousAverage),
		},
		newCustomers: {
			value: newCustomers?.total ?? 0,
			previousValue: previousCustomers?.total ?? 0,
			changePercent: changePercent(newCustomers?.total ?? 0, previousCustomers?.total ?? 0),
		},
		ordersToday: today?.orders ?? 0,
		revenueToday: today?.revenue ?? 0,
		pendingOrders: pending?.total ?? 0,
		lowStockCount: stockCounts?.low ?? 0,
		outOfStockCount: stockCounts?.out ?? 0,
		revenueSeries: [...series].map((row) => ({
			date: row.date,
			revenue: row.revenue,
			orders: row.orders,
		})),
		recentOrders: recentOrders.map((row) => ({
			id: row.id,
			displayId: row.displayId,
			email: row.email,
			customerName: row.customerName,
			status: row.status,
			total: row.total,
			currency: row.currency,
			createdAt: row.createdAt.toISOString(),
		})),
		lowStockAlerts: lowStockAlerts.map((row) => ({
			inventoryItemId: row.inventoryItemId,
			productId: row.productId,
			productName: row.productName,
			variantName: row.variantName,
			sizeLabel: row.sizeLabel,
			availableQuantity: row.availableQuantity,
			lowStockThreshold: row.lowStockThreshold,
		})),
		topProducts: topProducts.flatMap((row) =>
			row.productId
				? [
						{
							productId: row.productId,
							name: row.name,
							thumbnail: row.thumbnail,
							unitsSold: row.unitsSold,
							revenue: row.revenue,
						},
					]
				: [],
		),
	};
};
