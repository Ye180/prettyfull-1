"use client";

import { useGetProducts } from "@/features/collections/api/backend/get-product";
import { GridCardProduct } from "@prettyfull/ui";

const GridWishlistLayout = () => {
	const { data: products, isLoading } = useGetProducts({ page: 1, limit: 24 });
	return (
		<div className="pb-44 w-full h-full rounded-md">
			<GridCardProduct>
				<>
					{Array.from({ length: 15 }).map((_, i) => {
						const product = {
							id: `product-${i}`,
							name: `Produit ${i + 1}`,
							price: { amount: 10000 + i * 500, currency: "FCFA" },
							variable: [],
							promotion: undefined,
							smallDescription: "Description rapide",
							link: `/produit/${i}`,
						};
						return (
							<div key={product.id} className="space-y-10 w-full aspect-10/9">
								{/* {products?.map((items: CardProps, i: number) => (
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
								))} */}
							</div>
						);
					})}
				</>
			</GridCardProduct>
		</div>
	);
};

export default GridWishlistLayout;
