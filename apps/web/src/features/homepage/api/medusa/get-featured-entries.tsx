"use client";

import { fetchFeaturedEntries } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/**
 * Mises en avant (produits/catégories) configurées depuis l'admin pour une
 * section nommée de la page d'accueil (module Contenu > Mises en avant).
 * Chaque composant de section choisit sa propre clé (ex. `home_bundle_save`)
 * et retombe sur son contenu par défaut tant que rien n'est curé.
 */
export const useGetFeaturedEntries = (sectionKey: string) =>
	useQuery({
		queryKey: ["featured-entries", sectionKey],
		queryFn: () => fetchFeaturedEntries(sectionKey),
		staleTime: 5 * 60 * 1000,
	});
