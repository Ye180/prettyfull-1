import { sdk } from "@/lib/api/sdk";
import { REGIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

const getRegion = async () => {
	const { regions } = await sdk.store.region.list();
	return regions;
};

export const useGetRegion = () => {
	return useQuery({
		queryKey: [REGIONS_MEDUSA_QUERY_KEY],
		queryFn: getRegion,
		staleTime: 60 * 60 * 1000,
	});
};
