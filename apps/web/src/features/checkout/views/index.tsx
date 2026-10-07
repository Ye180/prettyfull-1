"use client";

import { useCartStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CheckoutSummary from "../components/organims/checkout-summary";
import {
	AddressStep,
	DeliveryStep,
	PaymentStep,
	ReviewStep,
} from "../components/steps";
import { useCheckoutStep } from "../hooks/use-checkout-step";

const CheckoutView = () => {
	const t = useTranslations("CheckoutPage.page");
	const router = useRouter();
	const items = useCartStore((state) => state.items);
	const { goToNextStep } = useCheckoutStep();

	// `getState()` et non `items` : pendant l'hydratation React, le hook renvoie
	// l'état serveur (panier vide) et renverrait vers /cart un panier plein
	// lors d'un chargement direct de /checkout (ex. retour du login).
	useEffect(() => {
		if (useCartStore.getState().items.length === 0) {
			router.replace("/cart");
		}
	}, [items.length, router]);

	// ponytail: le panier serveur est invité (cookie), créé à la volée par le
	// backend au premier appel - il n'existe pas d'id à threader avant ça.
	// Ce sentinel ne sert qu'à activer les étapes une fois le panier non vide.
	const cartId = items.length > 0 ? "guest-cart" : null;

	if (items.length === 0) return null;

	return (
		<main className="pt-6 pb-28 w-full min-h-screen text-gray-900 bg-white sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="pb-4 mb-8 font-sans text-3xl font-extrabold tracking-tight border-b border-gray-100 sm:text-4xl md:text-5xl text-gray-950">
					{t("title")}
				</h1>

				{/*
				 * `sm:` déclenche ici la bascule 2 colonnes, pas `lg:` : les
				 * breakpoints Tailwind de ce projet sont définis en `rem` mis à
				 * l'échelle du `html { font-size: 62.5% }` de la page, mais les
				 * media queries résolvent toujours `rem` contre le 16px par
				 * défaut du navigateur - jamais contre ce override. Résultat,
				 * chaque seuil réel est ×1,6 plus large que son nom ne le
				 * suggère (`lg` ne s'active qu'au-delà de ~1638px). `sm` est
				 * celui qui tombe, par ce même effet, sur le seuil réellement
				 * voulu ici (~1024px).
				 */}
				<div className="grid grid-cols-1 gap-12 sm:grid-cols-12 sm:gap-16">
					<div className="space-y-10 sm:col-span-7">
						<AddressStep cartId={cartId} onComplete={() => goToNextStep()} />
						<DeliveryStep cartId={cartId} onComplete={() => goToNextStep()} />
						<PaymentStep
							cartId={cartId}
							regionId={null}
							onComplete={() => goToNextStep()}
						/>
						<ReviewStep
							cartId={cartId}
							onPlaceOrder={(orderId, confirmationToken) =>
								router.push(
									`/order-confirmation?order_id=${orderId}${
										confirmationToken ? `&token=${confirmationToken}` : ""
									}`,
								)
							}
						/>
					</div>

					<div className="sm:col-span-5">
						<div className="sticky top-24 p-6 sm:p-8 bg-[#F9FAFB] rounded-3xl border border-gray-100 shadow-sm">
							<CheckoutSummary />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default CheckoutView;
