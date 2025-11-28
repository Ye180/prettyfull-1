"use client";

import Title from "@/shared/components/molecules/core/title";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsMedusa } from "../api/medusa/get-products-medusa";

const ShopGrid = () => {
	const t = useTranslations("HomePage.news");

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();
	return (
		<Container maxWidth="100vw" className="w-full px-4 space-y-8 lg:px-40">
			<Title title="$4 & UNDER BLOWOUT!" buttonLabel={t("viewAll")} />
			<GridCardProduct>
				<>
					{productMedusa?.map((product) => (
						<CardProduct key={product.id} product={product as any} />
					))}
				</>
			</GridCardProduct>
		</Container>
	);
};

export default ShopGrid;
