"use client";

import type { Availability } from "../hooks/use-collection-filters";
import { useTranslations } from "next-intl";

export interface FilterState {
	/** Slug du rayon actif ; `""` = tout le catalogue. Un seul à la fois. */
	categorySlug: string;
	sizes: string[];
	colors: string[];
	minPrice: string;
	maxPrice: string;
	availability: Availability;
}

export interface CategoryOption {
	slug: string;
	name: string;
}

export interface ColorOption {
	name: string;
	hex: string | null;
}

interface SidebarFilterProps {
	filters: FilterState;
	onChange: (filters: FilterState) => void;
	onClear: () => void;
	/** Rayons proposés ; section masquée si vide (page déjà scopée à un rayon). */
	categoryOptions?: CategoryOption[];
	/** Tailles distinctes du catalogue regardé (§ `useCollectionFacets`). */
	sizeOptions: string[];
	/** Couleurs distinctes du catalogue regardé. */
	colorOptions: ColorOption[];
	isLoadingFacets?: boolean;
	className?: string;
}

const toggleItem = (list: string[], item: string): string[] =>
	list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

export const SidebarFilter = ({
	filters,
	onChange,
	onClear,
	categoryOptions = [],
	sizeOptions,
	colorOptions,
	isLoadingFacets = false,
	className = "",
}: SidebarFilterProps) => {
	const t = useTranslations("CollectionPage.filters");

	return (
		<aside
			className={`w-full max-w-[280px] bg-white space-y-8 pr-6 border-r border-neutral-100 ${className}`}
		>
			{/* Top Header */}
			<div className="flex items-center justify-between pb-4 border-b border-neutral-100">
				<div className="flex items-center gap-2">
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
					</svg>
					<h3 className="text-[1.8rem] font-bold text-black">Filtres</h3>
				</div>
				<button
					onClick={onClear}
					className="text-[1.3rem] font-medium text-red-500 hover:text-red-700 transition-colors cursor-pointer"
				>
					{t("clear")}
				</button>
			</div>

			{/* Category */}
			{categoryOptions.length > 0 && (
				<div className="space-y-3">
					<h4 className="text-[1.5rem] font-semibold text-black">Catégorie</h4>
					<div className="space-y-2.5">
						{categoryOptions.map((category) => {
							const isChecked = filters.categorySlug === category.slug;
							return (
								<label
									key={category.slug}
									className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none"
								>
									<input
										type="checkbox"
										checked={isChecked}
										onChange={() =>
											onChange({
												...filters,
												categorySlug: isChecked ? "" : category.slug,
											})
										}
										className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
									/>
									<span>{category.name}</span>
								</label>
							);
						})}
					</div>
				</div>
			)}

			{/* Size */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">{t("taille")}</h4>
				{sizeOptions.length > 0 ? (
					<div className="flex flex-wrap gap-2">
						{sizeOptions.map((size) => {
							const isChecked = filters.sizes.includes(size);
							return (
								<button
									key={size}
									type="button"
									onClick={() => onChange({ ...filters, sizes: toggleItem(filters.sizes, size) })}
									className={`px-4 py-1.5 rounded-full border text-[1.3rem] font-medium transition-colors cursor-pointer ${
										isChecked
											? "bg-black text-white border-black"
											: "border-neutral-300 text-neutral-800 hover:border-black"
									}`}
								>
									{size}
								</button>
							);
						})}
					</div>
				) : (
					<p className="text-[1.3rem] text-neutral-400">
						{isLoadingFacets ? "Chargement…" : "Aucune taille disponible"}
					</p>
				)}
			</div>

			{/* Prix */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Prix</h4>
				<div className="space-y-2">
					<div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200">
						<span className="text-[1.3rem] text-neutral-500">FCFA</span>
						<input
							type="number"
							min={0}
							placeholder="Minimum"
							value={filters.minPrice}
							onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
							className="w-full text-[1.4rem] bg-transparent outline-none placeholder:text-neutral-400"
						/>
					</div>
					<div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200">
						<span className="text-[1.3rem] text-neutral-500">FCFA</span>
						<input
							type="number"
							min={0}
							placeholder="Maximum"
							value={filters.maxPrice}
							onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
							className="w-full text-[1.4rem] bg-transparent outline-none placeholder:text-neutral-400"
						/>
					</div>
				</div>
			</div>

			{/* Color */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">{t("colors")}</h4>
				{colorOptions.length > 0 ? (
					<div className="flex items-center gap-2 flex-wrap">
						{colorOptions.map((color) => {
							const isChecked = filters.colors.includes(color.name);
							return (
								<button
									key={color.name}
									type="button"
									onClick={() => onChange({ ...filters, colors: toggleItem(filters.colors, color.name) })}
									className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[1.3rem] transition-colors cursor-pointer ${
										isChecked ? "border-black bg-neutral-100" : "border-neutral-200 hover:border-black"
									}`}
								>
									<span
										className="w-3.5 h-3.5 rounded-full border border-neutral-200"
										style={{ backgroundColor: color.hex ?? "#e5e5e5" }}
									/>
									<span>{color.name}</span>
								</button>
							);
						})}
					</div>
				) : (
					<p className="text-[1.3rem] text-neutral-400">
						{isLoadingFacets ? "Chargement…" : "Aucune couleur disponible"}
					</p>
				)}
			</div>

			{/* Availability */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Disponibilité</h4>
				<div className="space-y-2.5">
					<label className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none">
						<input
							type="radio"
							name="availability"
							checked={filters.availability === "all"}
							onChange={() => onChange({ ...filters, availability: "all" })}
							className="w-4 h-4 accent-black"
						/>
						<span>Tous les produits</span>
					</label>
					<label className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none">
						<input
							type="radio"
							name="availability"
							checked={filters.availability === "in_stock"}
							onChange={() => onChange({ ...filters, availability: "in_stock" })}
							className="w-4 h-4 accent-black"
						/>
						<span>En stock</span>
					</label>
					<label className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none">
						<input
							type="radio"
							name="availability"
							checked={filters.availability === "on_sale"}
							onChange={() => onChange({ ...filters, availability: "on_sale" })}
							className="w-4 h-4 accent-black"
						/>
						<span>En promotion</span>
					</label>
				</div>
			</div>
		</aside>
	);
};

export default SidebarFilter;
