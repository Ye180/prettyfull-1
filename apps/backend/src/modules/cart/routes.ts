import {
	addCartItemSchema,
	addressInputSchema,
	applyDiscountCodeSchema,
	checkoutSchema,
	updateCartItemSchema,
} from "@prettyfull/contracts";
import { Hono, type Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { randomToken } from "../../lib/crypto.js";
import { env, isProduction } from "../../lib/env.js";
import type { AppEnv } from "../../middleware/request-context.js";
import { optionalAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import type { AddressSnapshot } from "../../db/schema/orders.js";
import { checkout } from "../orders/service.js";
import * as service from "./service.js";

const itemParam = z.object({ itemId: z.uuid() });

const GUEST_CART_COOKIE = "pf_cart";

/**
 * Panier storefront.
 *
 * Un visiteur non connecté est suivi par un jeton de panier en cookie ; à la
 * connexion, ce panier est fusionné avec celui du compte. Toutes les routes
 * acceptent donc une identité facultative.
 */
export const storeCartRoutes = new Hono<AppEnv>();

storeCartRoutes.use("*", optionalAuth);

/**
 * Détermine le panier de l'appelant, en créant le jeton invité si besoin.
 *
 * Le cookie n'est pas `httpOnly` : il ne porte aucun secret d'authentification,
 * seulement un identifiant opaque de panier, et le storefront doit pouvoir le
 * lire pour ses rendus client.
 */
const resolveCartId = async (c: Context<AppEnv>): Promise<string> => {
	const auth = c.get("auth");

	if (auth) {
		// Une cliente qui se connecte avec un panier invité en cours le récupère.
		const guestToken = getCookie(c, GUEST_CART_COOKIE);
		if (guestToken) await service.mergeGuestCart(guestToken, auth.sub);

		return service.getOrCreateCart({ userId: auth.sub });
	}

	let token = getCookie(c, GUEST_CART_COOKIE);

	if (!token) {
		token = randomToken(24);
		setCookie(c, GUEST_CART_COOKIE, token, {
			httpOnly: false,
			secure: isProduction || env.COOKIE_SECURE,
			sameSite: "Lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 30,
		});
	}

	return service.getOrCreateCart({ sessionToken: token });
};

storeCartRoutes.get("/cart", async (c) =>
	c.json(await service.getCart(await resolveCartId(c))),
);

storeCartRoutes.post("/cart/items", validate("json", addCartItemSchema), async (c) => {
	const cartId = await resolveCartId(c);
	const { quantity, ...selector } = c.req.valid("json");

	await service.addItem(cartId, selector, quantity);
	return c.json(await service.getCart(cartId), 201);
});

storeCartRoutes.patch(
	"/cart/items/:itemId",
	validate("param", itemParam),
	validate("json", updateCartItemSchema),
	async (c) => {
		const cartId = await resolveCartId(c);

		await service.updateItemQuantity(
			cartId,
			c.req.valid("param").itemId,
			c.req.valid("json").quantity,
		);

		return c.json(await service.getCart(cartId));
	},
);

storeCartRoutes.delete(
	"/cart/items/:itemId",
	validate("param", itemParam),
	async (c) => {
		const cartId = await resolveCartId(c);
		await service.removeItem(cartId, c.req.valid("param").itemId);
		return c.json(await service.getCart(cartId));
	},
);

storeCartRoutes.delete("/cart", async (c) => {
	const cartId = await resolveCartId(c);
	await service.clearCart(cartId);
	return c.json(await service.getCart(cartId));
});

storeCartRoutes.put(
	"/cart/addresses",
	validate(
		"json",
		z.object({
			shippingAddress: addressInputSchema,
			billingAddress: addressInputSchema.nullish(),
		}),
	),
	async (c) => {
		const cartId = await resolveCartId(c);
		const input = c.req.valid("json");

		await service.setCartAddresses(cartId, {
			shippingAddress: input.shippingAddress as AddressSnapshot,
			billingAddress: (input.billingAddress ?? null) as AddressSnapshot | null,
		});

		return c.json(await service.getCart(cartId));
	},
);

/** Options de livraison calculées pour l'adresse enregistrée sur le panier. */
storeCartRoutes.get("/cart/shipping-options", async (c) =>
	c.json(await service.listShippingOptions(await resolveCartId(c))),
);

storeCartRoutes.put(
	"/cart/shipping-method",
	validate("json", z.object({ rateId: z.uuid().nullable() })),
	async (c) => {
		const cartId = await resolveCartId(c);
		await service.setShippingRate(cartId, c.req.valid("json").rateId);
		return c.json(await service.getCart(cartId));
	},
);

/** Applique un code promo au panier (§2.9), revalidé au sous-total courant. */
storeCartRoutes.put(
	"/cart/discount-code",
	validate("json", applyDiscountCodeSchema),
	async (c) => {
		const cartId = await resolveCartId(c);
		await service.applyDiscountCode(cartId, c.req.valid("json").code);
		return c.json(await service.getCart(cartId));
	},
);

storeCartRoutes.delete("/cart/discount-code", async (c) => {
	const cartId = await resolveCartId(c);
	await service.removeDiscountCode(cartId);
	return c.json(await service.getCart(cartId));
});

/**
 * Passage en commande. Renvoie `redirectUrl` quand le prestataire exige une
 * page de paiement hébergée (Wave) ; `null` sinon (paiement à la livraison).
 */
storeCartRoutes.post("/checkout", validate("json", checkoutSchema), async (c) => {
	const cartId = await resolveCartId(c);
	const auth = c.get("auth");

	const result = await checkout(cartId, c.req.valid("json"), {
		userId: auth?.sub ?? null,
	});

	return c.json(result, 201);
});
