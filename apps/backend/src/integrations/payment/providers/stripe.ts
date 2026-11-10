import { createHmac, timingSafeEqual } from "node:crypto";
import type {
	PaymentAdapter,
	PaymentInitiateContext,
	PaymentInitiateResult,
	ProviderRuntimeConfig,
	WebhookVerdict,
} from "../types.js";

/**
 * Stripe - carte bancaire, Apple Pay, Google Pay, Link (API REST v1).
 *
 * Parcours « Checkout » hébergé : la cliente saisit sa carte sur la page de
 * Stripe, jamais sur la nôtre. Aucune donnée de carte ne transite par nos
 * serveurs (PCI DSS SAQ A), et 3-D Secure est géré par Stripe.
 *
 *   1. `initiate` crée une Checkout Session et renvoie son URL ;
 *   2. Stripe notifie `checkout.session.*` sur `/api/webhooks/stripe` ;
 *   3. `verifyWebhook` contrôle la signature `Stripe-Signature`.
 *
 * Les moyens de paiement proposés se règlent dans le tableau de bord Stripe
 * (« Moyens de paiement »), sans toucher au code.
 *
 * Montants : nos montants sont en plus petite unité avec les mêmes exposants
 * que Stripe (XOF sans décimale, EUR/USD en centimes) - ils passent tels quels.
 */

const API_BASE = "https://api.stripe.com/v1";

/** Tolérance sur l'horodatage de signature, contre le rejeu d'un webhook capturé. */
const SIGNATURE_TOLERANCE_SECONDS = 300;

/** Stripe refuse une session expirant à moins de 30 minutes. */
const MIN_SESSION_SECONDS = 30 * 60;
const MAX_SESSION_SECONDS = 24 * 60 * 60;

/**
 * La session ferme un peu avant la fin de la réservation : le balayage du
 * stock passe chaque minute, un paiement validé à la dernière seconde ne doit
 * pas tomber sur un stock déjà libéré.
 */
const SESSION_MARGIN_SECONDS = 2 * 60;

type Json = Record<string, unknown>;

/** `sk_live_…` / `rk_live_…` => live ; tout le reste => test. */
const keyMode = (key: string): "live" | "test" => (key.includes("_live_") ? "live" : "test");

/**
 * Refuse une clé de test en production (paiements fictifs « acceptés ») et
 * une clé live hors production (vrais débits pendant les essais).
 */
const checkKey = (config: ProviderRuntimeConfig): string | null => {
	const key = config.credentials.secret_key;
	if (!key) return "Clé secrète Stripe non renseignée.";
	if (keyMode(key) !== config.environment) {
		return config.environment === "live"
			? "Environnement « live » mais clé Stripe de test : remplacez-la par la clé sk_live_."
			: "Environnement « test » mais clé Stripe live : utilisez une clé sk_test_ ou passez en « live ».";
	}
	return null;
};

const stripeFetch = async (
	config: ProviderRuntimeConfig,
	path: string,
	params?: Record<string, string | number>,
): Promise<{ ok: boolean; status: number; body: Json }> => {
	const response = await fetch(`${API_BASE}${path}`, {
		method: params ? "POST" : "GET",
		headers: {
			Authorization: `Bearer ${config.credentials.secret_key}`,
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: params
			? new URLSearchParams(
					Object.entries(params).map(([name, value]): [string, string] => [name, String(value)]),
				)
			: undefined,
		signal: AbortSignal.timeout(15_000),
	});

	const body = (await response.json().catch(() => ({}))) as Json;
	return { ok: response.ok, status: response.status, body };
};

const stripeError = (body: Json, fallback: string): string => {
	const message = (body.error as Json | undefined)?.message;
	return typeof message === "string" ? message : fallback;
};

const unreachable = (error: unknown): string =>
	error instanceof Error ? `Stripe injoignable : ${error.message}` : "Stripe injoignable.";

const failed = (errorMessage: string, raw?: Json): PaymentInitiateResult => ({
	status: "failed",
	providerTransactionId: null,
	redirectUrl: null,
	raw,
	errorMessage,
});

/**
 * Reprise de paiement : une session encore ouverte est réutilisée telle
 * quelle. En créer une seconde laisserait deux pages payables pour la même
 * commande, donc un double débit possible.
 */
const reuseSession = async (
	context: PaymentInitiateContext,
	sessionId: string,
): Promise<PaymentInitiateResult | null> => {
	const { ok, body } = await stripeFetch(
		context,
		`/checkout/sessions/${encodeURIComponent(sessionId)}`,
	);
	if (!ok) return null;

	if (body.status === "open" && typeof body.url === "string") {
		return { status: "pending", providerTransactionId: sessionId, redirectUrl: body.url, raw: body };
	}
	// Déjà réglée : le webhook va confirmer, on renvoie vers la confirmation.
	if (body.status === "complete") {
		return {
			status: "pending",
			providerTransactionId: sessionId,
			redirectUrl: context.successUrl,
			raw: body,
		};
	}
	return null;
};

const toVerdictStatus = (type: string, session: Json): WebhookVerdict["status"] => {
	switch (type) {
		case "checkout.session.completed":
			// Moyen de paiement différé (virement…) : `unpaid` jusqu'à
			// `async_payment_succeeded`.
			return session.payment_status === "paid" ? "success" : "pending";
		case "checkout.session.async_payment_succeeded":
			return "success";
		case "checkout.session.async_payment_failed":
			return "failed";
		case "checkout.session.expired":
			return "cancelled";
		default:
			return "pending";
	}
};

export const stripeAdapter: PaymentAdapter = {
	key: "stripe",
	name: "Carte bancaire",
	description: "Visa, Mastercard, Apple Pay, Google Pay - paiement sécurisé par Stripe.",
	logoUrl: null,
	supportsWebhooks: true,
	supportsRefunds: true,
	sessionMinutes: 35,

	requiredCredentials: [
		{
			key: "secret_key",
			label: "Clé secrète Stripe",
			secret: true,
			placeholder: "sk_live_... (ou variable STRIPE_SECRET_KEY)",
			env: "STRIPE_SECRET_KEY",
		},
		{
			key: "webhook_secret",
			label: "Secret de signature des webhooks",
			secret: true,
			placeholder: "whsec_... (ou variable STRIPE_WEBHOOK_SECRET)",
			env: "STRIPE_WEBHOOK_SECRET",
		},
	],

	initiate: async (context) => {
		const keyProblem = checkKey(context);
		if (keyProblem) return failed(keyProblem);

		try {
			if (context.previousTransactionId?.startsWith("cs_")) {
				const reused = await reuseSession(context, context.previousTransactionId);
				if (reused) return reused;
			}

			const now = Math.floor(Date.now() / 1_000);
			const expiresAt = Math.min(
				Math.max(
					Math.floor(context.expiresAt.getTime() / 1_000) - SESSION_MARGIN_SECONDS,
					now + MIN_SESSION_SECONDS + 60,
				),
				now + MAX_SESSION_SECONDS - 60,
			);

			const { order } = context;
			const { ok, status, body } = await stripeFetch(context, "/checkout/sessions", {
				mode: "payment",
				// Rattache le webhook à notre commande.
				client_reference_id: order.id,
				customer_email: order.email,
				locale: "auto",
				success_url: context.successUrl,
				cancel_url: context.cancelUrl,
				expires_at: expiresAt,
				// Une seule ligne au total de la commande : remises et frais de
				// port sont déjà calculés côté serveur, Stripe n'a rien à recalculer.
				"line_items[0][quantity]": 1,
				"line_items[0][price_data][currency]": order.currency,
				"line_items[0][price_data][unit_amount]": order.amount,
				"line_items[0][price_data][product_data][name]": `Commande ${order.description}`,
				"metadata[order_id]": order.id,
				"metadata[display_id]": order.displayId,
				// Visible sur le paiement dans le tableau de bord Stripe.
				"payment_intent_data[description]": `Commande ${order.description}`,
				"payment_intent_data[metadata][order_id]": order.id,
			});

			if (!ok) {
				return failed(stripeError(body, `Stripe a refusé la demande (HTTP ${status}).`), body);
			}

			if (typeof body.id !== "string" || typeof body.url !== "string") {
				return failed("Réponse Stripe incomplète : session ou URL de paiement absente.", body);
			}

			return { status: "pending", providerTransactionId: body.id, redirectUrl: body.url, raw: body };
		} catch (error) {
			// La commande reste en attente, le stock réservé : la cliente peut réessayer.
			return failed(unreachable(error));
		}
	},

	verifyWebhook: async (request, config): Promise<WebhookVerdict> => {
		const payload = JSON.parse(request.rawBody || "{}") as Json;
		const type = String(payload.type ?? "unknown");

		const invalid = (reason: string): WebhookVerdict => ({
			valid: false,
			externalId: String(payload.id ?? `invalid_${Date.now()}`),
			eventType: type,
			providerTransactionId: null,
			orderReference: null,
			status: "failed",
			amount: null,
			currency: null,
			raw: { ...payload, _rejection: reason },
		});

		const secret = config.credentials.webhook_secret;
		if (!secret) return invalid("Secret de webhook non configuré.");

		// `t=<horodatage>,v1=<hex>[,v1=<hex>…]` - plusieurs `v1` pendant une rotation.
		const header = request.headers.get("stripe-signature");
		if (!header) return invalid("En-tête de signature absent.");

		const parts = header.split(",").map((part) => part.trim().split("="));
		const timestamp = parts.find(([name]) => name === "t")?.[1];
		const signatures = parts
			.filter(([name, value]) => name === "v1" && value)
			.map(([, value]) => value!);
		if (!timestamp || signatures.length === 0) return invalid("Signature mal formée.");

		const age = Math.abs(Date.now() / 1_000 - Number(timestamp));
		if (!Number.isFinite(age) || age > SIGNATURE_TOLERANCE_SECONDS) {
			return invalid("Signature expirée.");
		}

		// Signature sur le corps brut : re-sérialiser le JSON l'invaliderait.
		const computed = Buffer.from(
			createHmac("sha256", secret).update(`${timestamp}.${request.rawBody}`).digest("hex"),
		);
		const matches = signatures.some((signature) => {
			const received = Buffer.from(signature);
			return received.length === computed.length && timingSafeEqual(received, computed);
		});
		if (!matches) return invalid("Signature invalide.");

		const object = ((payload.data as Json | undefined)?.object ?? {}) as Json;
		const isSession = object.object === "checkout.session";
		const amount = Number(object.amount_total);

		return {
			valid: true,
			externalId: String(payload.id ?? ""),
			eventType: type,
			providerTransactionId: isSession && typeof object.id === "string" ? object.id : null,
			// Seuls les événements de session portent notre référence : les
			// autres (si l'endpoint y est abonné) sont journalisés sans effet.
			orderReference:
				isSession && typeof object.client_reference_id === "string"
					? object.client_reference_id
					: null,
			status: toVerdictStatus(type, object),
			amount: isSession && Number.isFinite(amount) ? amount : null,
			currency: typeof object.currency === "string" ? object.currency.toLowerCase() : null,
			raw: payload,
		};
	},

	refund: async (context) => {
		const keyProblem = checkKey(context);
		if (keyProblem) return { status: "failed", providerRefundId: null, errorMessage: keyProblem };

		if (!context.providerTransactionId?.startsWith("cs_")) {
			return {
				status: "failed",
				providerRefundId: null,
				errorMessage: "Aucune session de paiement Stripe associée à cette commande.",
			};
		}

		try {
			// La session porte le PaymentIntent, seul objet remboursable.
			const session = await stripeFetch(
				context,
				`/checkout/sessions/${encodeURIComponent(context.providerTransactionId)}`,
			);
			const paymentIntent = session.body.payment_intent;
			if (!session.ok || typeof paymentIntent !== "string") {
				return {
					status: "failed",
					providerRefundId: null,
					raw: session.body,
					errorMessage: stripeError(session.body, "Paiement Stripe introuvable pour cette session."),
				};
			}

			const { ok, status, body } = await stripeFetch(context, "/refunds", {
				payment_intent: paymentIntent,
				amount: context.amount,
				reason: "requested_by_customer",
				"metadata[order_id]": context.order.id,
				"metadata[reason]": context.reason.slice(0, 500),
			});

			if (!ok) {
				return {
					status: "failed",
					providerRefundId: null,
					raw: body,
					errorMessage: stripeError(body, `Stripe a refusé le remboursement (HTTP ${status}).`),
				};
			}

			return {
				status:
					body.status === "succeeded"
						? "succeeded"
						: body.status === "pending" || body.status === "requires_action"
							? "pending"
							: "failed",
				providerRefundId: typeof body.id === "string" ? body.id : null,
				raw: body,
				errorMessage:
					body.status === "failed" || body.status === "canceled"
						? "Stripe a refusé le remboursement."
						: undefined,
			};
		} catch (error) {
			return { status: "failed", providerRefundId: null, errorMessage: unreachable(error) };
		}
	},

	test: async (config) => {
		const keyProblem = checkKey(config);
		if (keyProblem) return { ok: false, message: keyProblem };

		if (!config.credentials.webhook_secret) {
			return {
				ok: false,
				message:
					"Secret de webhook non renseigné : les confirmations de paiement ne pourraient pas être vérifiées.",
			};
		}

		try {
			const { ok, status, body } = await stripeFetch(config, "/balance");
			return ok
				? { ok: true, message: `Connexion à Stripe établie (mode ${config.environment}).` }
				: { ok: false, message: stripeError(body, `Stripe a répondu HTTP ${status}.`) };
		} catch (error) {
			return { ok: false, message: unreachable(error) };
		}
	},
};
