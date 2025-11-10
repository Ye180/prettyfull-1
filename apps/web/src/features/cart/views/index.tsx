'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Container from '../../../../../../packages/ui/src/layouts/helpers/container';
import { useCartStore } from '../../../../../../packages/store/src/use-cart-store';
import { useGetCart } from '../api/get-cart-by-userid';
import CartItems from '@/features/cart/components/organims/cart-items';
import CartSummary from '@/features/cart/components/molecules/cart-summary';

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
		return { subtotal: subtotalCalc, shipping: shippingCalc, taxes: taxesCalc, total: totalCalc };
	}, [items]);

	if (isLoading)
		return <p className="text-center py-24">Chargement du panier...</p>;

	if (items.length === 0)
		return (
			<div className="flex flex-col items-center gap-8 py-24">
				<h1 className="text-2xl font-semibold">Votre panier est vide</h1>
				<button
					onClick={() => router.push('/')}
					className="px-6 py-3 bg-black text-white rounded-full hover:bg-black/80 transition"
				>
					Continuer mes achats
				</button>
			</div>
		);

	return (
		<Container className="flex flex-col md:flex-row md:justify-between gap-16 py-12 px-6 md:px-24">
			<div className="flex-1">
				<h2 className="text-2xl font-bold mb-8">Bag</h2>
				<CartItems items={items} />
			</div>

			<CartSummary
				subtotal={subtotal}
				shipping={shipping}
				taxes={taxes}
				total={total}
				currency="USD"
			/>
		</Container>
	);
};

export default CartView;
