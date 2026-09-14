"use client";

import { paths } from "@/lib/routes/paths-en";
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerFooter,
	DrawerTrigger,
} from "@prettyfull/ui";
import { useWishlistStore } from "@prettyfull/store";
import { formatCurrency_FR } from "@prettyfull/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import Image from "next/image";

const WishlistDrawer = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const items = useWishlistStore((state) => state.items);
	const removeItem = useWishlistStore((state) => state.removeItem);

	const goToWishlist = () => {
		setOpen(false);
		router.push(paths.wishlist);
	};

	return (
		<Drawer direction="bottom" open={open} onOpenChange={setOpen}>
			<DrawerTrigger
				className="relative flex focus:outline-none cursor-pointer hover:opacity-70 transition-opacity"
				aria-label="Voir ma liste de souhaits"
			>
				<Heart className="w-6 h-6 text-[#262626]" />
				{items.length > 0 && (
					<p className="absolute flex items-center justify-center text-[0.8rem] border bottom-1 -right-1 text-center content-center w-6 h-6 lg:w-[1.8rem] lg:h-[1.8rem] text-xs text-white bg-red-500 rounded-full lg:text-[1rem] font-semibold lg:border-2 lg:p-2 border-white">
						{items.length}
					</p>
				)}
			</DrawerTrigger>

			<DrawerContent
				title="Liste de souhaits"
				className="h-[85vh]! sm:h-[60vh]! md:h-[50vh]! rounded-none! border-t-0!"
			>
				<div className="flex-1 min-h-0 overflow-y-auto px-6">
					{items.length === 0 ? (
						<div className="flex flex-col justify-center items-center py-16 text-center">
							<div className="flex justify-center items-center mb-6 w-16 h-16 bg-gray-100 rounded-full">
								<Heart className="w-6 h-6 text-gray-400" />
							</div>
							<span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
								Liste vide
							</span>
							<h3 className="mt-3 text-xl font-bold text-gray-900">
								Votre liste de souhaits est vide
							</h3>
							<p className="mt-2 max-w-xs text-sm text-gray-500">
								Ajoutez vos coups de cœur pour les retrouver ici.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
							{items.map((item) => (
								<div
									key={item.productId}
									className="flex gap-3 border border-gray-100 p-3"
								>
									<div className="relative w-20 h-20 bg-[#F4F4F5] overflow-hidden shrink-0">
										<Image
											src={
												item.product.image ||
												"/assets/product5.webp"
											}
											alt={item.product.name}
											fill
											sizes="80px"
											className="object-contain p-1"
											unoptimized
										/>
									</div>
									<div className="flex flex-col justify-between flex-1 min-w-0">
										<p className="text-sm font-semibold text-gray-900 line-clamp-2">
											{item.product.name}
										</p>
										{item.product.price && (
											<p className="text-sm font-bold text-gray-900">
												{formatCurrency_FR(
													item.product.price.amount,
													item.product.price.currency === "xof" ? "FCFA" : "$",
												)}
											</p>
										)}
										<button
											type="button"
											onClick={() => removeItem(item.productId)}
											aria-label={`Retirer ${item.product.name}`}
											className="self-start p-1 -ml-1 text-rose-500 hover:text-rose-600 cursor-pointer"
										>
											<TrashIcon size={16} />
										</button>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
				<DrawerFooter>
					<Button variant="default" shape="square" fullWidth onClick={goToWishlist}>
						<span className="text-base font-semibold">Voir ma liste de souhaits</span>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

export default WishlistDrawer;
