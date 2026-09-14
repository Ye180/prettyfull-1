"use client";

import { useRegionStore } from "@/stores/useRegion";
import { useCartStore } from "@prettyfull/store";
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
	const router = useRouter();
	const items = useCartStore((state) => state.items);
	const { goToNextStep } = useCheckoutStep();
	const region = useRegionStore((state) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	useEffect(() => {
		if (items.length === 0) {
			router.replace("/cart");
		}
	}, [items.length, router]);

	// ponytail: le panier serveur est invité (cookie), créé à la volée par le
	// backend au premier appel — il n'existe pas d'id à threader avant ça.
	// Ce sentinel ne sert qu'à activer les étapes une fois le panier non vide.
	const cartId = items.length > 0 ? "guest-cart" : null;

	if (items.length === 0) return null;

	return (
		<main className="w-full min-h-screen bg-white text-gray-900 pb-28 pt-6 sm:pt-10">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans text-gray-950 mb-8 pb-4 border-b border-gray-100">
					Checkout
				</h1>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
					<div className="space-y-10 lg:col-span-7">
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

					<div className="lg:col-span-5">
						<div className="sticky top-24 p-6 sm:p-8 bg-[#F9FAFB] rounded-3xl border border-gray-100 shadow-sm">
							<CheckoutSummary currency={currency} />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default CheckoutView;
