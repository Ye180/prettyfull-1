"use client";

import { sdk } from "@/lib/api/sdk";
import { useRegionStore } from "@/stores/useRegion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
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

	const regionss = useRegionStore((state) => state.region);

	sdk.store.customer
		.retrieve()
		.then(({ customer }) => {
			// Ici, le client est connecté
			console.log("Client connecté :", customer);
		})
		.catch(() => {
			// Ici, aucun client connecté
			console.log("Client NON connecté");

			router.push("/login");
			// par ex. rediriger vers la page de login
		});

	const { goToNextStep } = useCheckoutStep();
	const region = useRegionStore((state) => state.region);

	// Get cart ID from localStorage
	const [cartId, setCartId] = useState<string | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined") {
			setCartId(localStorage.getItem("cart_id"));
		}
	}, []);

	useEffect(() => {
		if (cartId) {
			sdk.store.fulfillment
				.listCartOptions({
					cart_id: cartId,
				})
				.then(({ shipping_options }) => {
					console.log(shipping_options); // liste des options possibles
				})
				.catch((error) => {
					console.error(
						"Erreur lors de la récupération des options de livraison :",
						error
					);
				});
		}
	}, [cartId]);

	const handleAddressComplete = () => {
		goToNextStep();
	};

	const handleDeliveryComplete = () => {
		goToNextStep();
	};

	const handlePaymentComplete = () => {
		goToNextStep();
	};

	const handlePlaceOrder = (orderId: string) => {
		router.push(`/order-confirmation?order_id=${orderId}`);
	};

	return (
		<Container
			maxWidth="100vw"
			className="flex flex-col gap-y-4 px-4 py-12 pb-20 sm:flex-row md:justify-between sm:gap-x-24 lg:px-80"
		>
			{/* Left Column: Checkout Steps */}
			<div className="flex flex-col gap-y-8 py-6 w-full bg-white sm:w-2/3">
				<AddressStep cartId={cartId} onComplete={handleAddressComplete} />
				<DeliveryStep cartId={cartId} onComplete={handleDeliveryComplete} />
				<PaymentStep
					cartId={cartId}
					regionId={region?.id ?? null}
					onComplete={handlePaymentComplete}
				/>
				<ReviewStep cartId={cartId} onPlaceOrder={handlePlaceOrder} />
			</div>

			{/* Right Column: Order Summary */}
			<div className="py-12 w-full sm:w-1/3">
				<CheckoutSummary
					currency={region?.currency_code === "xof" ? "FCFA" : "$"}
				/>
			</div>
		</Container>
	);
};

export default CheckoutView;
