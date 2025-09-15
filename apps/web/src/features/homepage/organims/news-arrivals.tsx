import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { BOX_DATA_FIRST } from "@/lib/utils/constants";
import { Button } from "@prettyfull/ui";
import Image from "next/image";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const NewsArrivals = () => {
	return (
		<Container maxWidth="100vw" className="w-full  lg:px-40">
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

			<div className="grid  max-md:grid-rows-2 gap-x-6  sm:grid-cols-2 md:grid-cols-3 md:gap-x-16 overflow-hidden items-end box">
				{BOX_DATA_FIRST.map((item, index) => (
					<Box
						key={index}
						className={`bg-black/60 relative  p-4 flex items-end shadow-md h-[40rem] lg:h-[50rem]  boxdiv   mt-4 aspect-auto bg-[url(/home/cover-box-3.jpg)]   bg-cover  bg-center bg-no-repeat transition-all duration-300 ease-in-out cursor-pointer `}
					>
						<Image
							src={item.picture}
							alt={item.label}
							layout="fill"
							objectFit="cover"
							className="absolute top-0 left-0 w-full h-full z-0"
						/>
						<div className="w-full h-1/2 absolute bottom-0 left-0   bg-linear-to-t from-black/70 to-black/0"></div>

						<div className="flex justify-between items-center pb-16 w-full  p-8 static z-20 hover:[&>button]:bg-black hover:[&>button>*]:text-white">
							<h4 className="text-[16px] text-white">{item.label}</h4>

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
	);
};

export default NewsArrivals;
