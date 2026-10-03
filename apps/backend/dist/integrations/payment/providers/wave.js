import { createHmac, timingSafeEqual } from "node:crypto";
import { toMajorUnit } from "@prettyfull/contracts";
/**
 * Wave - paiement mobile (XOF).
 *
 * Écrit sur la forme documentée de l'API Business v1 « Checkout Sessions ».
 * ⚠️ À valider contre le compte marchand réel avant la mise en production :
 * les noms de champs de webhook et le format de signature doivent être
 * confirmés une fois les clés fournies. Tant que `api_key` n'est pas saisie
 * dans le panel, l'agrégateur reste non configuré et ne peut pas être activé.
 *
 * Rien d'autre dans le système ne dépend de ce fichier : corriger un nom de
 * champ ici suffit, sans toucher aux commandes ni au stock.
 */
const API_BASE = "https://api.wave.com/v1";
/** Tolérance sur l'horodatage de signature, contre le rejeu d'un webhook capturé. */
const SIGNATURE_TOLERANCE_SECONDS = 300;
const readCredential = (config, key) => {
    const value = config.credentials[key];
    if (!value) {
        throw new Error(`Clé « ${key} » manquante dans la configuration Wave.`);
    }
    return value;
};
/**
 * Wave attend un montant en unité principale, sous forme de chaîne.
 * Le XOF n'ayant pas de sous-unité, la conversion est neutre - elle reste
 * nécessaire si la boutique encaisse un jour en EUR.
 */
const formatAmount = (amount, currency) => String(toMajorUnit(amount, currency));
export const waveAdapter = {
    key: "wave",
    name: "Wave",
    description: "Paiement mobile Wave. Le client valide depuis son application.",
    logoUrl: null,
    supportsWebhooks: true,
    supportsRefunds: true,
    requiredCredentials: [
        {
            key: "api_key",
            label: "Clé API Wave",
            secret: true,
            placeholder: "wave_ci_prod_...",
        },
        {
            key: "webhook_secret",
            label: "Secret de signature des webhooks",
            secret: true,
            placeholder: "wave_whsec_...",
        },
    ],
    initiate: async (context) => {
        const apiKey = readCredential(context, "api_key");
        const payload = {
            amount: formatAmount(context.order.amount, context.order.currency),
            currency: context.order.currency.toUpperCase(),
            success_url: context.successUrl,
            error_url: context.cancelUrl,
            // Reçu tel quel dans le webhook : c'est ce qui rattache la
            // notification à notre commande.
            client_reference: context.order.id,
        };
        try {
            const response = await fetch(`${API_BASE}/checkout/sessions`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    // Rejouer la requête après un timeout réseau ne doit pas créer
                    // une seconde session de paiement pour la même commande.
                    "idempotency-key": context.order.id,
                },
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(15_000),
            });
            const body = (await response.json().catch(() => ({})));
            if (!response.ok) {
                return {
                    status: "failed",
                    providerTransactionId: null,
                    redirectUrl: null,
                    raw: body,
                    errorMessage: typeof body.message === "string"
                        ? body.message
                        : `Wave a refusé la demande (HTTP ${response.status}).`,
                };
            }
            const sessionId = typeof body.id === "string" ? body.id : null;
            const launchUrl = typeof body.wave_launch_url === "string" ? body.wave_launch_url : null;
            if (!sessionId || !launchUrl) {
                return {
                    status: "failed",
                    providerTransactionId: sessionId,
                    redirectUrl: null,
                    raw: body,
                    errorMessage: "Réponse Wave incomplète : session ou URL de paiement absente.",
                };
            }
            return {
                status: "pending",
                providerTransactionId: sessionId,
                redirectUrl: launchUrl,
                raw: body,
            };
        }
        catch (error) {
            // Réseau injoignable ou délai dépassé : la commande reste en attente
            // de paiement, le stock reste réservé, et la cliente peut réessayer.
            return {
                status: "failed",
                providerTransactionId: null,
                redirectUrl: null,
                errorMessage: error instanceof Error
                    ? `Wave injoignable : ${error.message}`
                    : "Wave injoignable.",
            };
        }
    },
    verifyWebhook: async (request, config) => {
        const payload = JSON.parse(request.rawBody || "{}");
        const data = (payload.data ?? {});
        const invalid = (reason) => ({
            valid: false,
            externalId: String(payload.id ?? `invalid_${Date.now()}`),
            eventType: String(payload.type ?? "unknown"),
            providerTransactionId: null,
            orderReference: null,
            status: "failed",
            amount: null,
            currency: null,
            raw: { ...payload, _rejection: reason },
        });
        const secret = config.credentials.webhook_secret;
        if (!secret)
            return invalid("Secret de webhook non configuré.");
        // En-tête au format `t=<horodatage>,v1=<signature hexadécimale>`.
        const header = request.headers.get("wave-signature");
        if (!header)
            return invalid("En-tête de signature absent.");
        const parts = Object.fromEntries(header.split(",").map((part) => {
            const [name, value] = part.split("=");
            return [name?.trim() ?? "", value?.trim() ?? ""];
        }));
        const timestamp = parts.t;
        const signature = parts.v1;
        if (!timestamp || !signature)
            return invalid("Signature mal formée.");
        const age = Math.abs(Date.now() / 1_000 - Number(timestamp));
        if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) {
            return invalid("Signature expirée.");
        }
        // La signature porte sur le corps brut : re-sérialiser le JSON
        // changerait l'ordre des clés et invaliderait le calcul.
        const expected = createHmac("sha256", secret)
            .update(`${timestamp}${request.rawBody}`)
            .digest("hex");
        const received = Buffer.from(signature, "utf8");
        const computed = Buffer.from(expected, "utf8");
        if (received.length !== computed.length || !timingSafeEqual(received, computed)) {
            return invalid("Signature invalide.");
        }
        const paymentStatus = String(data.payment_status ?? "");
        const status = paymentStatus === "succeeded"
            ? "success"
            : paymentStatus === "cancelled"
                ? "cancelled"
                : paymentStatus === "processing"
                    ? "pending"
                    : "failed";
        const amount = Number(data.amount);
        return {
            valid: true,
            externalId: String(payload.id ?? data.id ?? ""),
            eventType: String(payload.type ?? "checkout.session.updated"),
            providerTransactionId: data.id ? String(data.id) : null,
            orderReference: data.client_reference ? String(data.client_reference) : null,
            status,
            amount: Number.isFinite(amount) ? amount : null,
            currency: data.currency ? String(data.currency).toLowerCase() : null,
            raw: payload,
        };
    },
    refund: async (context) => {
        const apiKey = readCredential(context, "api_key");
        if (!context.providerTransactionId) {
            return {
                status: "failed",
                providerRefundId: null,
                errorMessage: "Aucune session de paiement Wave associée à cette commande.",
            };
        }
        try {
            const response = await fetch(`${API_BASE}/checkout/sessions/${context.providerTransactionId}/refund`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                signal: AbortSignal.timeout(15_000),
            });
            const body = (await response.json().catch(() => ({})));
            if (!response.ok) {
                return {
                    status: "failed",
                    providerRefundId: null,
                    raw: body,
                    errorMessage: typeof body.message === "string"
                        ? body.message
                        : `Wave a refusé le remboursement (HTTP ${response.status}).`,
                };
            }
            return {
                status: "succeeded",
                providerRefundId: typeof body.id === "string" ? body.id : context.providerTransactionId,
                raw: body,
            };
        }
        catch (error) {
            return {
                status: "failed",
                providerRefundId: null,
                errorMessage: error instanceof Error ? `Wave injoignable : ${error.message}` : "Wave injoignable.",
            };
        }
    },
    /**
     * Vérifie la validité des clés avant activation, en interrogeant un
     * point d'API en lecture seule.
     */
    test: async (config) => {
        const apiKey = config.credentials.api_key;
        if (!apiKey) {
            return { ok: false, message: "Clé API Wave non renseignée." };
        }
        if (!config.credentials.webhook_secret) {
            return {
                ok: false,
                message: "Secret de webhook non renseigné : les confirmations de paiement ne pourraient pas être vérifiées.",
            };
        }
        try {
            const response = await fetch(`${API_BASE}/balance`, {
                headers: { Authorization: `Bearer ${apiKey}` },
                signal: AbortSignal.timeout(10_000),
            });
            if (response.status === 401 || response.status === 403) {
                return { ok: false, message: "Clé API refusée par Wave." };
            }
            return response.ok
                ? { ok: true, message: "Connexion à Wave établie." }
                : {
                    ok: false,
                    message: `Wave a répondu HTTP ${response.status}.`,
                };
        }
        catch (error) {
            return {
                ok: false,
                message: error instanceof Error ? `Wave injoignable : ${error.message}` : "Wave injoignable.",
            };
        }
    },
};
//# sourceMappingURL=wave.js.map