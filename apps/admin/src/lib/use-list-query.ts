"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * État partagé des écrans de liste : filtres + pagination.
 *
 * Les neuf modules affichent tous une liste filtrable et paginée ; centraliser
 * ici évite d'en réécrire la mécanique — et surtout la règle facile à oublier :
 * **modifier un filtre ramène à la page 1**, sans quoi on se retrouve sur une
 * page 7 vide après avoir restreint la recherche.
 */
export interface ListState<F> {
	filters: F;
	page: number;
	setPage: (page: number) => void;
	setFilter: <K extends keyof F>(key: K, value: F[K]) => void;
	reset: () => void;
	/** Filtres + page, prêts à être sérialisés en chaîne de requête. */
	params: F & { page: number; limit: number };
	/** `true` dès qu'un filtre s'écarte de sa valeur initiale. */
	isFiltered: boolean;
}

export const useListQuery = <F extends Record<string, unknown>>(
	initialFilters: F,
	limit = 20,
): ListState<F> => {
	const [filters, setFilters] = useState<F>(initialFilters);
	const [page, setPage] = useState(1);

	// Les valeurs initiales servent de référence à `reset` et à `isFiltered`.
	// Figées dans une ref : l'appelant passe un littéral, recréé à chaque
	// rendu, qui invaliderait sinon tous les callbacks en permanence.
	const defaults = useRef(initialFilters);

	const setFilter = useCallback(<K extends keyof F>(key: K, value: F[K]) => {
		setFilters((current) => ({ ...current, [key]: value }));
		setPage(1);
	}, []);

	const reset = useCallback(() => {
		setFilters(defaults.current);
		setPage(1);
	}, []);

	const isFiltered = useMemo(
		() =>
			Object.entries(filters).some(
				([key, value]) => value !== defaults.current[key as keyof F],
			),
		[filters],
	);

	const params = useMemo(() => ({ ...filters, page, limit }), [filters, page, limit]);

	return { filters, page, setPage, setFilter, reset, params, isFiltered };
};

/**
 * Retarde une valeur pour éviter une requête par frappe.
 *
 * Le minuteur est posé dans un effet — un `useMemo` ne nettoie rien, et
 * chaque frappe laisserait derrière elle un minuteur orphelin qui finirait
 * par écraser la valeur courante.
 */
export const useDebounced = <T>(value: T, delay = 350): T => {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);

	return debounced;
};
