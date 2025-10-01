import {
	CardProduct,
	GridCardProduct,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Recommendation = () => {
	const t = useTranslations("HomePage.recommendation");

	const TABS = {
		for_you: t("forYou"),
		woman: t("woman"),
		men: t("men"),
		accessory: t("accessory"),
	};
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
		<Container maxWidth="100vw" className="w-full px-4 space-y-8  lg:px-40">
			<div className="flex justify-between space-y-8 ">
				<h4 className=" w-fit max-md:!text-[2.5rem] uppercase">
					{" "}
					{t("title")}
				</h4>
			</div>
			<Tabs defaultValue={TABS.for_you} className="w-full space-y-16 ">
				<TabsList className="flex justify-start w-full overflow-x-auto rounded-none h-fit scrolbarRecomandation">
					<div className="flex justify-start gap-6 whitespace-nowrap max-sm:snap-x snap-mandatory lg:gap-6 ">
						{[TABS.for_you, TABS.woman, TABS.men, TABS.accessory].map((tab) => (
							<TabsTrigger
								key={tab}
								value={tab}
								className=" !h-12 snap-center 
								border-gray-100
								w-fit rounded-lg bg-transparent 
								data-[state=active]:rounded-lg
								data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:font-semibold"
							>
								{tab}
							</TabsTrigger>
						))}
					</div>
				</TabsList>
				<TabsContent value={TABS.for_you}>
					<div className="flex justify-between w-full max-lg:flex-col ">
						{handleGridClick(4)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.woman}>
					<div className="flex justify-between w-full max-lg:flex-col ">
						{handleGridClick(3)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.men}>
					<div className="flex justify-between w-full max-lg:flex-col ">
						{handleGridClick(2)}
					</div>
				</TabsContent>
				<TabsContent value={TABS.accessory}>
					<div className="flex justify-between w-full max-lg:flex-col ">
						{handleGridClick(4)}
					</div>
				</TabsContent>
			</Tabs>
		</Container>
	);
};

export default Recommendation;
