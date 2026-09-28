import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
	FAQ_CATEGORY_KEYS,
	getFaqCategoryLabel,
	getFaqItems,
	type FaqCategoryKey,
	type FaqItem,
} from "../data";

const PAGE_SIZE = 6;

/**
 * Filtre/recherche/pagine la FAQ côté client. Petite liste statique
 * (data/index.tsx) - pas besoin de query params ni de debounce.
 */
export const useFaqFilters = () => {
	const t = useTranslations("FaqPage");
	const dataRule = useMemo(() => getFaqItems(t), [t]);

	const categories = useMemo(
		() =>
			FAQ_CATEGORY_KEYS.filter((category) =>
				dataRule.some((item) => item.category === category),
			),
		[dataRule],
	);

	const [selectedCategory, setSelectedCategoryState] =
		useState<FaqCategoryKey | null>(null);
	const [searchQuery, setSearchQueryState] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const items = useMemo<FaqItem[]>(() => {
		const query = searchQuery.trim().toLowerCase();
		return dataRule.filter((item) => {
			const matchesCategory =
				!selectedCategory || item.category === selectedCategory;
			const matchesQuery =
				!query ||
				item.title.toLowerCase().includes(query) ||
				item.description.toLowerCase().includes(query);
			return matchesCategory && matchesQuery;
		});
	}, [dataRule, selectedCategory, searchQuery]);

	const setSelectedCategory = (category: FaqCategoryKey | null) => {
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

	const categoryLabel = (category: FaqCategoryKey) =>
		getFaqCategoryLabel(t, category);

	return {
		items,
		categories,
		categoryLabel,
		selectedCategory,
		setSelectedCategory,
		searchQuery,
		setSearchQuery,
		visibleItems,
		hasMore,
		loadMore,
	};
};
