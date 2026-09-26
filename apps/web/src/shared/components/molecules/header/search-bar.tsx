"use client";

import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { fetchProducts } from "@/lib/store-api";
import { PAGES_PATHS, PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { cn } from "@prettyfull/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";

type SearchBarProps = {
	className?: string;
	onNavigate?: () => void;
	/** "default" : champ encadré (menu mobile). "minimal" : icône + texte sans cadre, façon barre de header desktop. */
	variant?: "default" | "minimal";
};

const MIN_QUERY_LENGTH = 2;

const useDebouncedValue = <T,>(value: T, delay = 250): T => {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return debounced;
};

const SearchBar = ({ className, onNavigate, variant = "default" }: SearchBarProps) => {
	const isMinimal = variant === "minimal";
	const t = useTranslations("HomePage.header");
	const router = useRouter();

	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebouncedValue(query.trim(), 250);
	const hasQuery = debouncedQuery.length >= MIN_QUERY_LENGTH;

	const { data: categories } = useGetCategory();

	const filteredCategories = useMemo(() => {
		if (!hasQuery || !categories) return [];
		const q = debouncedQuery.toLowerCase();
		return categories
			.filter((cat: any) => cat.name?.toLowerCase().includes(q))
			.slice(0, 6);
	}, [categories, debouncedQuery, hasQuery]);

	const { data: products, isFetching } = useQuery({
		queryKey: ["search-products", debouncedQuery],
		queryFn: () => {
			// Recherche côté serveur : plein texte insensible aux accents,
			// adossée à l'index du catalogue plutôt qu'à un filtre en mémoire
			// sur des données chargées d'avance.
			return fetchProducts({ q: debouncedQuery, limit: 12 });
		},
		select: (data) => data.products,
		enabled: hasQuery,
		staleTime: 30_000,
	});

	// Close on outside click
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const handleNavigate = () => {
		setIsOpen(false);
		setQuery("");
		onNavigate?.();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;
		router.push(`/search?q=${encodeURIComponent(query.trim())}`);
		handleNavigate();
	};

	const showDropdown = isOpen && hasQuery;
	const hasResults =
		filteredCategories.length > 0 || (products && products.length > 0);

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			<form
				onSubmit={handleSubmit}
				className={cn(
					"flex items-center",
					isMinimal
						? "gap-2 py-2"
						: "pl-4 bg-white rounded-lg border border-gray-300 focus-within:border-amber-600",
				)}
			>
				<Search className={cn("shrink-0", isMinimal ? "w-4 h-4 text-gray-500" : "hidden")} />
				<input
					type="text"
					value={query}
					onChange={(e) => {
						setQuery(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					placeholder={t("placeholder")}
					className={cn(
						"flex-1 min-w-0 text-[1.4rem] font-light text-black bg-transparent border-none outline-none placeholder:font-light placeholder:text-gray-400 placeholder:text-[1.3rem]",
						isMinimal ? "py-0" : "py-2.5",
					)}
				/>
				{!isMinimal && (
					<button
						type="submit"
						aria-label="Rechercher"
						className="flex justify-center items-center w-11 h-11 text-white bg-amber-600 rounded-r-lg transition-colors cursor-pointer shrink-0 hover:bg-amber-700"
					>
						<Search className="w-4 h-4" />
					</button>
				)}
			</form>

			{showDropdown && (
				<div
					className={cn(
						"absolute top-full z-50 mt-2 bg-white rounded-lg border border-gray-200 shadow-xl max-h-[80vh] overflow-y-auto max-lg:w-full w-[min(400px,70vw)]",
						isMinimal ? "left-0" : "right-0",
					)}
				>
					{!hasResults && !isFetching && (
						<div className="p-6 text-center text-[1.3rem] text-gray-500">
							Aucun résultat pour « {debouncedQuery} »
						</div>
					)}

					{isFetching && !hasResults && (
						<div className="p-6 text-center text-[1.3rem] text-gray-500">
							Recherche en cours...
						</div>
					)}

					{filteredCategories.length > 0 && (
						<div className="px-6 py-5 border-b border-gray-100">
							<p className="pb-3 text-[1.2rem] font-bold tracking-wider text-gray-900">
								Catégories populaires
							</p>
							<div className="flex flex-wrap gap-2">
								{filteredCategories.map((cat: any) => (
									<Link
										key={cat.id}
										href={PAGES_PATHS.pageDetail(cat.handle)}
										onClick={handleNavigate}
										className="px-4 py-2 text-[1.2rem] text-gray-800 rounded-md border border-gray-200 transition-colors hover:bg-amber-600 hover:text-white hover:border-amber-600"
									>
										{cat.name}
									</Link>
								))}
							</div>
						</div>
					)}

					{products && products.length > 0 && (
						<div className="px-6 py-5">
							{(() => {
								const columns: { title: string; items: any[] }[] = [
									{ title: "Meilleurs résultats", items: products.slice(0, 4) },
									{ title: "Tendances", items: products.slice(4, 8) },
									{ title: "Vous pourriez aimer", items: products.slice(8, 12) },
								].filter((col) => col.items.length > 0);

								return (
									<div className="">
										{columns.map((col) => (
											<div key={col.title} className="space-y-3 w-full! ">
												<p className="text-[1.2rem]  font-bold tracking-wider text-gray-900">
													{col.title}
												</p>
												<ul className="grid grid-cols-2 w-full">
													{col.items.map((product: any, idx: number) => {
														const thumb =
															product.thumbnail || product.images?.[0]?.url || "";
														return (
															<li key={product.id}>
																<Link
																	href={PRODUCT_PATHS.productDetail(
																		product.handle,
																	)}
																	onClick={handleNavigate}
																	className="flex gap-3 items-center py-2 group"
																>
																	<div className="overflow-hidden relative w-24 h-40 bg-gray-100 rounded-lg shrink-0">
																		{thumb && (
																			<Image
																				src={thumb}
																				alt={product.title}
																				fill
																				sizes="96px"
																				className="object-cover"
																			/>
																		)}
																	</div>
																	<span className="text-[1.2rem] text-gray-800 line-clamp-2 flex-1 min-w-0 group-hover:text-black group-hover:underline">
																		{product.title}
																	</span>
																</Link>
															</li>
														);
													})}
												</ul>
											</div>
										))}
									</div>
								);
							})()}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
