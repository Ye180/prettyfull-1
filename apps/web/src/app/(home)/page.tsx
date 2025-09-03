"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { Button, CardProduct, GridCardProduct } from "@prettyfull/ui";
import Box from "../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../packages/ui/src/layouts/helpers/flex";

const page = () => {
	return (
		<>
			<div className="  w-full [&>*]:w-full space-y-12 ">
				<div className="bg-amber-700 h-[10vh] w-full"></div>
				<div className=" relative">
					<Container
						maxWidth="100vw"
						className="space-y-12 flex flex-col items-center  lg:px-40"
					>
						<div className=" w-full flex h-[40vh] sm:h-[80vh] relative flex-col justify-content-center py-2 gap-2 items-center ">
							<div className="w-[75rem] -space-y-24 max-md:hidden  ">
								<h1>Exprime ton style</h1>
								<Flex
									as="section"
									className=" w-full h-fit items-center gap-x-8"
								>
									<p className="text-justify content-center h-full leading-10 ">
										Plonge dans un univers où chaque tenue sublime ta
										personnalité. Explore notre large collection de vêtements
										pour tous les goûts.
									</p>
									<h1 className="whitespace-nowrap h-fit">SANS LIMITE</h1>
								</Flex>
							</div>
							<div className="h-[90vh] w-full  bg-gray-900"></div>
						</div>
					</Container>
					<div className="bg-black h-[8rem] overflow-hidden w-full  flex justify-center items-center absolute bottom gap-12">
						{Array.from({ length: 50 }).map((_, index) => (
							<h4 key={index} className="text-white mb-2 gap-2">
								Nike
							</h4>
						))}
					</div>
				</div>

				<Container maxWidth="100vw" className="w-full py-[10rem] lg:px-40">
					<div className="flex justify-between space-y-8 ">
						<h4 className="p-2 w-fit"> NOUVELLE ARRIVAGE</h4>

						<Button
							variant="outline"
							size="lg"
							className="w-fit py-4 px-8 h-fit flex justify-center items-center max-md:text-[1.5rem]"
						>
							Voir plus
							<ArrowRightIcon className="rotate-45" />
						</Button>
					</div>
					{/* //hhdhd */}
					<div className="grid  max-md:grid-rows-2 gap-x-6  sm:grid-cols-2 md:grid-cols-3 md:gap-x-16 overflow-x-auto items-end box">
						{Array.from({ length: 3 }).map((_, index) => (
							<Box
								key={index}
								className="bg-black/60 relative  p-4 flex items-end shadow-md h-[40rem] lg:h-[50rem]  boxdiv   mt-4 aspect-auto "
							>
								<div className="flex justify-between items-center pb-16 w-full p-8">
									<h4 className="text-[16px] text-white">For Woman</h4>

									<Button
										variant="default"
										className="text-black bg-white py-4 px-6 w-fit rounded-full hover:[&>*]:text-white [&>*]:text-black"
									>
										<ArrowRightIcon className="rotate-45  " />
									</Button>
								</div>
							</Box>
						))}
					</div>
				</Container>

				<Container maxWidth="100vw" className="h-[40vh] lg:h-[70vh] lg:px-40 ">
					<div className="h-full bg-black/60 overflow-hidden rounded-xl "></div>
				</Container>

				<Container maxWidth="100vw" className="w-full py-[5rem] lg:px-40">
					<h2 className="text-center">
						Nous nous engageons à vous offrir une expérience d'achat fluide et
						agréable.
					</h2>
				</Container>
				<Container maxWidth="100vw" className="w-full py-[5rem] lg:px-40">
					<div className="flex justify-between space-y-8 ">
						<h4 className="p-2 w-fit"> Le Rapport de tendance</h4>

						<Button
							variant="outline"
							size="lg"
							className="w-fit py-4 px-8 h-fit flex justify-center items-center"
						>
							Voir plus
							<ArrowRightIcon className="rotate-45" />
						</Button>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-x-20 overflow-x-auto aspect-auto">
						{Array.from({ length: 3 }).map((_, index) => (
							<Box
								key={index}
								className="bg-black/60 relative  p-4 flex justify-center items-center rounded-lg shadow-md h-[30rem] sm:h-[60rem]  mt-4"
							>
								<div className="flex  justify-between items-center">
									<div className=" text-white w-full text-center">
										<h3 className="text-[8rem]">SOIRÉE</h3>
									</div>
								</div>
								<Button
									variant="default"
									className=" text-black bg-white py-4 px-6 w-fit rounded-full absolute right-8 top-8 hover:[&>*]:text-white [&>*]:text-black"
								>
									<ArrowRightIcon className="rotate-45 " />
								</Button>
							</Box>
						))}
					</div>
				</Container>

				<Container
					maxWidth="100vw"
					className="w-full py-[5rem] lg:px-40 space-y-8"
				>
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
			</div>
		</>
	);
};

export default page;
