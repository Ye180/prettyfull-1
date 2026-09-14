import { useMemo, useState } from "react";
import { DataRule, type FaqItem } from "../data";

const PAGE_SIZE = 6;

/**
 * Filtre/recherche/pagine la FAQ côté client. Petite liste statique
 * (data/index.tsx) — pas besoin de query params ni de debounce.
 */
export const useFaqFilters = () => {
	const categories = useMemo(
		() => Array.from(new Set(DataRule.map((item) => item.category))),
		[],
	);

	const [selectedCategory, setSelectedCategoryState] = useState<
		string | null
	>(null);
	const [searchQuery, setSearchQueryState] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const items = useMemo<FaqItem[]>(() => {
		const query = searchQuery.trim().toLowerCase();
		return DataRule.filter((item) => {
			const matchesCategory =
				!selectedCategory || item.category === selectedCategory;
			const matchesQuery =
				!query ||
				item.title.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query);
			return matchesCategory && matchesQuery;
		});
	}, [selectedCategory, searchQuery]);

	const setSelectedCategory = (category: string | null) => {
		setSelectedCategoryState(category);
		setVisibleCount(PAGE_SIZE);
	};

	const setSearchQuery = (query: string) => {
		setSearchQueryState(query);
		setVisibleCount(PAGE_SIZE);
	};

	const visibleItems = items.slice(0, visibleCount);
	const hasMore = visibleCount < items.length;
	const loadMore = () => setVisibleCount((count) => count + PAGE_SIZE);

	return {
		items,
		categories,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		visibleItems,
		hasMore,
		loadMore,
	};
};
