"use client";

import CheckoutView from "@/features/checkout/views";
import { sdk } from "@/lib/api/sdk";

const Checkout = () => {
	sdk.store.customer
		.retrieve()
		.then(({ customer }) => {
			// ICI => l'utilisateur est connecté
			throw new Error("Customer connecté");
		})
		.catch(() => {
			// ICI => l'utilisateur n'est PAS connecté
		});
	return <CheckoutView />;
};

export default Checkout;
