"use client";

import { useGetRegion } from "@/shared/api/medusa/get-region";
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
import { useState } from "react";

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

	const [open, setOpen] = useState(false);
	const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
		CURRENCIES[0]!
	); // XOF par défaut
	const [selectedLanguage, setSelectedLanguage] = useState<Language>(
		LANGUAGES[0]!
	); // FR par défaut
	const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

	const { data: regions, isLoading: regionsLoading } = useGetRegion();

	const onClose = () => setOpen(false);

	const handleCurrencySelect = (currency: Currency) => {
		setSelectedCurrency(currency);
	};

	const handleLanguageSelect = (language: Language) => {
		setSelectedLanguage(language);
		// Redirection vers la nouvelle locale
		router.push(`/${language.code}${pathname.replace(/^\/(en|fr|es)/, "")}`);
		onClose();
	};

	const handleRegionSelect = (regionId: string) => {
		setSelectedRegion(regionId);
		// Ici vous pouvez ajouter la logique pour sauvegarder la région
	};

	const handleApply = () => {
		// Appliquer les changements
		console.log("Applied:", {
			selectedCurrency,
			selectedLanguage,
			selectedRegion,
		});
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
					{selectedLanguage.code.toUpperCase()}
				</span>
				<span className="text-gray-300">/</span>
				<span className="text-[1.2rem] lg:text-[1.4rem] font-medium text-gray-700">
					{selectedCurrency.code}
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
					{/* Section Langue */}
					{/* <div className="space-y-3">
						<div className="flex gap-2 items-center">
							<Globe className="text-gray-600 size-5" />
							<h3 className="text-[1.4rem]! font-semibold! text-gray-800">
								Langue
							</h3>
						</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							{LANGUAGES.map((lang) => (
								<button
									key={lang.code}
									onClick={() => handleLanguageSelect(lang)}
									className={cn(
										"flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200",
										selectedLanguage.code === lang.code
											? "border-black bg-black text-white"
											: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
									)}
								>
									<span className="text-xl">{lang.flag}</span>
									<span className="text-[1.2rem] font-medium">{lang.name}</span>
									{selectedLanguage.code === lang.code && (
										<Check className="ml-auto size-4" />
									)}
								</button>
							))}
						</div>
					</div> */}

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
							{CURRENCIES.map((currency) => (
								<button
									key={currency.code}
									onClick={() => handleCurrencySelect(currency)}
									className={cn(
										"flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
										selectedCurrency.code === currency.code
											? "border-black bg-black text-white"
											: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
									)}
								>
									<div className="flex gap-3 items-center">
										<span
											className={cn(
												"flex items-center justify-center size-8 rounded-full text-[1.2rem] font-bold",
												selectedCurrency.code === currency.code
													? "bg-white text-black"
													: "bg-gray-100 text-gray-700"
											)}
										>
											{currency.symbol}
										</span>
										<div className="text-left">
											<p className="text-[1.2rem] font-semibold">
												{currency.code}
											</p>
											<p
												className={cn(
													"text-[1rem]",
													selectedCurrency.code === currency.code
														? "text-gray-300"
														: "text-gray-500"
												)}
											>
												{currency.name}
											</p>
										</div>
									</div>
									{selectedCurrency.code === currency.code && (
										<Check className="size-5" />
									)}
								</button>
							))}
						</div>
					</div>

					{/* Divider */}
					<div className="h-px bg-gray-200" />

					{/* Section Région (Medusa) */}
					{/* <div className="space-y-3">
						<h3 className="text-[1.4rem] font-semibold text-gray-800">
							Région de livraison
						</h3>
						{regionsLoading ? (
							<div className="flex gap-3">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="w-32 h-12 bg-gray-100 rounded-xl animate-pulse"
									/>
								))}
							</div>
						) : (
							<div className="flex flex-wrap gap-3">
								{regions?.map((region: any) => (
									<button
										key={region.id}
										onClick={() => handleRegionSelect(region.id)}
										className={cn(
											"flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200",
											selectedRegion === region.id
												? "border-black bg-black text-white"
												: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50"
										)}
									>
										<span className="text-[1.2rem] font-medium">
											{region.name}
										</span>
										{selectedRegion === region.id && (
											<Check className="size-4" />
										)}
									</button>
								))}
							</div>
						)}
					</div> */}

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
