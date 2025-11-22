import { Cart } from "@/components/icons/cart.icon";
import {
	Popover,
	PopoverButton,
	PopoverPanel,
	Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";

const CartDropdown = () => {
	const [cartDropdownOpen, setCartDropdownOpen] = useState(false);

	const open = () => setCartDropdownOpen(true);
	const close = () => setCartDropdownOpen(false);

	const openAndCancel = () => {
		// if (activeTimer) {
		// 	clearTimeout(activeTimer);
		// }

		open();
	};

	return (
		<div
			className="z-50 h-full"
			onMouseEnter={openAndCancel}
			onMouseLeave={close}
		>
			<Popover className="relative">
				<PopoverButton className="focus:outline-none">
					<span>
						<Cart />
					</span>
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
							<h3 className="mb-4 text-lg font-semibold text-gray-900">
								Panier
							</h3>

							{/* Contenu du panier - vide pour le moment */}
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

							{/* Bouton voir le panier */}
							<button className="w-full px-4 py-3 mt-4 text-white transition-colors bg-black rounded-md hover:bg-gray-800">
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
