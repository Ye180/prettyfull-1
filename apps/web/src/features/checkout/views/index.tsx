"use client";

import { useRouter } from "next/navigation";
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

	const { goToNextStep } = useCheckoutStep();

	const handleAddressComplete = (data: any) => {
		console.log("Address data:", data);
		// TODO: Save address to cart via Medusa API
		goToNextStep();
	};

	const handleDeliveryComplete = (option: any) => {
		console.log("Delivery option:", option);
		// TODO: Set shipping method via Medusa API
		goToNextStep();
	};

	const handlePaymentComplete = (method: string) => {
		console.log("Payment method:", method);
		// TODO: Initialize payment session via Medusa API
		goToNextStep();
	};

	const handlePlaceOrder = () => {
		console.log("Order placed!");
		// TODO: Complete cart and create order via Medusa API
		router.push("/order-confirmation");
	};

	return (
		<Container
			maxWidth="100vw"
			className="flex flex-col gap-y-4 px-4 py-12 pb-20 sm:flex-row md:justify-between sm:gap-x-24 lg:px-80"
		>
			{/* Left Column: Checkout Steps */}
			<div className="flex flex-col gap-y-8 py-6 w-full bg-white sm:w-2/3">
				<AddressStep onComplete={handleAddressComplete} />
				<DeliveryStep onComplete={handleDeliveryComplete} />
				<PaymentStep onComplete={handlePaymentComplete} />
				<ReviewStep onPlaceOrder={handlePlaceOrder} />
			</div>

			{/* Right Column: Order Summary */}
			<div className="py-12 w-full sm:w-1/3">
				<CheckoutSummary />
			</div>
		</Container>
	);
};

export default CheckoutView;
