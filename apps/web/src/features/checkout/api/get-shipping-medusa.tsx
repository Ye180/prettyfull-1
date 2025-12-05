// import { sdk } from "@/lib/api/sdk";
import { sdkStore } from "@/lib/api/sdk";
import { SHIPING_MEDUSA_QUERY_KEY } from "@/shared/utils/query-keys";
import { useQuery } from "@tanstack/react-query";

const getShippingMedusa = async () => {
	const shipping_options = sdkStore.admin.shippingOption
		.list()
		.then(({ shipping_options, count, limit, offset }) => {
			return shipping_options;
		});

	return shipping_options;
};

export const useGetShippingMedusa = () => {
	return useQuery({
		queryKey: [SHIPING_MEDUSA_QUERY_KEY],
		queryFn: () => getShippingMedusa(),
	});
};
