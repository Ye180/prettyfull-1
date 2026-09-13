"use client";

import { Cart } from "@/components/icons/cart.icon";
import CartContent from "@/features/cart/components/organims/cart-content";
import { paths } from "@/lib/routes/paths-en";
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { useCartStore } from "@prettyfull/store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CartDrawer = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const items = useCartStore((state) => state.items);

	const itemCount = items.reduce((total, item) => total + item.quantity, 0);

	const goToCart = () => {
		setOpen(false);
		router.push(paths.cart);
	};

	return (
		<Drawer direction="bottom" open={open} onOpenChange={setOpen}>
			<DrawerTrigger
				className="relative flex focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
				aria-label="Voir le panier"
			>
				<Cart />
				{itemCount > 0 && (
					<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-1 -right-1 text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
						{itemCount}
					</p>
				)}
			</DrawerTrigger>

			<DrawerContent
				title="Panier"
				className="h-[85vh]! sm:h-[60vh]! md:h-[50vh]! rounded-none! border-t-0!"
			>
				<div className="flex-1 min-h-0 overflow-y-auto sm:overflow-hidden px-6">
					<CartContent items={items} layout="drawer" />
				</div>
				<DrawerFooter>
					<Button variant="default" shape="square" fullWidth onClick={goToCart}>
						<span className="text-base font-semibold">Voir le panier</span>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default CartDrawer;
