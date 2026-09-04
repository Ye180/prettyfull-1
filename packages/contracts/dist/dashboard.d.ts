import { z } from "zod";
/** Données du tableau de bord (§4.1). */
export declare const dashboardQuerySchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const dashboardSchema: z.ZodObject<{
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    revenue: z.ZodObject<{
        value: z.ZodNumber;
        previousValue: z.ZodNumber;
        changePercent: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>;
    orderCount: z.ZodObject<{
        value: z.ZodNumber;
        previousValue: z.ZodNumber;
        changePercent: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>;
    averageOrderValue: z.ZodObject<{
        value: z.ZodNumber;
        previousValue: z.ZodNumber;
        changePercent: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>;
    newCustomers: z.ZodObject<{
        value: z.ZodNumber;
        previousValue: z.ZodNumber;
        changePercent: z.ZodNullable<z.ZodNumber>;
    }, z.core.$strip>;
    ordersToday: z.ZodNumber;
    revenueToday: z.ZodNumber;
    pendingOrders: z.ZodNumber;
    lowStockCount: z.ZodNumber;
    outOfStockCount: z.ZodNumber;
    revenueSeries: z.ZodArray<z.ZodObject<{
        date: z.ZodString;
        revenue: z.ZodNumber;
        orders: z.ZodNumber;
    }, z.core.$strip>>;
    recentOrders: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        displayId: z.ZodNumber;
        email: z.ZodString;
        customerName: z.ZodNullable<z.ZodString>;
        status: z.ZodEnum<{
            pending_payment: "pending_payment";
            paid: "paid";
            preparing: "preparing";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
            refunded: "refunded";
            disputed: "disputed";
        }>;
        total: z.ZodNumber;
        currency: z.ZodEnum<{
            xof: "xof";
            eur: "eur";
            usd: "usd";
        }>;
        createdAt: z.ZodString;
    }, z.core.$strip>>;
    lowStockAlerts: z.ZodArray<z.ZodObject<{
        inventoryItemId: z.ZodUUID;
        productId: z.ZodUUID;
        productName: z.ZodString;
        variantName: z.ZodNullable<z.ZodString>;
        sizeLabel: z.ZodNullable<z.ZodString>;
        availableQuantity: z.ZodNumber;
        lowStockThreshold: z.ZodNumber;
    }, z.core.$strip>>;
    topProducts: z.ZodArray<z.ZodObject<{
        productId: z.ZodUUID;
        name: z.ZodString;
        thumbnail: z.ZodNullable<z.ZodString>;
        unitsSold: z.ZodNumber;
        revenue: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type Dashboard = z.infer<typeof dashboardSchema>;
//# sourceMappingURL=dashboard.d.ts.map