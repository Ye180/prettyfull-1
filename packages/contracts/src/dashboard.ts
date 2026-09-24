import { z } from "zod";
import { currencySchema, moneySchema, uuidSchema } from "./common.js";
import { ORDER_STATUSES } from "./enums.js";

/** Données du tableau de bord (§4.1). */
export const dashboardQuerySchema = z.object({
	/** Fenêtre d'analyse en jours, comparée à la période précédente. */
	period: z.coerce.number().int().min(1).max(365).default(30),
});

const metricSchema = z.object({
	value: z.number(),
	previousValue: z.number(),
	/** Variation en pourcentage ; `null` quand la période précédente est vide. */
	changePercent: z.number().nullable(),
});

export const dashboardSchema = z.object({
	currency: currencySchema,
	revenue: metricSchema,
	orderCount: metricSchema,
	averageOrderValue: metricSchema,
	newCustomers: metricSchema,
	ordersToday: z.number().int(),
	revenueToday: moneySchema,
	pendingOrders: z.number().int(),
	lowStockCount: z.number().int(),
	outOfStockCount: z.number().int(),
	/** Série journalière pour le graphique de chiffre d'affaires. */
	revenueSeries: z.array(
		z.object({ date: z.string(), revenue: moneySchema, orders: z.number().int() }),
	),
	recentOrders: z.array(
		z.object({
			id: uuidSchema,
			displayId: z.number().int(),
			email: z.string(),
			customerName: z.string().nullable(),
			status: z.enum(ORDER_STATUSES),
			total: moneySchema,
			currency: currencySchema,
			createdAt: z.string(),
		}),
	),
	lowStockAlerts: z.array(
		z.object({
			inventoryItemId: uuidSchema,
			productId: uuidSchema,
			productName: z.string(),
			variantName: z.string().nullable(),
			sizeLabel: z.string().nullable(),
			availableQuantity: z.number().int(),
			lowStockThreshold: z.number().int(),
		}),
	),
	topProducts: z.array(
		z.object({
			productId: uuidSchema,
			name: z.string(),
			thumbnail: z.string().nullable(),
			unitsSold: z.number().int(),
			revenue: moneySchema,
		}),
	),
});

export type Dashboard = z.infer<typeof dashboardSchema>;
