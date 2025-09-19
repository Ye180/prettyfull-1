import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import Container from "../../../../../../../packages/ui/src/layouts/helpers/container";

export const TABS = {
	for_you: "Pour toi",
	woman: "Femme",
	men: "Homme",
	accessory: "Accessoires",
};

const ProductSuggestion = () => {
	const handleGridClick = (value: number) => {
		return (
			<GridCardProduct>
				<>
					{Array.from({ length: value }).map((_, i) => (
						<div key={i} className=" w-full aspect-10/9 ">
							<CardProduct
								notVariable={{
									color: {
										code: "#FF0000",
										label: "Rouge",
									},
									image: "/assets/product_1.jpg",
									quantity: 1,
									size: ["S", "M", "L"],
								}}
								price={12000}
								promotion={{
									pourcentage: 50,
									reduced_price: 6000,
								}}
								small_description="Top polyvalente á Manche"
								title="Sweet-Top"
							/>
						</div>
					))}
				</>
			</GridCardProduct>
		);
	};
	return (
		<Container maxWidth="100vw" className="w-full lg:px-40 space-y-8">
			<div className="flex justify-between space-y-8 ">
				<h4 className="p-2 w-fit capitalize"> tu peux aussi aimer</h4>
			</div>

			<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
				{handleGridClick(4)}
			</div>
		</Container>
	);
};

export default ProductSuggestion;
