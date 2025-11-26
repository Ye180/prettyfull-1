"use client";

import { Cart } from "@/components/icons/cart.icon";
import { sdk } from "@/lib/api/sdk";
import { paths } from "@/lib/routes/paths-en";
import { CART_ITEMS_CART } from "@/shared/utils/query-keys";
import {
	Popover,
	PopoverButton,
	PopoverPanel,
	Transition,
} from "@headlessui/react";
import { StoreCartLineItem } from "@medusajs/types";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";

const CartDropdown = (cart: any) => {
	const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

	const router = useRouter();

	const open = () => setCartDropdownOpen(true);
	const close = () => setCartDropdownOpen(false);

	const openAndCancel = () => {
		// if (activeTimer) {
		// 	clearTimeout(activeTimer);
		// }

		open();
	};

	const queryClient = useQueryClient();

	const handleClickRemoveItem = (itemId: string) => {
		const cartId = localStorage.getItem("cart_id");
		sdk.store.cart
			.deleteLineItem(cartId as string, itemId)
			.then(({ parent: cart }) => {
				// Utiliser le panier mis à jour
				console.log(cart);

				// Invalider et refetch les données du panier
				queryClient.invalidateQueries({
					queryKey: [CART_ITEMS_CART, cartId as string],
				});
			});
	};

	return (
		<div
			className="z-50 h-full"
			onMouseEnter={openAndCancel}
			onMouseLeave={close}
		>
			<Popover className="relative">
				<PopoverButton className="focus:outline-none">
					<Link href={paths.cart} className="flex ">
						<Cart />
						{cart?.cart?.length > 0 && (
							<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-2 left-3  text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:right-2 lg:bottom-0 lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
								{cart.cart.length}
							</p>
						)}
					</Link>
				</PopoverButton>

				<Transition
					show={cartDropdownOpen}
					as={Fragment}
					enter="transition ease-out duration-200"
					enterFrom="opacity-0 translate-y-1"
					enterTo="opacity-100 translate-y-0"
					leave="transition ease-in duration-150"
					leaveFrom="opacity-100 translate-y-0"
					leaveTo="opacity-0 translate-y-1"
				>
					<PopoverPanel
						static
						className="absolute right-0 z-10 w-[400px] mt-3 bg-white border border-gray-200 rounded-lg shadow-xl"
					>
						<div className="p-6">
							<h3 className="mb-4 text-3xl! font-semibold text-gray-900">
								Panier
							</h3>

							{cart?.cart?.length === 0 && (
								<div className="flex flex-col items-center justify-center py-8">
									<svg
										className="w-16 h-16 mb-4 text-gray-300"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
										/>
									</svg>
									<p className="text-center text-gray-500">
										Votre panier est vide
									</p>
									<p className="mt-2 text-sm text-gray-400">
										Ajoutez des produits pour commencer
									</p>
								</div>
							)}

							{/* Exemple d'article dans le panier */}

							<div className="space-y-12">
								{cart?.cart?.map((item: StoreCartLineItem, index: number) => {
									return (
										<div className="flex mb-12 gap-x-8" key={index}>
											<div className="border border-gray-300 rounded-lg size-24">
												{" "}
												<Image
													src={item.thumbnail as string}
													alt={item.product_title as string}
													width={96}
													height={96}
													className="object-cover w-24 h-24 rounded-lg"
												/>
											</div>
											<div className="flex flex-col justify-between w-full text-[1.5rem]!">
												<div className="flex items-center justify-between">
													<p className="truncate line-clamp-1 text-[1.5rem]!">
														{item.product_title} - {item.variant_title}
													</p>
													<p className="font-bold whitespace-nowrap ">
														{formatCurrency_FR(item.unit_price)}
													</p>
												</div>
												<div className="flex items-center justify-between ">
													<p>
														Quantité: <span>{item.quantity}</span>
													</p>

													<button
														onClick={() => handleClickRemoveItem(item.id)}
													>
														<TrashIcon className="w-8 h-8" />
													</button>
												</div>
											</div>
										</div>
									);
								})}
							</div>
							{/* Bouton voir le panier */}
							<button
								className="w-full px-4 py-5 mt-4 text-lg font-bold text-white transition-colors bg-black rounded-md cursor-pointer hover:bg-gray-800"
								onClick={() => router.push(paths.cart)}
							>
								Voir le panier
							</button>
						</div>
					</PopoverPanel>
				</Transition>
			</Popover>
		</div>
	);
};

export default CartDropdown;
