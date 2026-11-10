import { toMajorUnit, type CurrencyCode } from "@prettyfull/contracts";
import { createHmac, timingSafeEqual } from "node:crypto";
import type {
  PaymentAdapter,
  PaymentInitiateResult,
  ProviderRuntimeConfig,
  WebhookVerdict,
} from "../types.js";

/**
 * Wave - paiement mobile (XOF).
 *
 * Conforme à l'API Business v1 « Checkout Sessions » (docs.wave.com/business) :
 * - requêtes sortantes signées (`Wave-Signature`) si la clé API l'exige ;
 * - webhooks vérifiés par signature HMAC, rotation de secret comprise.
 * Tant que `api_key` n'est pas saisie dans le panel, l'agrégateur reste non
 * configuré et ne peut pas être activé.
 *
 * Rien d'autre dans le système ne dépend de ce fichier : corriger un nom de
 * champ ici suffit, sans toucher aux commandes ni au stock.
 */

const API_BASE = "https://api.wave.com/v1";

/** Tolérance sur l'horodatage de signature, contre le rejeu d'un webhook capturé. */
const SIGNATURE_TOLERANCE_SECONDS = 300;

const readCredential = (config: ProviderRuntimeConfig, key: string): string => {
  const value = config.credentials[key];
  if (!value) {
    throw new Error(`Clé « ${key} » manquante dans la configuration Wave.`);
  }
  return value;
};

/** HMAC-SHA256 hexadécimal de `horodatage + corps brut`, schéma commun aux requêtes et aux webhooks. */
const sign = (secret: string, timestamp: string, body: string): string =>
  createHmac("sha256", secret).update(`${timestamp}${body}`).digest("hex");

/**
 * En-têtes d'un appel à l'API Wave. Si un secret de signature est saisi,
 * ajoute `Wave-Signature` : une clé API créée avec la signature activée
 * rejette toute requête non signée. Sans corps (GET, remboursement), seul
 * l'horodatage est signé.
 */
const waveHeaders = (
  config: ProviderRuntimeConfig,
  body = "",
): Record<string, string> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${readCredential(config, "api_key")}`,
    "Content-Type": "application/json",
  };
  const signingSecret = config.credentials.signing_secret;
  if (signingSecret) {
    const timestamp = String(Math.floor(Date.now() / 1_000));
    headers["Wave-Signature"] =
      `t=${timestamp},v1=${sign(signingSecret, timestamp, body)}`;
  }
  return headers;
};

/** Wave renvoie `error_message`, ou `error.message` pour les refus d'IP. */
const waveError = (body: Record<string, unknown>, fallback: string): string => {
  const nested = body.error as Record<string, unknown> | undefined;
  const message = body.error_message ?? nested?.message ?? body.message;
  return typeof message === "string" ? message : fallback;
};

/**
 * Wave attend un montant en unité principale, sous forme de chaîne.
 * Le XOF n'ayant pas de sous-unité, la conversion est neutre - elle reste
 * nécessaire si la boutique encaisse un jour en EUR.
 */
const formatAmount = (amount: number, currency: CurrencyCode): string =>
  String(toMajorUnit(amount, currency));

export const waveAdapter: PaymentAdapter = {
  key: "wave",
  name: "Wave",
  description: "Paiement mobile Wave. Le client valide depuis son application.",
  logoUrl: null,
  supportsWebhooks: true,
  supportsRefunds: true,
  // L'endpoint de remboursement Wave ne prend pas de montant : session entière.
  supportsPartialRefunds: false,

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
    {
      // Uniquement si la clé API a été créée avec « signature des requêtes ».
      key: "signing_secret",
      label: "Secret de signature des requêtes (facultatif)",
      secret: true,
      optional: true,
      placeholder: "wave_ci_AS...",
    },
  ],

  initiate: async (context): Promise<PaymentInitiateResult> => {
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
      // Le corps signé doit être exactement celui envoyé.
      const body = JSON.stringify(payload);
      const response = await fetch(`${API_BASE}/checkout/sessions`, {
        method: "POST",
        headers: {
          ...waveHeaders(context, body),
          // Rejouer la requête après un timeout réseau ne doit pas créer
          // une seconde session de paiement pour la même commande.
          "idempotency-key": context.order.id,
        },
        body,
        signal: AbortSignal.timeout(15_000),
      });

      const session = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (!response.ok) {
        return {
          status: "failed",
          providerTransactionId: null,
          redirectUrl: null,
          raw: session,
          errorMessage: waveError(
            session,
            `Wave a refusé la demande (HTTP ${response.status}).`,
          ),
        };
      }

      const sessionId = typeof session.id === "string" ? session.id : null;
      const launchUrl =
        typeof session.wave_launch_url === "string"
          ? session.wave_launch_url
          : null;

      if (!sessionId || !launchUrl) {
        return {
          status: "failed",
          providerTransactionId: sessionId,
          redirectUrl: null,
          raw: session,
          errorMessage:
            "Réponse Wave incomplète : session ou URL de paiement absente.",
        };
      }

      return {
        status: "pending",
        providerTransactionId: sessionId,
        redirectUrl: launchUrl,
        raw: session,
      };
    } catch (error) {
      // Réseau injoignable ou délai dépassé : la commande reste en attente
      // de paiement, le stock reste réservé, et la cliente peut réessayer.
      return {
        status: "failed",
        providerTransactionId: null,
        redirectUrl: null,
        errorMessage:
          error instanceof Error
            ? `Wave injoignable : ${error.message}`
            : "Wave injoignable.",
      };
    }
  },

  verifyWebhook: async (request, config): Promise<WebhookVerdict> => {
    const payload = JSON.parse(request.rawBody || "{}") as Record<
      string,
      unknown
    >;
    const data = (payload.data ?? {}) as Record<string, unknown>;

    const invalid = (reason: string): WebhookVerdict => ({
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
    if (!secret) return invalid("Secret de webhook non configuré.");

    // En-tête au format `t=<horodatage>,v1=<signature hexadécimale>`.
    const header = request.headers.get("wave-signature");
    if (!header) return invalid("En-tête de signature absent.");

    // Pendant une rotation de secret, Wave envoie plusieurs `v1=`.
    const parts = header.split(",").map((part) => part.trim().split("="));
    const timestamp = parts.find(([name]) => name === "t")?.[1];
    const signatures = parts
      .filter(([name, value]) => name === "v1" && value)
      .map(([, value]) => value!);
    if (!timestamp || signatures.length === 0)
      return invalid("Signature mal formée.");

    const age = Math.abs(Date.now() / 1_000 - Number(timestamp));
    if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) {
      return invalid("Signature expirée.");
    }

    // La signature porte sur le corps brut : re-sérialiser le JSON
    // changerait l'ordre des clés et invaliderait le calcul.
    const computed = Buffer.from(
      sign(secret, timestamp, request.rawBody),
      "utf8",
    );
    const matches = signatures.some((signature) => {
      const received = Buffer.from(signature, "utf8");
      return (
        received.length === computed.length &&
        timingSafeEqual(received, computed)
      );
    });

    if (!matches) return invalid("Signature invalide.");

    const paymentStatus = String(data.payment_status ?? "");
    const status: WebhookVerdict["status"] =
      paymentStatus === "succeeded"
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
      orderReference: data.client_reference
        ? String(data.client_reference)
        : null,
      status,
      amount: Number.isFinite(amount) ? amount : null,
      currency: data.currency ? String(data.currency).toLowerCase() : null,
      raw: payload,
    };
  },

  refund: async (context) => {
    if (!context.providerTransactionId) {
      return {
        status: "failed",
        providerRefundId: null,
        errorMessage:
          "Aucune session de paiement Wave associée à cette commande.",
      };
    }

    try {
      const response = await fetch(
        `${API_BASE}/checkout/sessions/${context.providerTransactionId}/refund`,
        {
          method: "POST",
          headers: waveHeaders(context),
          signal: AbortSignal.timeout(15_000),
        },
      );

      const body = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;

      if (!response.ok) {
        return {
          status: "failed",
          providerRefundId: null,
          raw: body,
          errorMessage: waveError(
            body,
            `Wave a refusé le remboursement (HTTP ${response.status}).`,
          ),
        };
      }

      return {
        status: "succeeded",
        providerRefundId:
          typeof body.id === "string" ? body.id : context.providerTransactionId,
        raw: body,
      };
    } catch (error) {
      return {
        status: "failed",
        providerRefundId: null,
        errorMessage:
          error instanceof Error
            ? `Wave injoignable : ${error.message}`
            : "Wave injoignable.",
      };
    }
  },

  /**
   * Vérifie la validité des clés avant activation, en interrogeant un
   * point d'API en lecture seule.
   */
  test: async (config) => {
    if (!config.credentials.api_key) {
      return { ok: false, message: "Clé API Wave non renseignée." };
    }
    if (!config.credentials.webhook_secret) {
      return {
        ok: false,
        message:
          "Secret de webhook non renseigné : les confirmations de paiement ne pourraient pas être vérifiées.",
      };
    }

    try {
      const response = await fetch(`${API_BASE}/balance`, {
        headers: waveHeaders(config),
        signal: AbortSignal.timeout(10_000),
      });

      if (response.status === 401 || response.status === 403) {
        const body = (await response.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;
        return {
          ok: false,
          message: waveError(body, "Clé API refusée par Wave."),
        };
      }

      return response.ok
        ? { ok: true, message: "Connexion à Wave établie." }
        : {
            ok: false,
            message: `Wave a répondu HTTP ${response.status}.`,
          };
    } catch (error) {
      return {
        ok: false,
        message:
          error instanceof Error
            ? `Wave injoignable : ${error.message}`
            : "Wave injoignable.",
      };
    }
  },
};
