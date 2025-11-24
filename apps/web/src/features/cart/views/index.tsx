"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import CartItems from "@/features/cart/components/organims/cart-items";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useCartStore } from "../../../../../../packages/store/src/use-cart-store";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCart } from "../api/backend/get-cart-by-userid";

const TAX_RATE = 0.18;
const SHIPPING_FEE = 10; // valeur comme dans ta capture (ShopHere)
const FREE_SHIPPING_THRESHOLD = 50000;

const CartView = () => {
	const router = useRouter();
	const { items, setCart } = useCartStore();
	const { data: cartData, isLoading } = useGetCart();

	useEffect(() => {
		if (cartData?.items?.length) {
			setCart(cartData.items);
		}
	}, [cartData, setCart]);

	const { subtotal, shipping, taxes, total } = useMemo(() => {
		const subtotalCalc = items.reduce(
			(acc, item) => acc + (item.unitPrice?.amount || 0) * item.quantity,
			0
		);
		const taxesCalc = subtotalCalc * TAX_RATE;
		const shippingCalc =
			subtotalCalc > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
		const totalCalc = subtotalCalc + shippingCalc + taxesCalc;
		return {
			subtotal: subtotalCalc,
			shipping: shippingCalc,
			taxes: taxesCalc,
			total: totalCalc,
		};
	}, [items]);

	console.log("Cart items:", items);

	// if (isLoading)
	// 	return <p className="py-24 text-center">Chargement du panier...</p>;

	if (items.length === 0)
		return (
			<div className="flex flex-col items-center gap-8 py-24">
				<h1 className="text-2xl font-semibold">Votre panier est vide</h1>
				<button
					onClick={() => router.push("/")}
					className="px-6 py-3 text-white transition bg-black rounded-full hover:bg-black/80"
				>
					Continuer mes achats
				</button>
			</div>
		);

	return (
		<Container
			maxWidth="100vw"
			className="min-h-screen py-4 pb-40 max-lg:px-4 lg:px-40"
		>
			<div className="grid grid-cols-1 gap-x-20 md:grid-cols-12">
				{/* Left: items */}
				<section className="bg-white md:col-span-8">
					<div className="flex items-center justify-between mb-6">
						<h2 className="py-8 text-[3rem]! lg:text-[3.5rem]!">
							Votre panier
						</h2>
						<span className="text-sm text-gray-500">
							{items.length} article{items.length > 1 ? "s" : ""}
						</span>
					</div>

					<div className="divide-y divide-gray-100">
						<CartItems items={items} />
					</div>

					<div className="mt-6 text-sm text-gray-600">
						<p>
							Les frais d'expédition sont estimés au moment du paiement. Vous
							pouvez modifier la quantité ou supprimer des articles avant de
							valider votre commande.
						</p>
					</div>
				</section>

				{/* Right: summary (sticky on desktop) */}
				<aside className="md:col-span-4">
					<div className="sticky top-24">
						<CartSummary
							subtotal={subtotal}
							shipping={shipping}
							taxes={taxes}
							total={total}
							currency="USD"
						/>
					</div>
				</aside>
			</div>
		</Container>
	);
};

export default CartView;
