"use client";

import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { CardProduct, CardProps, GridCardProduct } from "@prettyfull/ui";
import { useGetProducts } from "../api/get-product";

const GridCollectionLayout = () => {
	// Fetch products using the custom hook
	const { data: products, isLoading } = useGetProducts({ page: 1, limit: 24 });

	console.log("Fetched products:", products);
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
