import { randomUUID } from "node:crypto";
/**
 * Prestataire fictif, réservé aux environnements de test.
 *
 * Il permet de dérouler tout le parcours - redirection, webhook, confirmation
 * de paiement, décrémentation du stock - sans compte marchand. Il refuse de
 * fonctionner en `live` : un paiement fictif accepté en production serait une
 * commande encaissée pour rien.
 *
 * Le montant `1` (soit 1 FCFA) déclenche volontairement un échec, pour
 * pouvoir tester le chemin de refus.
 */
export const stubAdapter = {
    key: "stub",
    name: "Prestataire de test",
    description: "Simule un paiement pour valider le parcours de bout en bout. Indisponible en production.",
    logoUrl: null,
    supportsWebhooks: true,
    supportsRefunds: true,
    requiredCredentials: [],
    initiate: async ({ order, environment, webhookUrl }) => {
        if (environment === "live") {
            return {
                status: "failed",
                providerTransactionId: null,
                redirectUrl: null,
                errorMessage: "Le prestataire de test ne peut pas être utilisé en production.",
            };
        }
        if (order.amount === 1) {
            return {
                status: "failed",
                providerTransactionId: null,
                redirectUrl: null,
                errorMessage: "Paiement refusé (montant de test réservé aux échecs).",
            };
        }
        const transactionId = `stub_${randomUUID()}`;
        return {
            status: "pending",
            providerTransactionId: transactionId,
            // Pas de page hébergée : on renvoie l'URL de notification, qu'un test
            // peut appeler directement pour simuler la confirmation.
            redirectUrl: `${webhookUrl}?simulate=success&transaction=${transactionId}&reference=${order.id}`,
            raw: { simulated: true },
        };
    },
    verifyWebhook: async (request) => {
        const payload = JSON.parse(request.rawBody || "{}");
        return {
            // Aucune signature à vérifier : l'adaptateur est cantonné au test.
            valid: true,
            externalId: String(payload.event_id ?? randomUUID()),
            eventType: String(payload.type ?? "payment.completed"),
            providerTransactionId: payload.transaction_id ? String(payload.transaction_id) : null,
            orderReference: payload.reference ? String(payload.reference) : null,
            status: payload.status ?? "success",
            amount: typeof payload.amount === "number" ? payload.amount : null,
            currency: payload.currency ? String(payload.currency) : null,
            raw: payload,
        };
    },
    refund: async ({ amount }) => ({
        status: "succeeded",
        providerRefundId: `stub_refund_${randomUUID()}`,
        raw: { simulated: true, amount },
    }),
    test: async ({ environment }) => ({
        ok: environment !== "live",
        message: environment === "live"
            ? "Ce prestataire est réservé aux environnements de test."
            : "Prestataire de test opérationnel.",
    }),
};
//# sourceMappingURL=stub.js.map