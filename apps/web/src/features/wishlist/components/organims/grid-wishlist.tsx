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
								variable={[
									{
										color: {
											label: "Rouge",
											code: "#FF0000",
										},
										size: ["S", "M", "L"],
										image: ["/assets/product5.webp", "/assets/product_2.jpg"],
										quantity: 1,
									},
									{
										color: {
											label: "Vert",
											code: "#00FF00",
										},
										size: ["S", "M", "L"],
										image: ["/assets/product_2.jpg", "image4.jpg"],
										quantity: 1,
									},
								]}
								price={12000}
								promotion={{
									pourcentage: 50,
									reduced_price: 6000,
								}}
								smallDescription="Top polyvalente á Manche"
								title="Sweet-Top"
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
