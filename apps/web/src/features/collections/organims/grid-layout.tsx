import { PRODUCT_PATHS } from "@/lib/routes/paths-en";
import { CardProduct, GridCardProduct } from "@prettyfull/ui";

const GridCollectionLayout = () => {
	return (
		<div className="px-2  rounded-md max-md:w-full md:w-6/6 scrolbar ">
			<GridCardProduct action_grid className=" max-sm:gap-y-8">
				<>
					{Array.from({ length: 24 }).map((_, i) => (
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
											"/assets/product_2.webp",
											"/assets/product5.webp",
											"/assets/product_2.webp",
										],
										quantity: 1,
									},
									{
										color: {
											label: "Gris",
											code: "#373B39",
										},
										size: ["S", "M", "L"],
										image: ["/assets/product5.webp", "/assets/product_2.webp"],
										quantity: 1,
									},
									{
										color: {
											label: "Violet",
											code: "#3C2E69",
										},
										size: ["S", "M", "L", "XL", "2XL", "3XL"],
										image: ["/assets/product5.webp", "/assets/product_2.webp"],
										quantity: 1,
									},
									{
										color: {
											label: "Jade",
											code: "#29A383",
										},
										size: ["S", "M", "L"],
										image: [
											"/assets/product_2.webp",
											"/assets/product5.webp",
											"/assets/product_2.webp",
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
