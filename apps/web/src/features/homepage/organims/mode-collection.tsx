import { Button, CardProduct, GridCardProduct } from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ModeCollection = () => {
	return (
		<Container
			maxWidth="100vw"
			className=" lg:px-40 max-md:flex-col flex justify-between items-start h-fit max-md:space-y-12   gap-x-12 "
		>
			<div className="space-y-4 md:hidden max-md:!text-center max-md:w-full">
				<h2 className="!text-[4rem] font-semibold text-black">
					Collection Femme.
				</h2>
				<p className="text-[1.5rem] font-light text-black/70">
					Restez à la pointe de la mode avec notre nouvelle sélection.
				</p>
				<Button variant="default" className="size-fit py-4 px-12">
					{" "}
					Allez-y
				</Button>
			</div>
			<div className="relative flex items-end w-full md:w-1/2 h-[40rem] md:h-[78vh] rounded-lg overflow-hidden bg-[url(/home/promotion.jpg)]   bg-cover  bg-center bg-no-repeat">
				<div className="w-full h-1/2 absolute bottom-0 left-0   bg-linear-to-t from-black/70 to-black/0"></div>

				<div className="flex justify-between items-center pb-16 w-full p-8 static z-20">
					<h4 className="text-[16px] text-white">Deal de la semaine</h4>
				</div>
			</div>
			<div className="w-full md:w-1/2 h-fit  overflow-hidden  space-y-12 ">
				<div className="space-y-0 max-md:hidden">
					<h2 className="!text-[4rem] font-semibold text-black tracking-wide">
						Collection Femme : l’élégance réinventée
					</h2>
					<p className="text-[1.8rem] font-normal text-black/70">
						Restez à la pointe de la mode avec notre nouvelle sélection des
						styles modernes, pensé pour vous..
					</p>
					<Button variant="default" className="size-fit py-4 mt-6 px-12">
						{" "}
						Allez-y
					</Button>
				</div>
				<GridCardProduct classGrid="grid grid-cols-2  ">
					<>
						{Array.from({ length: 2 }).map((_, i) => (
							<div key={i} className=" w-full aspect-10/9 ">
								<CardProduct
									notVariable={{
										color: {
											code: "#FF0000",
											label: "Rouge",
										},
										image: "/home/image.png",
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

export default ModeCollection;
