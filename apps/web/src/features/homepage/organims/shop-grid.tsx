"use client";

import { useGetProducts } from "@/features/collections/api/get-product";
import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import Title from "@/shared/components/molecules/core/title";
import { CardProduct, CardProps, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ShopGrid = () => {
	const t = useTranslations("HomePage.news");

	const { data: products, isLoading } = useGetProducts({ page: 1, limit: 24 });
	return (
		<Container maxWidth="100vw" className="w-full px-4 space-y-8 lg:px-40">
			<Title title="$4 & UNDER BLOWOUT!" buttonLabel={t("viewAll")} />
			<GridCardProduct>
				<>
					{products?.map((items: CardProps, i: number) => (
						<div key={i} className="w-full aspect-10/9">
							<CardProduct
								productId={items.id || items.productId}
								variants={items.variants}
								price={items.price}
								notVariable={items.notVariable}
								promotion={items?.promotion}
								smallDescription={items.label}
								name={items.name}
								link={PRODUCT_PATHS.productDetail(items.slug as string)}
							/>
						</div>
					))}
				</>
			</GridCardProduct>
		</Container>
	);
};

export default ShopGrid;
