import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { BOX_DATA_FIRST } from "@/lib/utils/constants/constants";
import ViewAll from "@/shared/components/molecules/core/view-all";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Box from "../../../../../../packages/ui/src/layouts/helpers/box";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const NewsArrivals = () => {
	const t = useTranslations("HomePage.news");
	return (
		<Container maxWidth="100vw" className="w-full px-4 lg:px-40">
			<div className="flex items-center justify-between h-fit ">
				<h4 className=" w-fit max-md:!text-[2.5rem] uppercase">{t("title")}</h4>

				<ViewAll>{t("viewAll")}</ViewAll>
			</div>
			<div className="w-full overflow-x-auto h-fit ">
				<div className="flex gap-x-4 md:gap-x-16 max-sm:snap-x md:w-full sm:grid sm:grid-cols-3 h-[50rem] md:overflow-hidden overflow-y-hidden  lg:overflow-visible  lg:gap-x-6  lg:grid-cols-3 lg:grid-rows-1  lg:h-[60rem]  lg:space-y-0  lg:space-x-0  lg:scrollbar-hide  lg:scroll-smooth  lg:snap-x  lg:snap-mandatory  lg:pb-16  lg:pt-8 scrolbar">
					{BOX_DATA_FIRST.map((item, index) => (
						<Box
							key={index}
							className={`flex-none  bg-blue-200 flex items-end justify-center text-4xl  shadow-md h-[50rem]  max-sm:w-[40rem] max-xs:w-[85%] sm:w-[100%]  mt-4 aspect-auto  bg-cover  bg-center bg-no-repeat transition-all duration-300 ease-in-out cursor-pointer snap-center bg-url(${item.picture})  relative `}
							// boxdiv
							onClick={() => console.log("Clicked on box", index)}
							style={{ backgroundImage: `url(${item.picture})` }}
						>
							<Image
								src={item.picture}
								alt={item.label}
								layout="fill"
								objectFit="cover"
								fill
								className="w-full h-full "
								priority
							/>
							<div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/70 to-black/0"></div>

							<div className="flex justify-between items-center pb-16 w-full  p-8 static z-20 hover:[&>button]:bg-black hover:[&>button>*]:text-white">
								<h4 className="text-[16px] text-white">{item.label}</h4>

								<Button
									variant="default"
									className="text-black bg-white py-4 px-4 w-fit rounded-full hover:[&>*]:text-white [&>*]:text-black"
									onClick={() => console.log("Clicked on box", index)}
								>
									<ArrowLinearIcon className="rotate-45 " />
								</Button>
							</div>
						</Box>
					))}
				</div>
			</div>
		</Container>
	);
};

export default NewsArrivals;
