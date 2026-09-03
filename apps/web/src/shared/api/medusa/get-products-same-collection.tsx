"use client";

import { collections, getProductsByCollectionId, toRawProduct } from "@/lib/fake-data";
import { useQuery } from "@tanstack/react-query";

const getProductsSameCollection = async () => {
	return collections.map((collection) => ({
		collection_id: collection.id,
		collection,
		categorie: [collection.metadata.categorie_id],
		products: getProductsByCollectionId(collection.id).map(toRawProduct),
	}));
};

export const useGetProductsSameCollection = () => {
	return useQuery({
		queryKey: ["products-same-collection"],
		queryFn: () => getProductsSameCollection(),
		staleTime: Infinity,
	});
};
