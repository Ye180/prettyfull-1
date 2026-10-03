import { PERMISSIONS, cancelOrderSchema, orderListQuerySchema, paginationQuerySchema, refundOrderSchema, updateFulfillmentSchema, updateOrderStatusSchema, } from "@prettyfull/contracts";
import { Hono } from "hono";
import { z } from "zod";
import { recordAudit } from "../../lib/audit.js";
import { currentUser, requireAuth, requireKind, requirePermission } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import * as service from "./service.js";
import { renderInvoice } from "./invoice.js";
const idParam = z.object({ id: z.uuid() });
/** Module « Commandes » du back-office (§4.4). */
export const adminOrdersRoutes = new Hono();
adminOrdersRoutes.get("/orders", requirePermission(PERMISSIONS.orders.read), validate("query", orderListQuerySchema), async (c) => c.json(await service.listOrders(c.req.valid("query"))));
adminOrdersRoutes.get("/orders/:id", requirePermission(PERMISSIONS.orders.read), validate("param", idParam), async (c) => c.json(await service.getOrder(c.req.valid("param").id)));
/** Facture au format HTML, imprimable en PDF depuis le navigateur (§2.4). */
adminOrdersRoutes.get("/orders/:id/invoice", requirePermission(PERMISSIONS.orders.read), validate("param", idParam), async (c) => {
    const order = await service.getOrder(c.req.valid("param").id);
    c.header("Content-Type", "text/html; charset=utf-8");
    return c.body(await renderInvoice(order));
});
adminOrdersRoutes.patch("/orders/:id/status", requirePermission(PERMISSIONS.orders.write), validate("param", idParam), validate("json", updateOrderStatusSchema), async (c) => {
    const { id } = c.req.valid("param");
    const { status, comment } = c.req.valid("json");
    const user = currentUser(c);
    const updated = await service.updateOrderStatus(id, status, {
        comment,
        actor: { userId: user.sub, label: user.email },
    });
    await recordAudit(c, {
        action: "order.status_changed",
        resourceType: "order",
        resourceId: id,
        changes: { status, comment },
    });
    return c.json(updated);
});
adminOrdersRoutes.patch("/orders/:id/fulfillment", requirePermission(PERMISSIONS.orders.write), validate("param", idParam), validate("json", updateFulfillmentSchema), async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const updated = await service.updateFulfillment(id, input);
    await recordAudit(c, {
        action: "order.fulfillment_updated",
        resourceType: "order",
        resourceId: id,
        changes: input,
    });
    return c.json(updated);
});
adminOrdersRoutes.post("/orders/:id/refund", requirePermission(PERMISSIONS.orders.refund), validate("param", idParam), validate("json", refundOrderSchema), async (c) => {
    const { id } = c.req.valid("param");
    const input = c.req.valid("json");
    const user = currentUser(c);
    const updated = await service.refundOrder(id, input, {
        userId: user.sub,
        label: user.email,
    });
    await recordAudit(c, {
        action: "order.refunded",
        resourceType: "order",
        resourceId: id,
        changes: { amount: input.amount, reason: input.reason, restock: input.restock },
    });
    return c.json(updated);
});
adminOrdersRoutes.post("/orders/:id/cancel", requirePermission(PERMISSIONS.orders.write), validate("param", idParam), validate("json", cancelOrderSchema), async (c) => {
    const { id } = c.req.valid("param");
    const { reason } = c.req.valid("json");
    const user = currentUser(c);
    const updated = await service.updateOrderStatus(id, "cancelled", {
        comment: reason,
        actor: { userId: user.sub, label: user.email },
    });
    await recordAudit(c, {
        action: "order.cancelled",
        resourceType: "order",
        resourceId: id,
        changes: { reason },
    });
    return c.json(updated);
});
/**
 * Confirmation manuelle d'encaissement.
 *
 * Indispensable au paiement à la livraison : c'est l'administrateur qui
 * déclenche la décrémentation ferme du stock une fois l'argent reçu.
 */
adminOrdersRoutes.post("/orders/:id/mark-paid", requirePermission(PERMISSIONS.orders.write), validate("param", idParam), validate("json", z.object({ comment: z.string().max(500).optional() })), async (c) => {
    const { id } = c.req.valid("param");
    const user = currentUser(c);
    await service.markOrderPaid(id, {
        comment: c.req.valid("json").comment ?? "Encaissement confirmé manuellement",
        actor: { userId: user.sub, label: user.email },
    });
    await recordAudit(c, {
        action: "order.marked_paid",
        resourceType: "order",
        resourceId: id,
    });
    return c.json(await service.getOrder(id));
});
// --- Storefront ------------------------------------------------------------
/**
 * Confirmation de commande accessible sans compte.
 *
 * Montée **avant** le garde d'authentification : une commande passée en
 * invité doit rester consultable par son auteur, que le jeton signé identifie
 * à lui seul.
 */
export const storeOrderConfirmationRoutes = new Hono();
storeOrderConfirmationRoutes.get("/orders/:id/confirmation", validate("param", idParam), validate("query", z.object({ token: z.string().min(16).max(64) })), async (c) => c.json(await service.getOrderByToken(c.req.valid("param").id, c.req.valid("query").token)));
/** Historique de commandes de la cliente connectée (§2.7). */
export const storeOrdersRoutes = new Hono();
storeOrdersRoutes.use("*", requireAuth, requireKind("customer"));
storeOrdersRoutes.get("/orders", validate("query", paginationQuerySchema), async (c) => c.json(await service.listOrders({
    ...c.req.valid("query"),
    userId: currentUser(c).sub,
})));
storeOrdersRoutes.get("/orders/:id", validate("param", idParam), async (c) => c.json(await service.getOrderForUser(c.req.valid("param").id, currentUser(c).sub)));
/**
 * Annulation par la cliente. Le service refuse la transition si la commande
 * est déjà expédiée : le graphe de statuts est le seul arbitre.
 */
storeOrdersRoutes.post("/orders/:id/cancel", validate("param", idParam), validate("json", cancelOrderSchema), async (c) => {
    const { id } = c.req.valid("param");
    const user = currentUser(c);
    await service.getOrderForUser(id, user.sub);
    return c.json(await service.updateOrderStatus(id, "cancelled", {
        comment: c.req.valid("json").reason ?? "Annulée par la cliente",
        actor: { userId: user.sub, label: user.email },
    }));
});
//# sourceMappingURL=routes.js.map