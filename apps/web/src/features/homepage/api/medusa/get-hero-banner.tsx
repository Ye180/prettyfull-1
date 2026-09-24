"use client";

import { fetchBanners } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/** Bannière CMS placée en `home_hero` - image (+ copie optionnelle) de la hero. */
export const useGetHeroBanner = () =>
	useQuery({
		queryKey: ["home-hero-banner"],
		queryFn: async () => {
			const banners = await fetchBanners("home_hero");
			return banners[0] ?? null;
		},
		staleTime: 5 * 60 * 1000,
	});
