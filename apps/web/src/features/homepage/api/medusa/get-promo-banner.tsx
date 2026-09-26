"use client";

import { fetchBanners } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/** Bannière CMS placée en `home_promo` - visuel de la bannière CTA finale. */
export const useGetPromoBanner = () =>
	useQuery({
		queryKey: ["home-promo-banner"],
		queryFn: async () => {
			const banners = await fetchBanners("home_promo");
			return banners[0] ?? null;
		},
		staleTime: 5 * 60 * 1000,
	});
