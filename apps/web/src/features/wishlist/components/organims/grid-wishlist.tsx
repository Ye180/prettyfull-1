import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";

const GridWishlistLayout = () => {
	return (
		<div className="w-full h-full rounded-md pb-44 ">
			<GridCardProduct>
				<>
					{Array.from({ length: 15 }).map((_, i) => (
						<div key={i} className="w-full aspect-10/9">
							<CardProduct
								productId="wishlist-product-1"
								variants={[
									{
										color: {
											label: "Rouge",
											code: "#FF0000",
										},
										size: ["S", "M", "L"],
										images: ["/assets/product5.webp", "/assets/product_2.webp"],
										quantity: 1,
									},
									{
										color: {
											label: "Vert",
											code: "#00FF00",
										},
										size: ["S", "M", "L"],
										images: ["/assets/product_2.webp", "image4.jpg"],
										quantity: 1,
									},
								]}
								price={
									{ amount: 12000, currency: "USD" } /* Example price object */
								}
								promotion={{
									pourcentage: 50,
									reduced_price: {
										amount: 6000,
										currency: "USD",
									},
								}}
								smallDescription="Top polyvalente á Manche"
								name="Sweet-Top"
								link={PRODUCT_PATHS.productDetail("SWEET-TOP")}
							/>
						</div>
					))}
				</>
			</GridCardProduct>
		</div>
	);
};

export default GridWishlistLayout;
