"use client";

import { useGetCategory } from "@/features/homepage/api/medusa/get-category";
import { useGetPrimaryCategories } from "@/features/homepage/api/medusa/get-primary-categories";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { fetchProducts } from "@/lib/store-api";
import type { StoreProduct } from "@/lib/store-api/types";
import { COLLECTION_PATHS, PRODUCT_PATHS, paths } from "@/lib/routes/paths-en";
import { cn, getMediaUrl } from "@prettyfull/utils";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Search } from "../../../../../../../packages/ui/src/icons/search.icon";

type SearchBarProps = {
	className?: string;
	onNavigate?: () => void;
	/** "default" : champ encadré (menu mobile). "minimal" : icône + texte sans cadre, façon barre de header desktop. */
	variant?: "default" | "minimal";
};

const MIN_QUERY_LENGTH = 2;
const POPULAR_SEARCHES = ["iPhone 16 Pro", "Sérum", "Crème corps", "Parfum", "Lululemon", "Coach", "Raw hair", "TheraBreath"];

const useDebouncedValue = <T,>(value: T, delay = 250): T => {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const id = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(id);
	}, [value, delay]);
	return debounced;
};

/** Minuscules sans accents, caractère par caractère : les index restent alignés sur le texte d'origine. */
const fold = (text: string) =>
	Array.from(text, (char) => char.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().charAt(0) || char).join("");

/** Met en gras la portion du texte qui correspond à la recherche (insensible aux accents). */
const highlight = (text: string, query: string): ReactNode => {
	const index = fold(text).indexOf(fold(query));
	if (!query || index < 0) return text;
	return (
		<>
			{text.slice(0, index)}
			<mark className="font-semibold bg-transparent text-(--color-ink)">{text.slice(index, index + query.length)}</mark>
			{text.slice(index + query.length)}
		</>
	);
};

const SectionTitle = ({ children }: { children: ReactNode }) => (
	<p className="mb-3 text-[1.15rem] font-semibold tracking-[0.12em] uppercase text-(--color-surface-muted)">{children}</p>
);

const SearchBar = ({ className, onNavigate, variant = "default" }: SearchBarProps) => {
	const isMinimal = variant === "minimal";
	const t = useTranslations("HomePage.header");
	const router = useRouter();
	const { format } = useDisplayCurrency();

	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const debouncedQuery = useDebouncedValue(query.trim(), 250);
	const hasQuery = debouncedQuery.length >= MIN_QUERY_LENGTH;

	const { data: leafCategories } = useGetCategory();
	const { data: primaryCategories } = useGetPrimaryCategories();

	const departments = useMemo(() => {
		const all = [
			...(primaryCategories ?? []).map((cat) => ({ id: cat.id, name: cat.name, handle: cat.handle })),
			...(leafCategories ?? []).map((cat) => ({ id: cat.id, name: cat.name, handle: cat.handle })),
		].filter((cat, index, list) => list.findIndex((other) => other.id === cat.id) === index);
		if (!hasQuery) return all.filter((cat) => (primaryCategories ?? []).some((p) => p.id === cat.id));
		const q = fold(debouncedQuery);
		return all.filter((cat) => fold(cat.name).includes(q)).slice(0, 6);
	}, [primaryCategories, leafCategories, debouncedQuery, hasQuery]);

	const { data, isFetching } = useQuery({
		queryKey: ["search-products", debouncedQuery],
		// Recherche côté serveur : plein texte insensible aux accents, adossée à l'index du catalogue.
		queryFn: () => fetchProducts({ q: debouncedQuery, limit: 8 }),
		enabled: hasQuery,
		staleTime: 30_000,
	});
	const products = data?.products ?? [];
	const total = data?.meta.total ?? products.length;

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
		};
		const handleKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
		document.addEventListener("mousedown", handleClick);
		document.addEventListener("keydown", handleKey);
		return () => {
			document.removeEventListener("mousedown", handleClick);
			document.removeEventListener("keydown", handleKey);
		};
	}, []);

	const handleNavigate = () => {
		setIsOpen(false);
		setQuery("");
		onNavigate?.();
	};

	const searchHref = (q: string) => `${paths.search}?q=${encodeURIComponent(q)}`;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!query.trim()) return;
		router.push(searchHref(query.trim()));
		handleNavigate();
	};

	const chipClass =
		"inline-flex items-center gap-1.5 px-3.5 py-2 text-[1.3rem] rounded-full border border-(--color-surface-border) text-(--color-ink) transition-colors hover:border-(--color-ink) hover:bg-(--color-ink) hover:text-white";

	const renderProduct = (product: StoreProduct) => {
		const thumb = getMediaUrl(product.thumbnail || product.images?.[0]?.url);
		const price = product.variants[0]?.calculated_price;
		const inStock = product.variants.some((v) => !v.manage_inventory || v.allow_backorder || v.inventory_quantity > 0);
		return (
			<li key={product.id}>
				<Link
					href={PRODUCT_PATHS.productDetail(product.handle)}
					onClick={handleNavigate}
					className="flex gap-4 items-center p-2 -m-2 rounded-lg transition-colors group hover:bg-(--color-surface-card)"
				>
					<div className="overflow-hidden relative rounded-md shrink-0 size-[7.2rem] bg-(--color-surface-card)">
						{thumb && <Image src={thumb} alt={product.title} fill sizes="72px" className="object-cover" unoptimized />}
					</div>
					<div className="flex-1 min-w-0">
						{product.collection?.title && (
							<p className="text-[1.1rem] tracking-[0.08em] uppercase truncate text-(--color-surface-muted)">
								{product.collection.title}
							</p>
						)}
						<p className="mt-0.5 text-[1.4rem] leading-snug line-clamp-2 text-(--color-ink)/80 group-hover:text-(--color-ink)">
							{highlight(product.title, debouncedQuery)}
						</p>
						<div className="flex gap-2 items-center mt-1">
							{price && (
								<span className="text-[1.35rem] font-semibold text-(--color-ink)">{format(price.calculated_amount)}</span>
							)}
							{price?.original_amount && price.original_amount > price.calculated_amount && (
								<span className="text-[1.2rem] line-through text-(--color-surface-muted)">{format(price.original_amount)}</span>
							)}
							<span className={cn("ml-auto text-[1.1rem]", inStock ? "text-emerald-700" : "text-(--color-surface-muted)")}>
								{inStock ? t("inStock") : t("outOfStock")}
							</span>
						</div>
					</div>
				</Link>
			</li>
		);
	};

	const popular = (
		<div>
			<SectionTitle>{t("popularSearches")}</SectionTitle>
			<div className="flex flex-wrap gap-2">
				{POPULAR_SEARCHES.map((term) => (
					<Link key={term} href={searchHref(term)} onClick={handleNavigate} className={chipClass}>
						<Search className="w-3 h-3 opacity-60" />
						{term}
					</Link>
				))}
			</div>
		</div>
	);

	const departmentList = departments.length > 0 && (
		<div>
			<SectionTitle>{t("departments")}</SectionTitle>
			<ul className="space-y-1">
				{departments.map((cat) => (
					<li key={cat.id}>
						<Link
							href={COLLECTION_PATHS.collectionDetail(cat.handle)}
							onClick={handleNavigate}
							className="flex justify-between items-center py-1.5 text-[1.4rem] transition-colors text-(--color-ink)/80 hover:text-(--color-ink) group"
						>
							<span>{hasQuery ? highlight(cat.name, debouncedQuery) : cat.name}</span>
							<span className="opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true">→</span>
						</Link>
					</li>
				))}
			</ul>
		</div>
	);

	return (
		<div ref={containerRef} className={cn("relative", className)}>
			<form
				onSubmit={handleSubmit}
				className={cn(
					"flex items-center",
					isMinimal ? "gap-2 py-2" : "pl-4 bg-white rounded-lg border border-gray-300 focus-within:border-stone-900",
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
						aria-label={t("searchAriaLabel")}
						className="flex justify-center items-center w-11 h-11 text-white bg-stone-900 rounded-r-lg transition-colors cursor-pointer shrink-0 hover:bg-black"
					>
						<Search className="w-4 h-4" />
					</button>
				)}
			</form>

			{isOpen && (
				<div
					className={cn(
						"overflow-y-auto absolute top-full z-50 mt-3 bg-white rounded-xl border shadow-2xl border-(--color-surface-border) max-h-[80vh]",
						isMinimal ? "left-0 w-[min(76rem,92vw)]" : "right-0 w-full",
					)}
				>
					{!hasQuery ? (
						<div className="grid gap-8 p-6 md:grid-cols-[1fr_22rem]">
							{popular}
							{departmentList}
						</div>
					) : products.length === 0 && departments.length === 0 ? (
						<div className="p-6 space-y-6">
							<p className="text-[1.4rem] text-(--color-surface-muted)">
								{isFetching ? t("searching") : t("noResultsFor", { query: debouncedQuery })}
							</p>
							{!isFetching && popular}
						</div>
					) : (
						<>
							<div className="grid gap-8 p-6 md:grid-cols-[20rem_1fr]">
								<div className="space-y-6 md:pr-6 md:border-r border-(--color-surface-border)">
									{products.length > 0 && (
										<div>
											<SectionTitle>{t("suggestions")}</SectionTitle>
											<ul className="space-y-1">
												{products.slice(0, 5).map((product) => (
													<li key={product.id}>
														<Link
															href={searchHref(product.title)}
															onClick={handleNavigate}
															className="flex gap-2 items-center py-1.5 text-[1.35rem] transition-colors text-(--color-ink)/70 hover:text-(--color-ink)"
														>
															<Search className="w-3 h-3 opacity-50 shrink-0" />
															<span className="truncate">{highlight(product.title, debouncedQuery)}</span>
														</Link>
													</li>
												))}
											</ul>
										</div>
									)}
									{departmentList}
								</div>

								<div>
									<SectionTitle>{t("products")}</SectionTitle>
									{products.length > 0 ? (
										<ul className="grid gap-x-6 gap-y-5 sm:grid-cols-2">{products.slice(0, 6).map(renderProduct)}</ul>
									) : (
										<p className="text-[1.35rem] text-(--color-surface-muted)">
											{isFetching ? t("searching") : t("noResultsFor", { query: debouncedQuery })}
										</p>
									)}
								</div>
							</div>

							{total > 0 && (
								<Link
									href={searchHref(debouncedQuery)}
									onClick={handleNavigate}
									className="flex gap-2 justify-center items-center py-4 text-[1.3rem] font-semibold tracking-[0.08em] text-white uppercase rounded-b-xl transition-colors bg-(--color-ink) hover:bg-black"
								>
									{t("seeAllResults", { count: total, query: debouncedQuery })}
									<span aria-hidden="true">→</span>
								</Link>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchBar;
