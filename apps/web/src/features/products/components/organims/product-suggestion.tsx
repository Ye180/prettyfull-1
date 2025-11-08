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
								key={i}
   								productId={`suggestion-${i}`}
								notVariable={{
									color: {
										code: "#FF0000",
										label: "Rouge",
									},
									image: ["/assets/product_1.jpg"],
									quantity: 1,
									size: ["S", "M", "L"],
								}}
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
							/>
						</div>
					))}
				</>
			</GridCardProduct>
		);
	};
	return (
		<Container maxWidth="100vw" className="w-full px-4 space-y-8 lg:px-40">
			<div className="flex justify-between space-y-8 ">
				<h4 className="py-2 capitalize w-fit"> tu peux aussi aimer</h4>
			</div>

			<div className="flex justify-between w-full max-lg:flex-col ">
				{handleGridClick(4)}
			</div>
		</Container>
	);
};

export default ProductSuggestion;
