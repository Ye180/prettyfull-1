"use client";

import {
	CATEGORIES_ALL_KEY,
	fetchAllProductCategories,
} from "./get-chidren-metadata";
import { useQuery } from "@tanstack/react-query";

/**
 * Catégories "primaires" pour la nav : les vrais rayons vendables
 * (Vitamines, Minéraux...), pas le conteneur racine ("Boutique") qui les
 * regroupe côté back-office.
 *
 * Si l'arbre n'a qu'une seule racine non vendable, on remonte directement
 * ses enfants d'un cran - chacun garde son propre `category_children`, pour
 * qu'un rayon qui aurait lui-même des sous-rayons plus tard affiche encore
 * un dropdown dans la nav (§ `NavDropdown`).
 */
export const useGetPrimaryCategories = () => {
	return useQuery({
		queryKey: [CATEGORIES_ALL_KEY],
		queryFn: fetchAllProductCategories,
		staleTime: 10 * 60 * 1000,
		select: (categories) => {
			const rootChildren =
				categories.length === 1 ? categories[0]?.category_children : undefined;

			if (rootChildren && rootChildren.length > 0) {
				return rootChildren;
			}

			return categories;
		},
	});
};
