"use client";

import { useGetProductsSameCollection } from "@/shared/api/medusa/get-products-same-collection";
import Title from "@/shared/components/molecules/core/title";
import { useRegionStore } from "@/stores/useRegion";
import {
	CardProduct,
	GridCardProduct,
	normalizeCollectionProducts,
	RawCollectionProduct,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ShopGrid = () => {
	const t = useTranslations("HomePage.news");

	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const {
		data: productSameCollection,
		isLoading: loadingProductsSameCollection,
	} = useGetProductsSameCollection();

	// Normalisation mémoïsée : évite de re-mapper toute la liste à chaque rendu.
	const normalizedProducts = useMemo(
		() =>
			productSameCollection?.map((group) =>
				normalizeCollectionProducts(group as RawCollectionProduct),
			) ?? [],
		[productSameCollection],
	);

	return (
		<Container maxWidth="100vw" className="px-4 space-y-8 w-full lg:px-40">
			<Title title="$4 & UNDER BLOWOUT!" buttonLabel={t("viewAll")} />
			<GridCardProduct>
				<>
					{normalizedProducts.map((normalized, index) => (
						<CardProduct
							key={normalized.collectionId ?? index}
							product={normalized}
							currencyCode={currencyCode}
						/>
					))}
				</>
			</GridCardProduct>
		</Container>
	);
};

export default ShopGrid;
