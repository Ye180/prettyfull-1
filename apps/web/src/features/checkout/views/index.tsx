"use client";

import { useRegionStore } from "@/stores/useRegion";
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

const GUEST_CART_ID = "guest-cart";

const CheckoutView = () => {
	const router = useRouter();

	const { goToNextStep } = useCheckoutStep();
	const region = useRegionStore((state) => state.region);

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
				<AddressStep cartId={GUEST_CART_ID} onComplete={handleAddressComplete} />
				<DeliveryStep cartId={GUEST_CART_ID} onComplete={handleDeliveryComplete} />
				<PaymentStep
					cartId={GUEST_CART_ID}
					regionId={region?.id ?? null}
					onComplete={handlePaymentComplete}
				/>
				<ReviewStep cartId={GUEST_CART_ID} onPlaceOrder={handlePlaceOrder} />
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
