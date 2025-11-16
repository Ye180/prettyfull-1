"use client";

import { DATA_CARD } from "@/lib/utils/constants/constants";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import CheckoutForm from "../components/organims/checkout-form";
import CheckoutSummary from "../components/organims/checkout-summary";
import { CartSummaryType } from "../types";

const CheckoutView = () => {
	const summary: CartSummaryType = {
		subtotal: DATA_CARD.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0
		),
		shipping: 10,
		taxes: undefined,
		total:
			DATA_CARD.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10,
	};

	return (
		<Container
			maxWidth="100vw"
			className="flex flex-col px-4 py-12 pb-20 gap-y-4 sm:flex-row md:justify-between sm:gap-x-24 lg:px-80"
		>
			<div className="flex flex-col w-full py-6 bg-white gap-y-8 sm:w-2/3">
				<CheckoutForm />
			</div>
			<div className="w-full py-12 sm:w-1/3 ">
				{/* <CheckoutSummary summary={summary} /> */}
				<CheckoutSummary />
			</div>
		</Container>
	);
};

export default CheckoutView;
