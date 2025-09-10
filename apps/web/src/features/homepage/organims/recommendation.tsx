import { CardProduct, GridCardProduct } from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Recommendation = () => {
	return (
		<Container maxWidth="100vw" className="w-full lg:px-40 space-y-8">
			<div className="flex justify-between space-y-8 ">
				<h4 className="p-2 w-fit"> RECOMMANDEZ POUR VOUS</h4>
			</div>

			<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
				<GridCardProduct>
					<>
						{Array.from({ length: 15 }).map((_, i) => (
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
			</div>
		</Container>
	);
};

export default Recommendation;
