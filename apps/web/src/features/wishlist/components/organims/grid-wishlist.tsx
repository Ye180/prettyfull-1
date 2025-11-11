import { CardProduct, GridCardProduct } from "@prettyfull/ui";

const GridWishlistLayout = () => {
	return (
		<div className="w-full h-full rounded-md pb-44 ">
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
							<div key={product.id} className="w-full aspect-10/9">
								<CardProduct
									productId={product.id}
									variable={product.variable}
									price={product.price}
									promotion={product.promotion}
									smallDescription={product.smallDescription}
									name={product.name}
									link={product.link}
								/>
							</div>
						);
					})}
				</>
			</GridCardProduct>
		</div>
	);
};

export default GridWishlistLayout;
