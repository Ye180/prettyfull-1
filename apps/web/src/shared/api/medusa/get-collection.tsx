import { sdk } from "@/lib/api/sdk";
import { COLLECTIONS_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

const getCollection = async () => {
	const { collections, count, limit, offset } =
		await sdk.store.collection.list();

	return collections;
};

export const useGetCollection = () => {
	return useQuery({
		queryKey: [COLLECTIONS_MEDUSA_QUERY_KEY],
		queryFn: getCollection,
	});
};

export default getCollection;
