import type { PaymentAdapter } from "../types.js";

/**
 * Paiement à la livraison / virement - sans prestataire externe.
 *
 * Aucune clé, aucun webhook : la commande est acceptée immédiatement en
 * attente d'encaissement, et c'est l'administrateur qui la marque payée
 * depuis le panel une fois l'argent reçu. Sert de moyen de repli lorsque
 * aucun agrégateur n'est configuré.
 */
export const manualAdapter: PaymentAdapter = {
	key: "manual",
	name: "Paiement à la livraison",
	description:
		"Encaissement à la remise du colis. La commande est confirmée manuellement depuis le panel.",
	logoUrl: null,
	supportsWebhooks: false,
	supportsRefunds: false,
	requiredCredentials: [],

	initiate: async ({ order }) => ({
		// `pending` et non `succeeded` : rien n'est encaissé à cet instant. Le
		// stock reste donc réservé, pas décrémenté, jusqu'à confirmation.
		status: "pending",
		providerTransactionId: `manual_${order.id}`,
		redirectUrl: null,
		raw: { mode: "cash_on_delivery", displayId: order.displayId },
	}),

	test: async () => ({
		ok: true,
		message: "Le paiement à la livraison ne nécessite aucune configuration.",
	}),
};
