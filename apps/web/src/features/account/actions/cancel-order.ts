import { cancelOrder as cancelOrderRequest } from "@/lib/store-api";

/**
 * Annulation d'une commande par la cliente.
 *
 * Ce n'est plus une action serveur : la session cliente vit dans le
 * navigateur (jeton en mémoire + cookie de rafraîchissement), et une action
 * serveur ne pourrait pas la présenter à l'API. L'appelant est de toute façon
 * un composant client.
 *
 * L'API arbitre seule : le graphe des statuts refuse d'annuler une commande
 * déjà expédiée, et son message est renvoyé tel quel.
 */
export async function cancelOrder(
	orderId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		await cancelOrderRequest(orderId, "Annulée depuis l'espace client");
		return { success: true };
	} catch (error) {
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "L'annulation n'a pas pu être effectuée.",
		};
	}
}
