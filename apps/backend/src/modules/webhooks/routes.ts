import { randomUUID } from "node:crypto";
import { Hono } from "hono";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import * as t from "../../db/schema/index.js";
import { decryptCredentials } from "../../lib/crypto.js";
import {
	getPaymentAdapter,
	resolveCredentials,
} from "../../integrations/payment/registry.js";
import { markOrderPaid, markPaymentFailed } from "../orders/service.js";
import type { AppEnv } from "../../middleware/request-context.js";

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
export const webhookRoutes = new Hono<AppEnv>();

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

	if (!providerRow) return c.json({ received: false }, 404);

	const verdict = await adapter.verifyWebhook(
		{ rawBody, headers: c.req.raw.headers },
		{
			environment: providerRow.environment,
			credentials: resolveCredentials(
				adapter.requiredCredentials,
				decryptCredentials(providerRow.credentials),
			),
			config: providerRow.config,
		},
	);

	// Toujours journalisé, valide ou non : c'est la trace exigée au §2.5 et
	// le seul moyen de diagnostiquer une signature qui ne passe pas.
	const [event] = await db
		.insert(t.webhookEvents)
		.values({
			providerKey,
			eventType: verdict.eventType,
			// Un événement non signé ne réserve jamais une clé d'idempotence (il
			// pourrait devancer le vrai), et son contenu, non fiable, n'est pas
			// stocké : seul le motif de rejet sert au diagnostic.
			externalId: verdict.valid ? verdict.externalId : `invalid_${randomUUID()}`,
			payload: verdict.valid
				? verdict.raw
				: { _rejection: verdict.raw._rejection ?? "Signature invalide.", bytes: rawBody.length },
			signatureValid: verdict.valid,
		})
		.onConflictDoNothing({
			target: [t.webhookEvents.providerKey, t.webhookEvents.externalId],
		})
		.returning({ id: t.webhookEvents.id });

	// Aucune ligne renvoyée : l'événement était déjà connu. On répond 200 pour
	// que le prestataire cesse de réessayer.
	if (!event) return c.json({ received: true, duplicate: true });

	if (!verdict.valid) {
		console.warn(`[webhook] ${providerKey} : signature invalide`, verdict.raw);
		return c.json({ received: false }, 400);
	}

	// Une référence étrangère (autre application sur le même compte) ferait
	// échouer la requête SQL sur l'uuid, et le prestataire réessaierait sans fin.
	if (!verdict.orderReference || !z.uuid().safeParse(verdict.orderReference).success) {
		await markProcessed(event.id, "Référence de commande absente de la notification.");
		return c.json({ received: true });
	}

	const [order] = await db
		.select({
			id: t.orders.id,
			status: t.orders.status,
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

	// La notification vise une tentative précise quand le prestataire la nomme :
	// une vieille session expirée ne doit pas toucher la tentative en cours.
	const paymentTransactions = and(
		eq(t.transactions.orderId, order.id),
		eq(t.transactions.providerKey, providerKey),
		eq(t.transactions.kind, "payment"),
		verdict.providerTransactionId
			? eq(t.transactions.providerTransactionId, verdict.providerTransactionId)
			: undefined,
	);

	// La notification doit viser une commande réglée par CE prestataire : un
	// événement valide d'un autre moyen de paiement ne la confirme jamais.
	const [attempt] = await db
		.select({ id: t.transactions.id })
		.from(t.transactions)
		.where(paymentTransactions)
		.limit(1);

	if (!attempt) {
		await markProcessed(event.id, `Aucune tentative ${adapter.name} pour cette commande.`);
		return c.json({ received: true });
	}

	try {
		if (
			verdict.status === "success" &&
			order.paymentStatus !== "paid" &&
			order.status !== "pending_payment"
		) {
			// Réglée après une annulation ou un remboursement (page de paiement
			// restée ouverte) : ne pas ressusciter la commande.
			console.warn(`[webhook] ${providerKey} : paiement reçu pour la commande ${order.status} ${order.id}`);
			await markProcessed(
				event.id,
				`Paiement reçu pour une commande « ${order.status} » : à rembourser depuis ${adapter.name}.`,
			);
			return c.json({ received: true });
		}

		if (verdict.status === "success") {
			// Un montant divergent trahit soit une erreur de configuration, soit
			// une tentative de fraude : on refuse de confirmer.
			if (verdict.amount !== null && verdict.amount !== order.total) {
				await markProcessed(
					event.id,
					`Montant notifié (${verdict.amount}) différent du total (${order.total}).`,
				);
				return c.json({ received: true, mismatch: true }, 409);
			}

			await markOrderPaid(order.id, {
				comment: `Paiement confirmé par ${adapter.name}`,
			});

			await db
				.update(t.transactions)
				.set({ status: "success", updatedAt: new Date() })
				.where(paymentTransactions);
		} else if (verdict.status === "failed" || verdict.status === "cancelled") {
			await db
				.update(t.transactions)
				.set({ status: verdict.status === "cancelled" ? "cancelled" : "failed", updatedAt: new Date() })
				.where(paymentTransactions);

			// Une reprise a pu ouvrir une nouvelle tentative entre-temps : la
			// commande ne passe en échec que si plus aucune n'est en cours.
			const [stillPending] = await db
				.select({ id: t.transactions.id })
				.from(t.transactions)
				.where(
					and(
						eq(t.transactions.orderId, order.id),
						eq(t.transactions.kind, "payment"),
						eq(t.transactions.status, "pending"),
					),
				)
				.limit(1);

			if (!stillPending) {
				await markPaymentFailed(
					order.id,
					`Paiement ${verdict.status === "cancelled" ? "annulé" : "refusé"} par ${adapter.name}`,
				);
			}
		}

		await markProcessed(event.id, null);
		return c.json({ received: true });
	} catch (error) {
		// L'événement est retiré du journal : sans cela, le rejeu du prestataire
		// serait pris pour un doublon et le paiement ne serait jamais appliqué.
		// Retraiter est sans risque, `markOrderPaid` étant idempotent.
		await db.delete(t.webhookEvents).where(eq(t.webhookEvents.id, event.id));

		// 500 : le prestataire réessaiera.
		console.error(`[webhook] ${providerKey} : traitement échoué`, error);
		return c.json({ received: false }, 500);
	}
});

const markProcessed = async (eventId: string, errorMessage: string | null): Promise<void> => {
	await db
		.update(t.webhookEvents)
		.set({ processedAt: new Date(), errorMessage })
		.where(eq(t.webhookEvents.id, eventId));
};
