import type { CurrencyCode, IntegrationEnvironment } from "@prettyfull/contracts";

/**
 * Interface commune des agrégateurs de paiement (§2.5).
 *
 * C'est le contrat qui rend le système extensible « sans refonte » : ajouter
 * un prestataire consiste à écrire un objet conforme à `PaymentAdapter` et à
 * l'enregistrer dans le registre. Le cœur - panier, commandes, stock - ne
 * connaît que cette interface et n'est jamais modifié.
 *
 * L'adaptateur est **sans état** : toute sa configuration lui est passée à
 * l'appel, ce qui permet de servir plusieurs environnements et de recharger
 * les clés depuis le panel sans redémarrage.
 */

/** Déclaration d'une clé attendue, utilisée pour générer le formulaire du panel. */
export interface CredentialField {
	key: string;
	label: string;
	/** `true` : la valeur est chiffrée et jamais réaffichée. */
	secret: boolean;
	placeholder?: string;
}

export interface ProviderRuntimeConfig {
	environment: IntegrationEnvironment;
	credentials: Record<string, string>;
	config: Record<string, unknown>;
}

export interface PaymentOrderSnapshot {
	id: string;
	displayId: number;
	amount: number;
	currency: CurrencyCode;
	email: string;
	phone: string | null;
	description: string;
}

export interface PaymentInitiateContext extends ProviderRuntimeConfig {
	order: PaymentOrderSnapshot;
	/** URL de retour storefront après un paiement réussi. */
	successUrl: string;
	/** URL de retour après abandon ou échec. */
	cancelUrl: string;
	/** URL publique que le prestataire doit appeler pour notifier le résultat. */
	webhookUrl: string;
}

export interface PaymentInitiateResult {
	/**
	 * `pending` : le client doit être redirigé et le résultat arrivera par
	 * webhook. `succeeded` : encaissement immédiat, sans aller-retour externe
	 * (paiement à la livraison). `failed` : refus immédiat.
	 */
	status: "pending" | "succeeded" | "failed";
	providerTransactionId: string | null;
	/** Page de paiement du prestataire ; `null` si aucune redirection n'est requise. */
	redirectUrl: string | null;
	raw?: Record<string, unknown>;
	errorMessage?: string;
}

export interface WebhookRequest {
	/** Corps brut, indispensable : re-sérialiser le JSON invaliderait la signature. */
	rawBody: string;
	headers: Headers;
}

export interface WebhookVerdict {
	/** `false` : signature invalide - l'événement est journalisé mais jamais appliqué. */
	valid: boolean;
	/** Identifiant de l'événement chez le prestataire, clé d'idempotence. */
	externalId: string;
	eventType: string;
	providerTransactionId: string | null;
	/** Référence de commande transmise à l'aller (`client_reference`). */
	orderReference: string | null;
	status: "success" | "failed" | "cancelled" | "pending";
	/** Montant notifié, comparé au total de la commande avant validation. */
	amount: number | null;
	currency: string | null;
	raw: Record<string, unknown>;
}

export interface RefundContext extends ProviderRuntimeConfig {
	order: PaymentOrderSnapshot;
	providerTransactionId: string | null;
	amount: number;
	reason: string;
}

export interface RefundResult {
	status: "succeeded" | "pending" | "failed";
	providerRefundId: string | null;
	raw?: Record<string, unknown>;
	errorMessage?: string;
}

export interface ProviderTestResult {
	ok: boolean;
	message: string;
	details?: Record<string, unknown>;
}

export interface PaymentAdapter {
	readonly key: string;
	readonly name: string;
	readonly description: string;
	readonly logoUrl: string | null;
	/** `true` : le résultat arrive par notification asynchrone. */
	readonly supportsWebhooks: boolean;
	readonly supportsRefunds: boolean;
	readonly requiredCredentials: CredentialField[];

	initiate(context: PaymentInitiateContext): Promise<PaymentInitiateResult>;

	/** Obligatoire dès que `supportsWebhooks` est vrai. */
	verifyWebhook?(
		request: WebhookRequest,
		config: ProviderRuntimeConfig,
	): Promise<WebhookVerdict>;

	/** Obligatoire dès que `supportsRefunds` est vrai. */
	refund?(context: RefundContext): Promise<RefundResult>;

	/** Vérification de configuration déclenchée depuis le panel avant activation. */
	test?(config: ProviderRuntimeConfig): Promise<ProviderTestResult>;
}
