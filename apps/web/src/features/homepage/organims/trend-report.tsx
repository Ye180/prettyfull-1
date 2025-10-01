import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { BOX_DATA_SECOND } from "@/lib/utils/constants/constants";
import ViewAll from "@/shared/components/molecules/core/view-all";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const TrendReport = () => {
	const t = useTranslations("HomePage.trendReport");
	return (
		<Container maxWidth="100vw" className="w-full px-4 lg:px-40">
			<div className="flex justify-between space-y-8 ">
				<h4 className="w-fit max-md:!text-[2.5rem]"> The {t("title")}</h4>

				<ViewAll>{t("viewAll")}</ViewAll>
			</div>

			<div className="grid grid-cols-2 overflow-x-auto md:grid-cols-4 gap-x-4 md:gap-x-20 ">
				{BOX_DATA_SECOND.map((item, index) => (
					<Box
						key={index}
						className={` relative  px-4 flex justify-center items-center  shadow-md   max-md:h-[35rem] h-[60rem]  mt-4 hover:[&>button]:bg-black hover:[&>button>*]:text-white  transition-all duration-300 ease-in-out cursor-pointer `}
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
							className="absolute top-0 left-0 z-0 w-full h-full"
							priority
						/>
						<div className="absolute bottom-0 left-0 w-full h-full bg-black/30"></div>
						<div className="flex items-center justify-between">
							<div className="static z-20 w-full text-center text-white">
								<h3 className="text-[8rem] uppercase">{item.label}</h3>
							</div>
						</div>
						<Button
							variant="default"
							className=" text-black bg-white py-4 px-4 w-fit rounded-full absolute right-8 top-8 hover:[&>*]:text-white [&>*]:text-black max-sm:py-2 max-sm:px-2"
						>
							<ArrowLinearIcon className="rotate-45 " />
						</Button>
					</Box>
				))}
			</div>
		</Container>
	);
};

export default TrendReport;
