import type { Cart, CheckoutInput } from "@prettyfull/contracts";
import type { CartItem } from "@prettyfull/store";
import { storeApi } from "./client";
import type { StoreAddress } from "./types";

/**
 * Pont entre le panier local et le panier serveur.
 *
 * Le storefront garde son panier Zustand pour l'interaction - ajout, badge,
 * tiroir - parce qu'il doit rester instantané et fonctionner hors connexion.
 * Le panier serveur, lui, n'entre en jeu qu'au moment du paiement : c'est là
 * que le stock est vérifié et réservé, sous verrou.
 *
 * La synchronisation est donc **ponctuelle et unidirectionnelle** : à l'entrée
 * du tunnel, le panier local est poussé vers le serveur, qui devient la source
 * de vérité jusqu'à la commande.
 */

export interface CheckoutResult {
	orderId: string;
	displayId: number;
	status: string;
	paymentStatus: string;
	/** Page de paiement du prestataire ; `null` si l'encaissement est différé. */
	redirectUrl: string | null;
	transactionId: string | null;
	/** Autorise la consultation de la confirmation sans compte. */
	confirmationToken: string;
}

/**
 * Remplace le contenu du panier serveur par celui du panier local.
 *
 * Le panier serveur est d'abord vidé : sans cela, deux passages successifs
 * dans le tunnel additionneraient les quantités.
 *
 * Les lignes sans `selection` sont ignorées - elles proviennent d'un panier
 * persisté avant cette version et ne peuvent pas être rattachées à un point de
 * stock. Le décompte renvoyé permet d'en avertir la cliente.
 */
export const syncCartToServer = async (
	items: CartItem[],
): Promise<{ cart: Cart; skipped: number }> => {
	await storeApi.delete<Cart>("/api/store/cart");

	let skipped = 0;
	let cart: Cart | null = null;

	for (const item of items) {
		if (!item.selection) {
			skipped += 1;
			continue;
		}

		cart = await storeApi.post<Cart>("/api/store/cart/items", {
			productId: item.selection.productId,
			variantId: item.selection.variantId,
			sizeId: item.selection.sizeId,
			quantity: item.quantity,
		});
	}

	cart ??= await storeApi.get<Cart>("/api/store/cart", false);

	return { cart, skipped };
};

export const getServerCart = () => storeApi.get<Cart>("/api/store/cart", false);

/** Applique un code promo au panier serveur, revalidé au sous-total courant. */
export const applyDiscountCode = (code: string) =>
	storeApi.put<Cart>("/api/store/cart/discount-code", { code });

export const removeDiscountCode = () => storeApi.delete<Cart>("/api/store/cart/discount-code");

/** Enregistre l'adresse : les options de livraison en dépendent. */
export const setCartAddress = (address: StoreAddress & { email?: string }) =>
	storeApi.put<Cart>("/api/store/cart/addresses", {
		shippingAddress: {
			firstName: address.first_name,
			lastName: address.last_name,
			address1: address.address_1,
			address2: address.address_2 ?? null,
			city: address.city,
			postalCode: address.postal_code || null,
			countryCode: address.country_code,
			phone: address.phone ?? null,
		},
	});

export const setCartShippingMethod = (rateId: string | null) =>
	storeApi.put<Cart>("/api/store/cart/shipping-method", { rateId });

/**
 * Passe la commande.
 *
 * Le stock est réservé côté serveur avant tout appel au prestataire : si un
 * article vient d'être épuisé, rien n'est créé et l'erreur remonte avec le
 * disponible réel.
 */
export const completeCheckout = (input: CheckoutInput) =>
	storeApi.post<CheckoutResult>("/api/store/checkout", input);
