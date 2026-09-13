"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

/**
 * Champs sur lesquels le backend accepte de trier (`products.service.ts`).
 * Le contrôle de tri de la toolbar ne doit jamais proposer autre chose.
 */
export const SORT_FIELDS = ["name", "basePrice", "createdAt", "updatedAt", "publishedAt"] as const;
export type SortField = (typeof SORT_FIELDS)[number];

const ORDERS = ["asc", "desc"] as const;
type Order = (typeof ORDERS)[number];

const DEFAULT_SORT: SortField = "createdAt";
const DEFAULT_ORDER: Order = "desc";

const filterParsers = {
	q: parseAsString.withDefault(""),
	sort: parseAsStringEnum<SortField>([...SORT_FIELDS]).withDefault(DEFAULT_SORT),
	order: parseAsStringEnum<Order>([...ORDERS]).withDefault(DEFAULT_ORDER),
	page: parseAsInteger.withDefault(1),
	minPrice: parseAsInteger,
	maxPrice: parseAsInteger,
};

/**
 * État de recherche/tri/prix/pagination de la page rayon, porté par l'URL
 * (comme `useCheckoutStep`) : partageable/bookmarkable, pas de store séparé.
 */
export function useCollectionFilters() {
	const [state, setState] = useQueryStates(filterParsers);

	const setSearch = (q: string) => setState({ q: q || null, page: 1 });

	const setSort = (sort: SortField, order: Order) => setState({ sort, order, page: 1 });

	const setPage = (page: number) => setState({ page });

	const setPriceRange = (minPrice: number | null, maxPrice: number | null) =>
		setState({ minPrice, maxPrice, page: 1 });

	const clear = () =>
		setState({ q: null, sort: DEFAULT_SORT, order: DEFAULT_ORDER, minPrice: null, maxPrice: null, page: 1 });

	return { ...state, setSearch, setSort, setPage, setPriceRange, clear };
}
