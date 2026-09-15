import { z } from "zod";
import { ORDER_STATUSES } from "./enums.js";
/**
 * Une ligne cible un point de stock : le produit suffit pour un produit sans
 * déclinaison, sinon il faut la variante et/ou la taille (§2.3).
 */
export declare const cartLineSelectorSchema: z.ZodObject<{
    productId: z.ZodUUID;
    variantId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    sizeId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
}, z.core.$strip>;
export declare const addCartItemSchema: z.ZodObject<{
    productId: z.ZodUUID;
    variantId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    sizeId: z.ZodOptional<z.ZodNullable<z.ZodUUID>>;
    quantity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const updateCartItemSchema: z.ZodObject<{
    quantity: z.ZodNumber;
}, z.core.$strip>;
export declare const cartItemSchema: z.ZodObject<{
    id: z.ZodUUID;
    productId: z.ZodUUID;
    variantId: z.ZodNullable<z.ZodUUID>;
    sizeId: z.ZodNullable<z.ZodUUID>;
    inventoryItemId: z.ZodUUID;
    productName: z.ZodString;
    productSlug: z.ZodString;
    variantName: z.ZodNullable<z.ZodString>;
    sizeLabel: z.ZodNullable<z.ZodString>;
    sku: z.ZodNullable<z.ZodString>;
    thumbnail: z.ZodNullable<z.ZodString>;
    unitPrice: z.ZodNumber;
    quantity: z.ZodNumber;
    lineTotal: z.ZodNumber;
    availableQuantity: z.ZodNumber;
}, z.core.$strip>;
export type CartItem = z.infer<typeof cartItemSchema>;
export declare const cartSchema: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodNullable<z.ZodUUID>;
    email: z.ZodNullable<z.ZodString>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        productId: z.ZodUUID;
        variantId: z.ZodNullable<z.ZodUUID>;
        sizeId: z.ZodNullable<z.ZodUUID>;
        inventoryItemId: z.ZodUUID;
        productName: z.ZodString;
        productSlug: z.ZodString;
        variantName: z.ZodNullable<z.ZodString>;
        sizeLabel: z.ZodNullable<z.ZodString>;
        sku: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        unitPrice: z.ZodNumber;
        quantity: z.ZodNumber;
        lineTotal: z.ZodNumber;
        availableQuantity: z.ZodNumber;
    }, z.core.$strip>>;
    shippingAddress: z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodOptional<z.ZodString>;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodOptional<z.ZodBoolean>;
        isDefaultBilling: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    billingAddress: z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodOptional<z.ZodString>;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodOptional<z.ZodBoolean>;
        isDefaultBilling: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    shippingRateId: z.ZodNullable<z.ZodUUID>;
    subtotal: z.ZodNumber;
    shippingTotal: z.ZodNumber;
    taxTotal: z.ZodNumber;
    discountTotal: z.ZodNumber;
    discountCode: z.ZodNullable<z.ZodString>;
    total: z.ZodNumber;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Cart = z.infer<typeof cartSchema>;
export declare const checkoutSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodEmail>;
    phone: z.ZodOptional<z.ZodString>;
    shippingAddress: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodString;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodString;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodString;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodDefault<z.ZodBoolean>;
        isDefaultBilling: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
    billingAddress: z.ZodOptional<z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodString;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodString;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodString;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodDefault<z.ZodBoolean>;
        isDefaultBilling: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    shippingRateId: z.ZodUUID;
    paymentProviderKey: z.ZodString;
    note: z.ZodOptional<z.ZodString>;
    returnUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
/** Réponse de passage de commande : `redirectUrl` si le PSP l'exige. */
export declare const checkoutResultSchema: z.ZodObject<{
    orderId: z.ZodUUID;
    displayId: z.ZodNumber;
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
    paymentStatus: z.ZodEnum<{
        paid: "paid";
        cancelled: "cancelled";
        refunded: "refunded";
        pending: "pending";
        authorized: "authorized";
        failed: "failed";
        partially_refunded: "partially_refunded";
    }>;
    redirectUrl: z.ZodNullable<z.ZodString>;
    transactionId: z.ZodNullable<z.ZodUUID>;
}, z.core.$strip>;
/**
 * Ligne de commande. Tous les libellés et le prix sont figés à l'achat
 * (§2.4 « snapshot »), donc indépendants des modifications ultérieures du
 * catalogue. Les identifiants ne servent qu'aux liens du back-office.
 */
export declare const orderItemSchema: z.ZodObject<{
    id: z.ZodUUID;
    productId: z.ZodNullable<z.ZodUUID>;
    variantId: z.ZodNullable<z.ZodUUID>;
    sizeId: z.ZodNullable<z.ZodUUID>;
    productName: z.ZodString;
    productSlug: z.ZodNullable<z.ZodString>;
    variantName: z.ZodNullable<z.ZodString>;
    sizeLabel: z.ZodNullable<z.ZodString>;
    sku: z.ZodNullable<z.ZodString>;
    thumbnail: z.ZodNullable<z.ZodString>;
    unitPrice: z.ZodNumber;
    quantity: z.ZodNumber;
    lineTotal: z.ZodNumber;
    refundedQuantity: z.ZodNumber;
}, z.core.$strip>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export declare const orderStatusHistorySchema: z.ZodObject<{
    id: z.ZodUUID;
    fromStatus: z.ZodNullable<z.ZodEnum<{
        pending_payment: "pending_payment";
        paid: "paid";
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
        refunded: "refunded";
        disputed: "disputed";
    }>>;
    toStatus: z.ZodEnum<{
        pending_payment: "pending_payment";
        paid: "paid";
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
        refunded: "refunded";
        disputed: "disputed";
    }>;
    comment: z.ZodNullable<z.ZodString>;
    userId: z.ZodNullable<z.ZodUUID>;
    userName: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
}, z.core.$strip>;
export declare const transactionSchema: z.ZodObject<{
    id: z.ZodUUID;
    orderId: z.ZodUUID;
    providerKey: z.ZodString;
    providerTransactionId: z.ZodNullable<z.ZodString>;
    kind: z.ZodEnum<{
        payment: "payment";
        refund: "refund";
    }>;
    status: z.ZodEnum<{
        cancelled: "cancelled";
        pending: "pending";
        failed: "failed";
        success: "success";
    }>;
    amount: z.ZodNumber;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    errorMessage: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Transaction = z.infer<typeof transactionSchema>;
export declare const orderSchema: z.ZodObject<{
    id: z.ZodUUID;
    displayId: z.ZodNumber;
    userId: z.ZodNullable<z.ZodUUID>;
    email: z.ZodString;
    phone: z.ZodNullable<z.ZodString>;
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
    paymentStatus: z.ZodEnum<{
        paid: "paid";
        cancelled: "cancelled";
        refunded: "refunded";
        pending: "pending";
        authorized: "authorized";
        failed: "failed";
        partially_refunded: "partially_refunded";
    }>;
    fulfillmentStatus: z.ZodEnum<{
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        not_fulfilled: "not_fulfilled";
        returned: "returned";
    }>;
    currency: z.ZodEnum<{
        xof: "xof";
        eur: "eur";
        usd: "usd";
    }>;
    items: z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        productId: z.ZodNullable<z.ZodUUID>;
        variantId: z.ZodNullable<z.ZodUUID>;
        sizeId: z.ZodNullable<z.ZodUUID>;
        productName: z.ZodString;
        productSlug: z.ZodNullable<z.ZodString>;
        variantName: z.ZodNullable<z.ZodString>;
        sizeLabel: z.ZodNullable<z.ZodString>;
        sku: z.ZodNullable<z.ZodString>;
        thumbnail: z.ZodNullable<z.ZodString>;
        unitPrice: z.ZodNumber;
        quantity: z.ZodNumber;
        lineTotal: z.ZodNumber;
        refundedQuantity: z.ZodNumber;
    }, z.core.$strip>>;
    shippingAddress: z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodOptional<z.ZodString>;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodOptional<z.ZodBoolean>;
        isDefaultBilling: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
    billingAddress: z.ZodNullable<z.ZodObject<{
        id: z.ZodOptional<z.ZodUUID>;
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address1: z.ZodOptional<z.ZodString>;
        address2: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodOptional<z.ZodString>;
        postalCode: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        province: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        countryCode: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        isDefaultShipping: z.ZodOptional<z.ZodBoolean>;
        isDefaultBilling: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    shippingMethod: z.ZodNullable<z.ZodObject<{
        rateId: z.ZodNullable<z.ZodUUID>;
        providerKey: z.ZodNullable<z.ZodString>;
        name: z.ZodString;
        amount: z.ZodNumber;
    }, z.core.$strip>>;
    trackingNumber: z.ZodNullable<z.ZodString>;
    trackingUrl: z.ZodNullable<z.ZodString>;
    carrier: z.ZodNullable<z.ZodString>;
    subtotal: z.ZodNumber;
    shippingTotal: z.ZodNumber;
    taxTotal: z.ZodNumber;
    discountTotal: z.ZodNumber;
    discountCode: z.ZodNullable<z.ZodString>;
    total: z.ZodNumber;
    refundedTotal: z.ZodNumber;
    note: z.ZodNullable<z.ZodString>;
    placedAt: z.ZodString;
    paidAt: z.ZodNullable<z.ZodString>;
    shippedAt: z.ZodNullable<z.ZodString>;
    deliveredAt: z.ZodNullable<z.ZodString>;
    cancelledAt: z.ZodNullable<z.ZodString>;
    statusHistory: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        fromStatus: z.ZodNullable<z.ZodEnum<{
            pending_payment: "pending_payment";
            paid: "paid";
            preparing: "preparing";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
            refunded: "refunded";
            disputed: "disputed";
        }>>;
        toStatus: z.ZodEnum<{
            pending_payment: "pending_payment";
            paid: "paid";
            preparing: "preparing";
            shipped: "shipped";
            delivered: "delivered";
            cancelled: "cancelled";
            refunded: "refunded";
            disputed: "disputed";
        }>;
        comment: z.ZodNullable<z.ZodString>;
        userId: z.ZodNullable<z.ZodUUID>;
        userName: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
    }, z.core.$strip>>>;
    transactions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        orderId: z.ZodUUID;
        providerKey: z.ZodString;
        providerTransactionId: z.ZodNullable<z.ZodString>;
        kind: z.ZodEnum<{
            payment: "payment";
            refund: "refund";
        }>;
        status: z.ZodEnum<{
            cancelled: "cancelled";
            pending: "pending";
            failed: "failed";
            success: "success";
        }>;
        amount: z.ZodNumber;
        currency: z.ZodEnum<{
            xof: "xof";
            eur: "eur";
            usd: "usd";
        }>;
        errorMessage: z.ZodNullable<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, z.core.$strip>>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export type Order = z.infer<typeof orderSchema>;
export declare const updateOrderStatusSchema: z.ZodObject<{
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
    comment: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateFulfillmentSchema: z.ZodObject<{
    fulfillmentStatus: z.ZodOptional<z.ZodEnum<{
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        not_fulfilled: "not_fulfilled";
        returned: "returned";
    }>>;
    trackingNumber: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    trackingUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    carrier: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
/**
 * Remboursement total ou partiel (§2.4). Sans `items`, le montant est
 * remboursé globalement ; avec `items`, le stock des lignes concernées est
 * réincrémenté.
 */
export declare const refundOrderSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    reason: z.ZodString;
    items: z.ZodOptional<z.ZodArray<z.ZodObject<{
        orderItemId: z.ZodUUID;
        quantity: z.ZodNumber;
    }, z.core.$strip>>>;
    restock: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const orderListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    sort: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodEnum<{
        asc: "asc";
        desc: "desc";
    }>>;
    q: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        pending_payment: "pending_payment";
        paid: "paid";
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        cancelled: "cancelled";
        refunded: "refunded";
        disputed: "disputed";
    }>>;
    paymentStatus: z.ZodOptional<z.ZodEnum<{
        paid: "paid";
        cancelled: "cancelled";
        refunded: "refunded";
        pending: "pending";
        authorized: "authorized";
        failed: "failed";
        partially_refunded: "partially_refunded";
    }>>;
    fulfillmentStatus: z.ZodOptional<z.ZodEnum<{
        preparing: "preparing";
        shipped: "shipped";
        delivered: "delivered";
        not_fulfilled: "not_fulfilled";
        returned: "returned";
    }>>;
    userId: z.ZodOptional<z.ZodUUID>;
    email: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodISODateTime>;
    to: z.ZodOptional<z.ZodISODateTime>;
    minTotal: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    maxTotal: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
/**
 * Transitions autorisées du cycle de vie (§2.4). Toute autre transition est
 * refusée par le service : c'est ce qui empêche, par exemple, de rembourser
 * une commande jamais payée.
 */
export declare const ORDER_STATUS_TRANSITIONS: Record<(typeof ORDER_STATUSES)[number], readonly (typeof ORDER_STATUSES)[number][]>;
export declare const canTransitionOrder: (from: (typeof ORDER_STATUSES)[number], to: (typeof ORDER_STATUSES)[number]) => boolean;
//# sourceMappingURL=orders.d.ts.map