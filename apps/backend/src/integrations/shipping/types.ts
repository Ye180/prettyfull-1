import type { CurrencyCode, IntegrationEnvironment } from "@prettyfull/contracts";
import type { CredentialField, ProviderTestResult } from "../payment/types.js";

/**
 * Interface commune des agrégateurs de livraison (§2.5).
 *
 * Symétrique de `PaymentAdapter` : le calcul des frais de port, le suivi et
 * la génération d'étiquettes passent par ce contrat, jamais par du code
 * spécifique à un transporteur dans le module Commandes.
 */

export interface ShippingDestination {
	countryCode: string;
	city: string;
	postalCode: string | null;
	province: string | null;
}

export interface ShippingQuoteContext {
	environment: IntegrationEnvironment;
	credentials: Record<string, string>;
	config: Record<string, unknown>;
	destination: ShippingDestination;
	/** Poids total du panier, en grammes. */
	weightGrams: number;
	/** Sous-total du panier, pour les seuils de franco de port. */
	subtotal: number;
	currency: CurrencyCode;
}

export interface ShippingQuote {
	/** Identifiant du tarif en base, ou clé calculée par le transporteur. */
	rateId: string;
	name: string;
	amount: number;
	currency: CurrencyCode;
	estimatedDaysMin: number | null;
	estimatedDaysMax: number | null;
}

export interface LabelContext {
	environment: IntegrationEnvironment;
	credentials: Record<string, string>;
	config: Record<string, unknown>;
	orderId: string;
	displayId: number;
	destination: ShippingDestination;
	weightGrams: number;
}

export interface LabelResult {
	trackingNumber: string | null;
	trackingUrl: string | null;
	/** Étiquette encodée en base64 (PDF), quand le transporteur en fournit une. */
	labelBase64: string | null;
	carrier: string;
}

export interface ShippingAdapter {
	readonly key: string;
	readonly name: string;
	readonly description: string;
	readonly logoUrl: string | null;
	/** `true` : l'adaptateur sait produire une étiquette d'expédition. */
	readonly supportsLabels: boolean;
	readonly requiredCredentials: CredentialField[];

	/**
	 * Tarifs proposés pour une destination.
	 *
	 * Les adaptateurs internes lisent les tarifs configurés en base ; un
	 * transporteur externe interroge son API. Le module Commandes ne fait pas
	 * la différence.
	 */
	quote(context: ShippingQuoteContext): Promise<ShippingQuote[]>;

	createLabel?(context: LabelContext): Promise<LabelResult>;

	test?(config: {
		environment: IntegrationEnvironment;
		credentials: Record<string, string>;
		config: Record<string, unknown>;
	}): Promise<ProviderTestResult>;
}
