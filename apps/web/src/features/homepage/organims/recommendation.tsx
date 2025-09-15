import {
	CardProduct,
	GridCardProduct,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

export const TABS = {
	for_you: "Pour toi",
	woman: "Femme",
	men: "Homme",
	accessory: "Accessoires",
};

const Recommendation = () => {
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
				<h4 className="p-2 w-fit"> RECOMMANDEZ POUR VOUS</h4>
			</div>
			<Tabs defaultValue={TABS.for_you} className="w-full space-y-16">
				<TabsList>
					<TabsTrigger value={TABS.for_you}>{TABS.for_you}</TabsTrigger>
					<TabsTrigger value={TABS.woman}>{TABS.woman}</TabsTrigger>
					<TabsTrigger value={TABS.men}>{TABS.men}</TabsTrigger>
					<TabsTrigger value={TABS.accessory}>{TABS.accessory}</TabsTrigger>
				</TabsList>
				<TabsContent value={TABS.for_you}>
					<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
						{handleGridClick(4)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.woman}>
					<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
						{handleGridClick(3)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.men}>
					<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
						{handleGridClick(2)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.accessory}>
					<div className="w-full flex justify-between  max-lg:flex-col p-4 ">
						{handleGridClick(4)}
					</div>
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default Recommendation;
