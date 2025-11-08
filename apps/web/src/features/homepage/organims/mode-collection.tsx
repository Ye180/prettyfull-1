import { Button, CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ModeCollection = () => {
	const t = useTranslations("HomePage.collection");
	return (
		<Container
			maxWidth="100vw"
			className="flex items-start justify-between px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12 gap-x-12"
		>
			<div className="space-y-4 md:hidden max-md:!text-center max-md:w-full">
				<h2 className="!text-[3.5rem] md:!text-[4rem] font-semibold text-black">
					{t("title")}
				</h2>
				<p className="text-[1.5rem] font-light text-black/70">
					{t("subtitle")}
				</p>
				<Button variant="default" className="px-12 py-4 mt-4 size-fit">
					{" "}
					{t("ctaButton")}
				</Button>
			</div>
			<div
				className="relative flex items-end w-full md:w-1/2 h-[40rem] md:h-[78vh]  overflow-hidden  bg-cover  bg-center bg-no-repeat"
				style={{ backgroundImage: `url(/home/promotion.jpg)` }}
			>
				<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/40 to-black/0" />

				<div className="static z-20 flex items-center justify-between w-full p-8 pb-16">
					<h4 className="text-[16px] text-white">{t("deal")}</h4>
				</div>
			</div>
			<div className="w-full space-y-12 overflow-hidden md:w-1/2 h-fit ">
				<div className="space-y-0 max-md:hidden">
					<h2 className="!text-[4rem] font-semibold text-black tracking-wide">
						{t("title")}
					</h2>
					<p className="text-[1.8rem] font-normal text-black/70">
						{t("subtitle")}
					</p>
					<Button variant="default" className="px-12 py-4 mt-6 size-fit">
						{" "}
						{t("ctaButton")}
					</Button>
				</div>
				<GridCardProduct classGrid="grid grid-cols-2  ">
					<>
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={i} className="w-full aspect-10/9">
								<CardProduct
									notVariable={{
										color: {
											code: "#FF0000",
											label: "Rouge",
										},
										image: ["/home/image.png"],
										quantity: 1,
										size: ["S", "M", "L"],
									}}
									price={
										{
											amount: 12000,
											currency: "USD",
										} /* Example price object */
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
			</div>
		</Container>
	);
};

export default ModeCollection;
