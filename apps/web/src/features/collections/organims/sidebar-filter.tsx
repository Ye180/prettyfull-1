"use client";

import { useTranslations } from "next-intl";

export interface FilterState {
	categories: string[];
	sizes: string[];
	minPrice: string;
	maxPrice: string;
	color: string;
	fits: string[];
	materials: string[];
	availability: "in_stock" | "on_sale" | "all";
}

interface SidebarFilterProps {
	filters: FilterState;
	onChange: (filters: FilterState) => void;
	onClear: () => void;
	className?: string;
}

export const SidebarFilter = ({
	filters,
	onChange,
	onClear,
	className = "",
}: SidebarFilterProps) => {
	const t = useTranslations("CollectionPage.filters");

	const categoryOptions = [
		"Knitwear",
		"T-Shirts",
		"Shirts",
		"Jeans",
		"Jackets",
		"Trousers",
		"Hoodies",
		"Shorts",
	];

	const sizeOptions = ["S", "M", "L", "XL"];
	const fitOptions = ["Slim", "Regular", "Relaxed", "Oversized"];
	const materialOptions = [
		"Cutton",
		"Knit",
		"Wool",
		"Linen",
		"Denim",
		"Polyester Blend",
	];

	const toggleArrayItem = (
		key: "categories" | "sizes" | "fits" | "materials",
		item: string,
	) => {
		const current = filters[key];
		const exists = current.includes(item);
		const updated = exists
			? current.filter((x) => x !== item)
			: [...current, item];
		onChange({ ...filters, [key]: updated });
	};

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
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Catégorie</h4>
				<div className="space-y-2.5">
					{categoryOptions.map((cat) => {
						const isChecked = filters.categories.includes(cat);
						return (
							<label
								key={cat}
								className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none"
							>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => toggleArrayItem("categories", cat)}
									className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
								/>
								<span>{cat}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Size */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">
					{t("taille")}
				</h4>
				<div className="space-y-2.5">
					{sizeOptions.map((size) => {
						const isChecked = filters.sizes.includes(size);
						return (
							<label
								key={size}
								className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none"
							>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => toggleArrayItem("sizes", size)}
									className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
								/>
								<span>{size}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Prix */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Prix</h4>
				<div className="space-y-2">
					<div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200">
						<span className="text-[1.3rem] text-neutral-500">$</span>
						<input
							type="text"
							placeholder="Minimum"
							value={filters.minPrice}
							onChange={(e) =>
								onChange({ ...filters, minPrice: e.target.value })
							}
							className="w-full text-[1.4rem] bg-transparent outline-none placeholder:text-neutral-400"
						/>
					</div>
					<div className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200">
						<span className="text-[1.3rem] text-neutral-500">$</span>
						<input
							type="text"
							placeholder="Maximum"
							value={filters.maxPrice}
							onChange={(e) =>
								onChange({ ...filters, maxPrice: e.target.value })
							}
							className="w-full text-[1.4rem] bg-transparent outline-none placeholder:text-neutral-400"
						/>
					</div>
				</div>
			</div>

			{/* Color */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">
					{t("colors")}
				</h4>
				<div className="flex items-center gap-2 flex-wrap">
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 text-[1.3rem]">
						<span className="w-3.5 h-3.5 rounded-full bg-[#A3E635]" />
						<span>Vert</span>
						<button
							onClick={() => onChange({ ...filters, color: "" })}
							className="text-neutral-400 hover:text-black ml-1 text-sm cursor-pointer"
						>
							-
						</button>
					</div>
					<button
						onClick={() => onChange({ ...filters, color: "Vert" })}
						className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:border-black text-[1.4rem] cursor-pointer"
					>
						+
					</button>
				</div>
			</div>

			{/* Fit */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Coupe</h4>
				<div className="space-y-2.5">
					{fitOptions.map((fit) => {
						const isChecked = filters.fits.includes(fit);
						return (
							<label
								key={fit}
								className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none"
							>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => toggleArrayItem("fits", fit)}
									className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
								/>
								<span>{fit}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Material */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">Matière</h4>
				<div className="space-y-2.5">
					{materialOptions.map((mat) => {
						const isChecked = filters.materials.includes(mat);
						return (
							<label
								key={mat}
								className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none"
							>
								<input
									type="checkbox"
									checked={isChecked}
									onChange={() => toggleArrayItem("materials", mat)}
									className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black accent-black"
								/>
								<span>{mat}</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* Availability */}
			<div className="space-y-3">
				<h4 className="text-[1.5rem] font-semibold text-black">
					Disponibilité
				</h4>
				<div className="space-y-2.5">
					<label className="flex items-center gap-3 cursor-pointer text-[1.4rem] text-neutral-800 hover:text-black select-none">
						<input
							type="radio"
							name="availability"
							checked={filters.availability === "in_stock"}
							onChange={() =>
								onChange({ ...filters, availability: "in_stock" })
							}
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
