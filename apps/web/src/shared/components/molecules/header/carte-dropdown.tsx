"use client";

import { Cart } from "@/components/icons/cart.icon";
import { paths } from "@/lib/routes/paths-en";
import { useRegionStore } from "@/stores/useRegion";
import { useCartStore, type CartItem } from "@prettyfull/store";
import {
	Popover,
	PopoverButton,
	PopoverPanel,
	Transition,
} from "@headlessui/react";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";

const CartDropdown = ({ cart }: { cart: CartItem[] }) => {
	const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

	const router = useRouter();

	const regions = useRegionStore((state) => state.region);
	const removeItem = useCartStore((state) => state.removeItem);

	const open = () => setCartDropdownOpen(true);
	const close = () => setCartDropdownOpen(false);

	const openAndCancel = () => {
		// if (activeTimer) {
		// 	clearTimeout(activeTimer);
		// }

		open();
	};

	const handleClickRemoveItem = (productId: string) => {
		removeItem(productId);
	};

	return (
		<div className="h-full" onMouseEnter={openAndCancel} onMouseLeave={close}>
			<Popover className="relative z-30">
				<PopoverButton className="focus:outline-none">
					<Link href={paths.cart} className="flex">
						<Cart />
						{cart.length > 0 && (
							<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-1 -right-1 text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
								{cart.reduce((total, item) => total + item.quantity, 0)}
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
						className="absolute right-0 z-50 w-[400px] mt-3 bg-white border border-gray-200 rounded-lg shadow-xl max-md:hidden"
					>
						<div className="p-6">
							<h3 className="mb-4 text-3xl! font-semibold text-gray-900">
								Panier
							</h3>

							{cart.length === 0 && (
								<div className="flex flex-col justify-center items-center py-8">
									<svg
										className="mb-4 w-16 h-16 text-gray-300"
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
								{cart.map((item) => {
									const variantLabel = Object.values(
										item.selectedVariants || {},
									).join(" / ");
									return (
										<div className="flex gap-x-8 mb-12" key={item.productId}>
											<div className="overflow-hidden rounded-lg border border-gray-300 size-24">
												{" "}
												<Image
													src={item.product.image || "/assets/product_1.jpg"}
													alt={item.product.name || ""}
													width={96}
													height={96}
													className="object-fill rounded-lg"
													unoptimized
												/>
											</div>
											<div
												className="flex flex-col justify-between w-full text-[1.5rem]! truncate"
												title={`${item.product.name} - ${variantLabel}`}
											>
												<div className="flex justify-between items-center">
													<p className="truncate line-clamp-1 text-[1.5rem]!">
														{item.product.name}
														{variantLabel ? ` - ${variantLabel}` : ""}
													</p>
													<p className="font-bold whitespace-nowrap">
														{formatCurrency_FR(
															item.unitPrice?.amount ?? 0,
															regions?.currency_code === "xof" ? "FCFA" : "$",
														)}
													</p>
												</div>
												{variantLabel && (
													<div>
														<p className="text-gray-500 text-[1.3rem]!">
															Taille: {variantLabel}
														</p>
													</div>
												)}
												<div className="flex justify-between items-center">
													<p>
														Quantité: <span>{item.quantity}</span>
													</p>

													<button
														onClick={() => handleClickRemoveItem(item.productId)}
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
								className="px-4 py-5 mt-4 w-full text-lg font-bold text-white bg-black rounded-md transition-colors cursor-pointer hover:bg-gray-800"
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
