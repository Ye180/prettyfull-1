"use client";

import CheckoutView from "@/features/checkout/views";
import { sdk } from "@/lib/api/sdk";

const Checkout = () => {
	sdk.store.customer
		.retrieve()
		.then(({ customer }) => {
			// ICI => l'utilisateur est connecté
			console.log("Customer connecté:", customer);
		})
		.catch(() => {
			// ICI => l'utilisateur n'est PAS connecté
		});
	return <CheckoutView />;
};

export default Checkout;
