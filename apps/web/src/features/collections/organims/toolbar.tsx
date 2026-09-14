"use client";

import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import Filter from "@/features/homepage/molecules/collections/apps/filter";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	FilterIcon,
	Search,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { SortField } from "../hooks/use-collection-filters";

const SORT_OPTIONS: { value: string; sort: SortField; order: "asc" | "desc"; label: string }[] = [
	{ value: "createdAt:desc", sort: "createdAt", order: "desc", label: "Newest" },
	{ value: "publishedAt:desc", sort: "publishedAt", order: "desc", label: "Recently published" },
	{ value: "basePrice:asc", sort: "basePrice", order: "asc", label: "Price: low to high" },
	{ value: "basePrice:desc", sort: "basePrice", order: "desc", label: "Price: high to low" },
	{ value: "name:asc", sort: "name", order: "asc", label: "Name: A to Z" },
];

interface ToolbarProps {
	activeCategorySlug: string;
	q: string;
	sort: SortField;
	order: "asc" | "desc";
	onSearch: (q: string) => void;
	onSortChange: (sort: SortField, order: "asc" | "desc") => void;
	onClearFilters: () => void;
	minPrice?: number | null;
	maxPrice?: number | null;
	onPriceChange?: (minPrice: number | null, maxPrice: number | null) => void;
}

const Toolbar = ({
	activeCategorySlug,
	q,
	sort,
	order,
	onSearch,
	onSortChange,
	onClearFilters,
	minPrice,
	maxPrice,
	onPriceChange,
}: ToolbarProps) => {
	const { data: categories } = useGetCategory();
	const [searchDraft, setSearchDraft] = useState(q);
	const [filterOpen, setFilterOpen] = useState(false);

	// Debounce : évite un fetch par frappe tout en gardant l'input réactif.
	useEffect(() => {
		const id = setTimeout(() => {
			if (searchDraft !== q) onSearch(searchDraft);
		}, 400);
		return () => clearTimeout(id);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchDraft]);

	const activeSortValue = `${sort}:${order}`;

	return (
		<div className="sticky top-16 z-20 py-3 space-y-3 bg-white/95 backdrop-blur border-b border-neutral-200">
			{/* Category pills */}
			{categories && categories.length > 0 && (
				<div className="flex overflow-x-auto gap-2 pb-1 max-lg:overflow-x-auto scrolbarRecomandation">
					{categories.map((category) => (
						<Link
							key={category.id}
							href={COLLECTION_PATHS.collectionDetail(category.handle)}
							className={cn(
								"shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-[1.2rem] uppercase tracking-wide transition-colors",
								category.handle === activeCategorySlug
									? "border-black bg-black text-white"
									: "border-neutral-300 text-neutral-600 hover:border-black hover:text-black",
							)}
						>
							{category.name}
						</Link>
					))}
				</div>
			)}

			<div className="flex flex-wrap gap-3 items-center justify-between">
				<div className="flex gap-2 items-center px-3 py-2 rounded-full border border-neutral-200 max-w-xs w-full">
					<Search className="w-4 h-4 text-neutral-400 shrink-0" />
					<input
						type="text"
						value={searchDraft}
						onChange={(e) => setSearchDraft(e.target.value)}
						placeholder="Rechercher dans cette collection..."
						className="flex-1 min-w-0 text-[1.2rem] bg-transparent border-none outline-none placeholder:text-neutral-400"
					/>
				</div>

				<div className="flex gap-3 items-center">
					<Select
						value={activeSortValue}
						onValueChange={(value) => {
							const option = SORT_OPTIONS.find((o) => o.value === value);
							if (option) onSortChange(option.sort, option.order);
						}}
					>
						<SelectTrigger className="rounded-full">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent>
							{SORT_OPTIONS.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Drawer direction="right" open={filterOpen} onOpenChange={setFilterOpen}>
						<Button
							type="button"
							variant="outline"
							shape="rounded"
							className="p-0! w-11! h-11 shrink-0"
							onClick={() => setFilterOpen(true)}
							aria-label="Filters"
						>
							<FilterIcon className="w-5 h-5" />
						</Button>
						<DrawerContent title="Filters" className="p-5 overflow-y-auto">
							<Filter
								minPrice={minPrice}
								maxPrice={maxPrice}
								onPriceChange={onPriceChange}
								onApply={() => setFilterOpen(false)}
								onClear={() => {
									onClearFilters();
									setSearchDraft("");
									setFilterOpen(false);
								}}
							/>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button type="button" variant="outline">
										Close
									</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</div>
			</div>
		</div>
	);
};

export default Toolbar;
