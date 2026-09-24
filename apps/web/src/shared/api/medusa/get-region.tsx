"use client";

import { fetchRegions } from "@/lib/store-api";
import { useQuery } from "@tanstack/react-query";

const REGIONS_QUERY_KEY = "list-regions";

/** Devises activées dans le back-office, présentées comme des régions. */
export const useGetRegion = () =>
	useQuery({
		queryKey: [REGIONS_QUERY_KEY],
		queryFn: fetchRegions,
		staleTime: 30 * 60 * 1000,
	});
