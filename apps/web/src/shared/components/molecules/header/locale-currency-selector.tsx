"use client";

import { useGetRegion } from "@/shared/api/medusa/get-region";
import { setLocaleCookie, type AppLocale } from "@/shared/lib/locale";
import { useRegionStore } from "@/stores/useRegion";
import type { StoreRegion } from "@/lib/store-api/types";
import { Check, ChevronDown, CustomModal, Globe } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LOCALES: { code: AppLocale; label: string; badge: string }[] = [
	{ code: "fr", label: "Français", badge: "FR" },
	{ code: "en", label: "English", badge: "EN" },
];

/**
 * Langue + devise réunies dans un seul contrôle compact - deux pastilles
 * séparées (toggle FR/EN + bouton devise) prenaient trop de place dans le
 * header pour deux réglages qu'on ne change presque jamais.
 */
export function LocaleCurrencySelector() {
	const t = useTranslations("Header.currencyLanguage");
	const locale = useLocale() as AppLocale;
	const router = useRouter();
	const queryClient = useQueryClient();

	const setCurrentRegion = useRegionStore((state) => state.setRegion);
	const currentRegion = useRegionStore((state) => state.region);
	const { data: regions, isLoading: regionsLoading } = useGetRegion();

	const [open, setOpen] = useState(false);
	const [selectedLocale, setSelectedLocale] = useState<AppLocale>(locale);
	const [selectedRegion, setSelectedRegion] = useState<StoreRegion | null>(null);

	// Réinitialisé à l'état réel à chaque ouverture - annuler la modale ne doit
	// pas laisser une sélection en suspens pour la prochaine fois.
	useEffect(() => {
		if (open) {
			setSelectedLocale(locale);
			setSelectedRegion(currentRegion ?? regions?.[0] ?? null);
		}
	}, [open, locale, currentRegion, regions]);

	const hasChanges =
		selectedLocale !== locale || selectedRegion?.id !== currentRegion?.id;

	const handleApply = () => {
		if (selectedRegion && selectedRegion.id !== currentRegion?.id) {
			setCurrentRegion(selectedRegion);
		}
		setOpen(false);
		if (selectedLocale !== locale) {
			setLocaleCookie(selectedLocale);
			// Les adaptateurs traduisent les données API au moment du fetch : le
			// cache React Query garde l'ancienne langue tant qu'on ne le relance pas.
			queryClient.invalidateQueries();
			router.refresh();
		}
	};

	const currentLocaleMeta = LOCALES.find((l) => l.code === locale);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="flex gap-2 items-center px-3 py-2 bg-white rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer group hover:bg-gray-50 hover:border-gray-300"
			>
				<Globe className="text-gray-500 w-[18px] h-[18px] group-hover:text-gray-700" />
				<span className="text-[1.2rem] lg:text-[1.3rem] font-semibold text-gray-700 whitespace-nowrap">
					{currentLocaleMeta?.badge ?? locale.toUpperCase()}
					<span className="mx-1 text-gray-300">·</span>
					{currentRegion?.currency_code?.toUpperCase() ?? "XOF"}
				</span>
				<ChevronDown className="size-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:translate-y-0.5" />
			</button>

			<CustomModal
				open={open}
				onClose={() => setOpen(false)}
				title={t("title")}
				description={t("description")}
				className="w-[95vw] lg:w-[42vw] p-0 overflow-hidden rounded-[2rem]"
				titleClassName="text-[1.8rem]! lg:text-[2.2rem]! font-bold"
			>
				<div className="px-6 pb-6 space-y-6">
					<div className="h-px bg-gray-200" />

					{/* Langue */}
					<div className="space-y-3">
						<h3 className="text-[1.4rem] font-semibold tracking-wider text-gray-800 uppercase">
							{t("languageLabel")}
						</h3>
						<div className="grid grid-cols-2 gap-3">
							{LOCALES.map((item) => {
								const isSelected = selectedLocale === item.code;
								return (
									<button
										key={item.code}
										type="button"
										onClick={() => setSelectedLocale(item.code)}
										className={cn(
											"flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
											isSelected
												? "border-black bg-black text-white"
												: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50",
										)}
									>
										<div className="flex gap-3 items-center">
											<span
												className={cn(
													"flex items-center justify-center size-10 rounded-full text-[1rem] font-bold",
													isSelected
														? "bg-white text-black"
														: "bg-gray-100 text-gray-700",
												)}
											>
												{item.badge}
											</span>
											<p className="text-[1.3rem] font-semibold">{item.label}</p>
										</div>
										{isSelected && <Check className="size-5 shrink-0" />}
									</button>
								);
							})}
						</div>
					</div>

					<div className="h-px bg-gray-200" />

					{/* Devise */}
					<div className="space-y-3">
						<h3 className="text-[1.4rem] font-semibold tracking-wider text-gray-800 uppercase">
							{t("currencyLabel")}
						</h3>
						<div className="grid grid-cols-2 gap-3">
							{regionsLoading || !regions?.length ? (
								<div className="col-span-2 py-4 text-[1.3rem] text-center text-gray-400">
									{t("loadingCurrencies")}
								</div>
							) : (
								regions.map((region) => {
									const isSelected = selectedRegion?.id === region.id;
									return (
										<button
											key={region.id}
											type="button"
											onClick={() => setSelectedRegion(region)}
											className={cn(
												"flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer",
												isSelected
													? "border-black bg-black text-white"
													: "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50",
											)}
										>
											<div className="flex gap-3 items-center">
												<span
													className={cn(
														"flex items-center justify-center size-10 rounded-full text-[1rem] font-bold",
														isSelected
															? "bg-white text-black"
															: "bg-gray-100 text-gray-700",
													)}
												>
													{region.currency_code?.toUpperCase() === "USD"
														? "$"
														: "XOF"}
												</span>
												<p className="text-[1.3rem] font-semibold text-left">
													{region.name}
												</p>
											</div>
											{isSelected && <Check className="size-5 shrink-0" />}
										</button>
									);
								})
							)}
						</div>
					</div>

					<div className="h-px bg-gray-200" />

					<button
						type="button"
						onClick={handleApply}
						disabled={!hasChanges}
						className="w-full py-4 text-[1.4rem] font-semibold text-white bg-black rounded-xl transition-colors duration-200 cursor-pointer hover:bg-gray-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{t("applyButton")}
					</button>
				</div>
			</CustomModal>
		</>
	);
}

export default LocaleCurrencySelector;
