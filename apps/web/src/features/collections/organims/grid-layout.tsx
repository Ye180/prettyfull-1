import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";

const GridCollectionLayout = () => {
	return (
		<div className="h-full px-2 rounded-md max-md:w-full md:w-6/6">
			<GridCardProduct action_grid>
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
										size: ["S", "M", "L", "XL", "2XL", "3XL"],
										image: [
											"/assets/product_2.jpg",
											"/assets/product5.webp",
											"/assets/product_2.jpg",
										],
										quantity: 1,
									},
									{
										color: {
											label: "Gris",
											code: "#373B39",
										},
										size: ["S", "M", "L"],
										image: ["/assets/product5.webp", "/assets/product_2.jpg"],
										quantity: 1,
									},
									{
										color: {
											label: "Violet",
											code: "#3C2E69",
										},
										size: ["S", "M", "L", "XL", "2XL", "3XL"],
										image: ["/assets/product5.webp", "/assets/product_2.jpg"],
										quantity: 1,
									},
									{
										color: {
											label: "Jade",
											code: "#29A383",
										},
										size: ["S", "M", "L"],
										image: [
											"/assets/product_2.jpg",
											"/assets/product5.webp",
											"/assets/product_2.jpg",
										],
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

export default GridCollectionLayout;
