"use client";

import { fetchBanners } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";
import type { BannerPlacement } from "@prettyfull/contracts";

/**
 * Bannières publiées d'un emplacement donné (§2.6), déjà triées par
 * `position` côté back - pilotables depuis Admin > Contenu sans déploiement.
 */
export const useCollectionBanners = (placement: BannerPlacement) =>
	useQuery({
		queryKey: ["collection-banners", placement],
		queryFn: () => fetchBanners(placement),
		staleTime: 5 * 60 * 1000,
	});
