"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import CartItems from "@/features/cart/components/organims/cart-items";
import { useRegionStore } from "@/stores/useRegion";
import { useCartStore } from "@prettyfull/store";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const TAX_RATE = 0.18;
const SHIPPING_FEE = 10;
const FREE_SHIPPING_THRESHOLD = 50000;

const CartView = () => {
	const items = useCartStore((state) => state.items);
	const regions = useRegionStore((state) => state.region);

	const subtotal = items.reduce(
		(acc, item) => acc + (item.unitPrice?.amount ?? item.product.price?.amount ?? 0) * item.quantity,
		0,
	);
	const shipping = items.length === 0 || subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + shipping + taxes;

	return (
		<Container
			maxWidth="100vw"
			className="py-4 pb-40 min-h-screen max-lg:px-4 lg:px-40"
		>
			<div className="grid grid-cols-1 gap-x-20 md:grid-cols-12">
				<section className="bg-white md:col-span-8">
					<div className="flex justify-between items-center mb-6">
						<h2 className="py-8 text-[3rem]! lg:text-[3.5rem]!">
							Votre panier
						</h2>
						<span className="text-gray-500 text-md">
							{items.length} article{items.length > 1 ? "s" : ""}
						</span>
					</div>
					<div className="divide-y divide-gray-100">
						<CartItems items={items} />
					</div>

					<div className="mt-6 text-sm text-gray-600">
						<p>
							Shipping costs are calculated at checkout. You can modify the
							quantity or remove items before confirming your order.
						</p>
					</div>
				</section>

				<aside className="md:col-span-4">
					<div className="sticky top-24">
						<CartSummary
							subtotal={subtotal}
							shipping={shipping}
							taxes={taxes}
							total={total}
							currency={regions?.currency_code === "xof" ? "FCFA" : "$"}
						/>
					</div>
				</aside>
			</div>
		</Container>
	);
};

export default CartView;
