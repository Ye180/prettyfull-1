"use client";

import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import ProductCardSkeleton from "@/shared/components/organims/product-loading";
import { CardProduct, CardProps, GridCardProduct } from "@prettyfull/ui";

const GridCollectionLayout = ({
	products,
	loading,
}: {
	products: CardProps[];
	loading: boolean;
}) => {
	// Fetch products using the custom hook

	console.log("Fetched products:", products);
	if (!products || loading) {
		return (
			<div className="grid w-full grid-cols-4 gap-4 px-2 rounded-md max-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scrolbar ">
				{Array.from({ length: 16 }).map((_, index) => (
					<ProductCardSkeleton key={index} />
				))}
			</div>
		);
	}
	return (
		<div className="px-2 rounded-md max-md:w-full md:w-6/6 scrolbar ">
			<GridCardProduct action_grid className=" max-sm:gap-y-8">
				<>
					{products?.map((items: CardProps, i: number) => (
						<div key={i} className="w-full aspect-10/9">
							<CardProduct
								variable={items.variable}
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
		</div>
	);
};

export default GridCollectionLayout;
