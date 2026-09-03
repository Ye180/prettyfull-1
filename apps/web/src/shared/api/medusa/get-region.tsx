"use client";

import { regions } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const REGIONS_QUERY_KEY = "list-regions";

export const useGetRegion = () => {
	return useQuery({
		queryKey: [REGIONS_QUERY_KEY],
		queryFn: () => Promise.resolve(regions),
		staleTime: Infinity,
	});
};
