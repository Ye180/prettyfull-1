"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import CartItems from "@/features/cart/components/organims/cart-items";
import { useCartPersistence } from "@/hooks/use-cart-persistence";
import { useRegionStore } from "@/stores/useRegion";
import { StoreCart } from "@medusajs/types";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../../../../../packages/store/src/use-cart-store";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetItemsCart } from "../api/medusa/get-items-cart";

const TAX_RATE = 0.18;
const SHIPPING_FEE = 10; // valeur comme dans ta capture (ShopHere)
const FREE_SHIPPING_THRESHOLD = 50000;

const CartView = () => {
	const router = useRouter();
	const { items, setCart } = useCartStore();

	// Garantir que le cart_id persiste pendant toute la navigation
	useCartPersistence();

	const cartId = localStorage.getItem("cart_id");
	const { data: cart, isLoading } = useGetItemsCart(cartId as string);

	const regions = useRegionStore((state) => state.region);

	return (
		<Container
			maxWidth="100vw"
			className="py-4 pb-40 min-h-screen max-lg:px-4 lg:px-40"
		>
			<div className="grid grid-cols-1 gap-x-20 md:grid-cols-12">
				{/* Left: items */}
				<section className="bg-white md:col-span-8">
					<div className="flex justify-between items-center mb-6">
						<h2 className="py-8 text-[3rem]! lg:text-[3.5rem]!">
							Votre panier
						</h2>
						<span className="text-gray-500 text-md">
							{cart?.items?.length ?? 0} article
							{(cart?.items?.length ?? 0) > 1 ? "s" : ""}
						</span>
					</div>
					<div className="divide-y divide-gray-100">
						<CartItems cart={cart as StoreCart} isLoading={isLoading} />
					</div>

					<div className="mt-6 text-sm text-gray-600">
						<p>
							Shipping costs are calculated at checkout. You can modify the
							quantity or remove items before confirming your order.
						</p>
					</div>
				</section>

				{/* Right: summary (sticky on desktop) */}
				<aside className="md:col-span-4">
					<div className="sticky top-24">
						<CartSummary
							subtotal={cart?.item_subtotal}
							shipping={cart?.shipping_total}
							taxes={cart?.item_tax_total}
							total={cart?.item_total}
							currency={regions?.currency_code === "xof" ? "FCFA" : "$"}
						/>
					</div>
				</aside>
			</div>
		</Container>
	);
};

export default CartView;
