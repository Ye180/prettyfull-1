"use client";

import { fetchHighlights } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

/** Blocs de mise en avant CMS pour une section donnée (ex. `home_trust`). */
export const useGetHighlights = (sectionKey: string) =>
	useQuery({
		queryKey: ["content-highlights", sectionKey],
		queryFn: () => fetchHighlights(sectionKey),
		staleTime: 5 * 60 * 1000,
	});
