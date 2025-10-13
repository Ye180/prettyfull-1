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
						<div key={i} className="w-full aspect-10/9">
							<CardProduct
								notVariable={{
									color: {
										code: "#FF0000",
										label: "Rouge",
									},
									image: ["/assets/product_1.jpg"],
									quantity: 1,
									size: ["S", "M", "L"],
								}}
								price={12000}
								promotion={{
									pourcentage: 50,
									reduced_price: 6000,
								}}
								smallDescription="Top polyvalente á Manche"
								title="Sweet-Top"
							/>
						</div>
					))}
				</>
			</GridCardProduct>
		);
	};
	return (
		<Container maxWidth="100vw" className="w-full space-y-8 lg:px-40">
			<div className="flex justify-between space-y-8 ">
				<h4 className="p-2 capitalize w-fit"> tu peux aussi aimer</h4>
			</div>

			<div className="flex justify-between w-full p-4 max-lg:flex-col ">
				{handleGridClick(4)}
			</div>
		</Container>
	);
};

export default ProductSuggestion;
