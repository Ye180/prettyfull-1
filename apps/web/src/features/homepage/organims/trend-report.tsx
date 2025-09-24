import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { BOX_DATA_SECOND } from "@/lib/utils/constants/constants";
import { Button } from "@prettyfull/ui";
import Image from "next/image";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const TrendReport = () => {
	return (
		<Container maxWidth="100vw" className="w-full lg:px-40">
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

			<div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-20 overflow-x-auto ">
				{BOX_DATA_SECOND.map((item, index) => (
					<Box
						key={index}
						className={` relative  p-4 flex justify-center items-center  shadow-md   max-md:h-[35rem] h-[60rem]  mt-4 hover:[&>button]:bg-black hover:[&>button>*]:text-white  transition-all duration-300 ease-in-out cursor-pointer `}
						style={{
							backgroundImage: `url(${item.picture})`,
							backgroundSize: "cover",
							backgroundPosition: "center",
							backgroundRepeat: "no-repeat",
						}}
					>
						<Image
							src={item.picture}
							alt={item.label}
							layout="fill"
							objectFit="cover"
							className="absolute top-0 left-0 w-full h-full z-0"
						/>
						<div className="w-full h-full absolute bottom-0 left-0  bg-black/30"></div>
						<div className="flex  justify-between items-center">
							<div className="static z-20 text-white w-full text-center">
								<h3 className="text-[8rem]">{item.label}</h3>
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
	);
};

export default TrendReport;
