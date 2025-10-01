"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import CartItem from "@/features/cart/components/organims/cart-items";

import { CartItemType, CartSummaryType } from "@/features/cart/types";
import { FC, useState } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const CartView: FC = () => {
	const [items, setItems] = useState<CartItemType[]>([
		{
			id: "1",
			name: "Nike Form",
			description: "Dri-FIT Hooded Versatile Jacket",
			color: "Black",
			size: "L",
			price: 360,
			image: "/assets/product_1.jpg",
			quantity: 1,
		},
		{
			id: "2",
			name: "Nike Club",
			description: "Men's Short-Sleeve Polo",
			color: "White",
			size: "M",
			price: 38,
			image: "/assets/product_2.jpg",
			quantity: 1,
		},
	]);

	const summary: CartSummaryType = {
		subtotal: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
		shipping: 10,
		taxes: undefined,
		total:
			items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 10,
	};

	const handleIncrease = (id: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const handleDecrease = (id: string) => {
		setItems((prev) =>
			prev.map((item) =>
				item.id === id && item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const handleRemove = (id: string) => {
		setItems((prev) => prev.filter((item) => item.id !== id));
	};

	return (
		<Container
			maxWidth="100vw"
			className="flex flex-col px-4 py-12 pb-20 mx-auto sm:px-6 gap-y-4 md:flex-row md:justify-between md:gap-x-24 md:px-40"
		>
			<div className="flex-1">
				<h3 className="mb-6 text-2xl font-bold">Cart</h3>
				{items.map((item) => (
					<CartItem
						key={item.id}
						item={item}
						onIncrease={handleIncrease}
						onDecrease={handleDecrease}
						onRemove={handleRemove}
					/>
				))}
			</div>

			<CartSummary summary={summary} />
		</Container>
	);
};

export default CartView;
