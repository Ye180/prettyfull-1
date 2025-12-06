"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AddressData } from "../api/update-cart-address";

interface CheckoutState {
	// Address data
	shippingAddress: AddressData | null;
	billingAddress: AddressData | null;
	sameBillingAddress: boolean;

	// Shipping
	selectedShippingOptionId: string | null;

	// Payment
	selectedPaymentProviderId: string | null;

	// Actions
	setShippingAddress: (address: AddressData) => void;
	setBillingAddress: (address: AddressData | null) => void;
	setSameBillingAddress: (same: boolean) => void;
	setSelectedShippingOptionId: (id: string | null) => void;
	setSelectedPaymentProviderId: (id: string | null) => void;
	reset: () => void;
}

const initialState = {
	shippingAddress: null,
	billingAddress: null,
	sameBillingAddress: true,
	selectedShippingOptionId: null,
	selectedPaymentProviderId: null,
};

export const useCheckoutStore = create<CheckoutState>()(
	persist(
		(set) => ({
			...initialState,

			setShippingAddress: (address) => set({ shippingAddress: address }),
			setBillingAddress: (address) => set({ billingAddress: address }),
			setSameBillingAddress: (same) => set({ sameBillingAddress: same }),
			setSelectedShippingOptionId: (id) =>
				set({ selectedShippingOptionId: id }),
			setSelectedPaymentProviderId: (id) =>
				set({ selectedPaymentProviderId: id }),
			reset: () => set(initialState),
		}),
		{
			name: "checkout-store",
		}
	)
);
