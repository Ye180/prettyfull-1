import { Hono } from "hono";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { decryptCredentials } from "../../lib/crypto.js";
import { getPaymentAdapter } from "../../integrations/payment/registry.js";
import { markOrderPaid, markPaymentFailed } from "../orders/service.js";
/**
 * Réception des notifications d'agrégateurs (§2.5).
 *
 * Une seule route générique `/:provider` : le prestataire est résolu dans le
 * registre, et c'est son adaptateur qui vérifie la signature et normalise
 * l'événement. Brancher un nouveau prestataire n'ajoute donc aucune route.
 *
 * Trois garanties tiennent ce point d'entrée :
 *
 *  - **Signature** - un événement non signé, ou mal signé, est journalisé
 *    puis ignoré. Sans cela, n'importe qui pourrait marquer une commande
 *    payée par un simple POST.
 *  - **Idempotence** - `(providerKey, externalId)` est unique en base : un
 *    prestataire qui rejoue sa notification ne décrémente pas le stock deux
 *    fois.
 *  - **Montant** - le montant notifié est comparé au total de la commande ;
 *    un écart empêche la confirmation.
 */
export const webhookRoutes = new Hono();
webhookRoutes.post("/:provider", async (c) => {
    const providerKey = c.req.param("provider");
    const adapter = getPaymentAdapter(providerKey);
    // Réponse volontairement vague : ne pas renseigner un scanner sur les
    // prestataires configurés.
    if (!adapter?.verifyWebhook) {
        return c.json({ received: false }, 404);
    }
    // Corps brut : re-sérialiser le JSON invaliderait la signature.
    const rawBody = await c.req.text();
    const [providerRow] = await db
        .select()
        .from(t.paymentProviders)
        .where(eq(t.paymentProviders.key, providerKey))
        .limit(1);
    if (!providerRow)
        return c.json({ received: false }, 404);
    const verdict = await adapter.verifyWebhook({ rawBody, headers: c.req.raw.headers }, {
        environment: providerRow.environment,
        credentials: decryptCredentials(providerRow.credentials),
        config: providerRow.config,
    });
    // Toujours journalisé, valide ou non : c'est la trace exigée au §2.5 et
    // le seul moyen de diagnostiquer une signature qui ne passe pas.
    const [event] = await db
        .insert(t.webhookEvents)
        .values({
        providerKey,
        eventType: verdict.eventType,
        externalId: verdict.externalId || `unsigned_${Date.now()}`,
        payload: verdict.raw,
        signatureValid: verdict.valid,
    })
        .onConflictDoNothing({
        target: [t.webhookEvents.providerKey, t.webhookEvents.externalId],
    })
        .returning({ id: t.webhookEvents.id });
    // Aucune ligne renvoyée : l'événement était déjà connu. On répond 200 pour
    // que le prestataire cesse de réessayer.
    if (!event)
        return c.json({ received: true, duplicate: true });
    if (!verdict.valid) {
        console.warn(`[webhook] ${providerKey} : signature invalide`, verdict.raw);
        return c.json({ received: false }, 400);
    }
    if (!verdict.orderReference) {
        await markProcessed(event.id, "Référence de commande absente de la notification.");
        return c.json({ received: true });
    }
    const [order] = await db
        .select({
        id: t.orders.id,
        total: t.orders.total,
        currency: t.orders.currency,
        paymentStatus: t.orders.paymentStatus,
    })
        .from(t.orders)
        .where(eq(t.orders.id, verdict.orderReference))
        .limit(1);
    if (!order) {
        await markProcessed(event.id, `Commande ${verdict.orderReference} introuvable.`);
        return c.json({ received: true });
    }
    try {
        if (verdict.status === "success") {
            // Un montant divergent trahit soit une erreur de configuration, soit
            // une tentative de fraude : on refuse de confirmer.
            if (verdict.amount !== null && verdict.amount !== order.total) {
                await markProcessed(event.id, `Montant notifié (${verdict.amount}) différent du total (${order.total}).`);
                return c.json({ received: true, mismatch: true }, 409);
            }
            await markOrderPaid(order.id, {
                comment: `Paiement confirmé par ${adapter.name}`,
            });
            await db
                .update(t.transactions)
                .set({ status: "success", updatedAt: new Date() })
                .where(and(eq(t.transactions.orderId, order.id), eq(t.transactions.providerKey, providerKey), eq(t.transactions.kind, "payment")));
        }
        else if (verdict.status === "failed" || verdict.status === "cancelled") {
            await markPaymentFailed(order.id, `Paiement ${verdict.status === "cancelled" ? "annulé" : "refusé"} par ${adapter.name}`);
            await db
                .update(t.transactions)
                .set({ status: verdict.status === "cancelled" ? "cancelled" : "failed", updatedAt: new Date() })
                .where(and(eq(t.transactions.orderId, order.id), eq(t.transactions.providerKey, providerKey), eq(t.transactions.kind, "payment")));
        }
        await markProcessed(event.id, null);
        return c.json({ received: true });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await markProcessed(event.id, message);
        // 500 : le prestataire réessaiera, et l'idempotence protège du doublon.
        console.error(`[webhook] ${providerKey} : traitement échoué`, error);
        return c.json({ received: false }, 500);
    }
});
const markProcessed = async (eventId, errorMessage) => {
    await db
        .update(t.webhookEvents)
        .set({ processedAt: new Date(), errorMessage })
        .where(eq(t.webhookEvents.id, eventId));
};
//# sourceMappingURL=routes.js.map