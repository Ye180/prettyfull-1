"use client";

import {
	StoreApiError,
	completeCheckout,
	syncCartToServer,
} from "@/lib/store-api";
import { useCartStore } from "@prettyfull/store";
import { useMutation } from "@tanstack/react-query";
import { useCheckoutStore } from "../stores/use-checkout-store";

/**
 * Passage en commande.
 *
 * Déroulé : le panier local est poussé vers le serveur, puis la commande est
 * créée. C'est le serveur qui réserve le stock sous verrou avant tout appel au
 * prestataire - si un article vient d'être épuisé, rien n'est créé et l'erreur
 * remonte avec le disponible réel.
 *
 * Le panier local n'est vidé **qu'après** la création effective de la
 * commande : le vider avant ferait perdre le panier de la cliente au moindre
 * refus.
 */
export const useCompleteCart = () =>
	useMutation({
		mutationFn: async () => {
			const { items, clearCart } = useCartStore.getState();
			const {
				shippingAddress,
				selectedShippingOptionId,
				selectedPaymentProviderId,
			} = useCheckoutStore.getState();

			if (!shippingAddress) {
				throw new Error("Renseignez une adresse de livraison.");
			}
			if (!selectedShippingOptionId) {
				throw new Error("Choisissez un mode de livraison.");
			}
			if (!selectedPaymentProviderId) {
				throw new Error("Choisissez un moyen de paiement.");
			}

			const { skipped } = await syncCartToServer(items);

			if (skipped > 0 && skipped === items.length) {
				throw new Error(
					"Votre panier date d'une version précédente du site. Videz-le et rajoutez vos articles.",
				);
			}

			const result = await completeCheckout({
				email: shippingAddress.email ?? "cliente@prettyfull.shop",
				phone: shippingAddress.phone ?? undefined,
				shippingAddress: {
					firstName: shippingAddress.first_name ?? "",
					lastName: shippingAddress.last_name ?? "",
					address1: shippingAddress.address_1 ?? "",
					address2: shippingAddress.address_2 ?? null,
					city: shippingAddress.city ?? "",
					postalCode: shippingAddress.postal_code ?? null,
					province: null,
					company: null,
					countryCode: (shippingAddress.country_code ?? "ci").toLowerCase(),
					phone: shippingAddress.phone ?? null,
					isDefaultShipping: false,
					isDefaultBilling: false,
				},
				shippingRateId: selectedShippingOptionId,
				paymentProviderKey: selectedPaymentProviderId,
			});

			clearCart();

			// Le prestataire exige parfois une page de paiement hébergée (Wave) :
			// on y envoie la cliente, la confirmation arrivera par webhook.
			if (result.redirectUrl) {
				window.location.assign(result.redirectUrl);
			}

			return result;
		},
		onError: (error) => {
			// L'API nomme l'article épuisé et le disponible restant : ce message
			// est bien plus utile qu'un « erreur » générique.
			if (error instanceof StoreApiError) {
				console.error(
					`[checkout] ${error.code} : ${error.message}`,
					error.details,
				);
			}
		},
	});
