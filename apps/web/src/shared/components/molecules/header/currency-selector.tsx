"use client";

import { useUpdateCartRegion } from "@/features/cart/api/medusa/update-cart-region";
import { useGetRegion } from "@/shared/api/medusa/get-region";
import { useRegionStore } from "@/stores/useRegion";
import {
	Button,
	Check,
	ChevronDown,
	CustomModal,
	Globe,
	Wallet,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types pour les devises et langues
type Currency = {
	code: string;
	symbol: string;
	name: string;
};

type Language = {
	code: string;
	name: string;
	flag: string;
};

// Données statiques
const CURRENCIES: Currency[] = [
	{ code: "USD", symbol: "$", name: "US Dollar" },
	{ code: "XOF", symbol: "CFA", name: "Franc CFA" },
];

const LANGUAGES: Language[] = [
	{ code: "fr", name: "Français", flag: "🇫🇷" },
	{ code: "en", name: "English", flag: "🇬🇧" },
	{ code: "es", name: "Español", flag: "🇪🇸" },
];

export function CurrencySelector() {
	const router = useRouter();
	const pathname = usePathname();

	const setCurrentRegion = useRegionStore((state) => state.setRegion);

	const { data: regions, isLoading: regionsLoading } = useGetRegion();
	const currentRegion = useRegionStore((state) => state.region);
	const { mutate: updateCartRegion } = useUpdateCartRegion();

	const [open, setOpen] = useState(false);
	const [selectedRegion, setSelectedRegion] = useState<any>(null);

	const onClose = () => setOpen(false);

	const handleRegionSelect = (region: any) => {
		setSelectedRegion(region);
	};

	// Initialiser selectedRegion avec la région du store ou la première région disponible
	useEffect(() => {
		if (!regionsLoading && regions?.length) {
			// Si une région est déjà dans le store, l'utiliser
			if (currentRegion) {
				const found = regions.find((r) => r.id === currentRegion.id);
				setSelectedRegion(found || regions[0]);
			} else {
				setSelectedRegion(regions[0]);
				setCurrentRegion(regions[0] ?? null); // Sauvegarder la région par défaut
			}
		}
	}, [regionsLoading, regions, currentRegion]);

	const handleApply = () => {
		// Sauvegarder la région sélectionnée dans le store (persiste automatiquement)
		if (selectedRegion) {
			setCurrentRegion(selectedRegion);

			// Mettre à jour la région du panier pour que les prix soient recalculés
			const cartId = localStorage.getItem("cart_id");
			if (cartId) {
				updateCartRegion({
					cartId,
					regionId: selectedRegion.id,
				});
			}
		}
		onClose();
	};

	return (
		<>
			{/* Trigger Button */}
			<button
				onClick={() => setOpen(true)}
				className="flex gap-2 items-center px-3 py-2 bg-white rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-50 hover:border-gray-300"
			>
				<Globe className="text-gray-500 size-4 group-hover:text-gray-700" />
				<span className="text-[1.2rem] lg:text-[1.4rem] font-medium text-gray-700">
					{selectedRegion?.currency_code?.toUpperCase()}
				</span>
				<span className="text-gray-300">/</span>
				<span className="text-[1.2rem] lg:text-[1.4rem] font-medium text-gray-700">
					EN
				</span>
				<ChevronDown className="size-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-y-0.5" />
			</button>

			{/* Modal */}
			<CustomModal
				open={open}
				onClose={onClose}
				title="Préférences"
				description="Choisissez votre langue et devise"
				close={true}
				className="max-w-2xl! w-[95vw] lg:w-[40vw] p-0 overflow-hidden"
				titleClassName="text-[1.8rem]! lg:text-[2.2rem]! font-bold"
			>
				<div className="px-6 pb-6 space-y-6">
					{/* Divider */}
					<div className="h-px bg-gray-200" />

					{/* Section Devise */}
					<div className="space-y-3">
						<div className="flex gap-2 items-center">
							<Wallet className="text-gray-600 size-5" />
							<h3 className="text-[2rem]! tracking-wider font-semibold! text-gray-800">
								Devise
							</h3>
						</div>
						<div className="grid grid-cols-2 gap-3">
							{regions?.map((region) => (
								<button
									key={region.id}
									onClick={() => handleRegionSelect(region)}
									className={cn(
										"flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
										selectedRegion?.id === region.id
											? "border-black bg-black text-white"
											: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50",
									)}
								>
									<div className="flex gap-3 items-center">
										<span
											className={cn(
												"flex items-center justify-center size-12 rounded-full p-3 text-[1rem] font-bold",
												selectedRegion?.id === region.id
													? "bg-white text-black"
													: "bg-gray-100 text-gray-700",
											)}
										>
											{region.currency_code?.toUpperCase() === "USD"
												? "$"
												: "XOF"}
										</span>
										<div className="text-left">
											<p className="text-[1.2rem] font-semibold">
												{region.name}
											</p>
											<p
												className={cn(
													"text-[1rem]",
													selectedRegion === region.currency_code
														? "text-gray-300"
														: "text-gray-500",
												)}
											>
												{region.name}
											</p>
										</div>
									</div>
									{selectedRegion === region.currency_code && (
										<Check className="size-5" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Divider */}
					<div className="h-px bg-gray-200" />

					{/* Apply Button */}
					<Button
						onClick={handleApply}
						className="w-full py-8! mt-4 text-[1.4rem] font-semibold text-white bg-black rounded-xl hover:bg-gray-800 transition-colors duration-200 active:scale-[0.98]"
					>
						Appliquer les préférences
					</Button>
				</div>
			</CustomModal>
		</>
	);
}
