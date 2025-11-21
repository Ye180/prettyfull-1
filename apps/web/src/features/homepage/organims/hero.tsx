// import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
// import { Button } from "@prettyfull/ui";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import Link from "next/link";
// import { ArrowIcon } from "../../../../../../packages/ui/src/icons/arrow-top.icon";
// import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

// const Hero = () => {
// 	const t = useTranslations("HomePage.hero");

// 	return (
// 		<div className=" relative h-[80vh] -z-0 w-full overflow-hidden bg-gray-400  ">
// 			<Link
// 				href={COLLECTION_PATHS.collectionDetail("new-arrivals")}
// 				className=" flex justify-between items-center h-[10%]  lg:h-[7%]  bg-black w-full absolute z-30 inset-0 text-white gap-4 py-4"
// 			>
// 				<p className="font-manrope !text-[1.6rem]   sm:!text-[2rem]  md:!text-[2.2rem] lg:!text-[3.5rem] pl-8 line-clamp-2 font-semibold whitespace-nowrap max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-2">
// 					<span className="pr-2 sm:mr-4 sm:border-r-4">
// 						GET $20 OFF ON $99+ ORDERS{" "}
// 					</span>
// 					<span className="!font-light">USE CODE: FREE20</span>
// 				</p>
// 				<span className="flex items-center gap-2 pr-8 uppercase font-manrope whitespace-nowrap hover:underline underline-offset-4">
// 					<span>shop now </span>
// 					<span className="rotate-90">
// 						<ArrowIcon />
// 					</span>
// 				</span>
// 			</Link>
// 			<div className="h-[93%] absolute top-[7%] left-0 w-full  z-20">
// 				<Image
// 					src="/home/cover-desktop-1.jpg"
// 					alt="Hero background image"
// 					fill
// 					sizes="100%"
// 					className="absolute top-0 left-0 z-10 object-cover w-full h-full max-md:hidden md:flex"
// 					priority
// 				/>
// 				<Image
// 					src="/home/cover-phone.jpg"
// 					alt="Hero background image"
// 					fill
// 					sizes="100%"
// 					className="absolute top-0 left-0 z-10 object-cover w-full h-full max-md:flex md:hidden"
// 					priority
// 				/>
// 				<Container
// 					maxWidth="100vw"
// 					className="flex flex-col items-center justify-center h-full space-y-12 lg:px-40 bg-none/30 "
// 				>
// 					<div className="flex items-end justify-center w-full h-full text-white z-15 lg:p-8 rounded-xl md:justify-start">
// 						<div className="pb-40 space-y-8 md:w-1/2 max-md:w-full max-lg:pb-20 lg: max-md:text-center">
// 							<h1 className="!text-[3rem]  md:!text-[4.5rem] lg:!text-[5.5rem] leading-[6.5rem] tracking-tight font-normal text-center md:text-start   ">
// 								{t("title")}
// 							</h1>
// 							<p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-[1.5] text-pretty  lg:text-justify">
// 								{t("subtitle")}
// 							</p>
// 							<Button
// 								variant="secondary"
// 								className="size-fit bg-none backdrop-blur-3xl"
// 							>
// 								{t("ctaButton")}
// 							</Button>
// 						</div>
// 					</div>
// 				</Container>
// 			</div>
// 		</div>
// 	);
// };

// export default Hero;

import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "../../../../../../packages/ui/src/icons/arrow-top.icon";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Hero = () => {
	const t = useTranslations("HomePage.hero");

	return (
		<div className=" relative h-[80vh] -z-0 w-full overflow-hidden bg-gray-400  ">
			<Link
				href={COLLECTION_PATHS.collectionDetail("new-arrivals")}
				className=" flex justify-between items-center h-[10%]  lg:h-[7%]  bg-black w-full absolute z-30 inset-0 text-white gap-4 py-4"
			>
				<p className="font-manrope !text-[1.6rem]   sm:!text-[2rem]  md:!text-[2.2rem] lg:!text-[3.5rem] pl-8 line-clamp-2 font-semibold whitespace-nowrap max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-2">
					<span className="pr-2 sm:mr-4 sm:border-r-4">
						GET $20 OFF ON $99+ ORDERS{" "}
					</span>
					<span className="!font-light">USE CODE: FREE20</span>
				</p>
				<span className="flex items-center gap-2 pr-8 uppercase font-manrope whitespace-nowrap hover:underline underline-offset-4">
					<span>shop now </span>
					<span className="rotate-90">
						<ArrowIcon />
					</span>
				</span>
			</Link>
			<div className="h-[93%] absolute top-[7%] left-0 w-full  z-20">
				<Image
					src="/home/cover-desktop-1.jpg"
					alt="Hero background image"
					fill
					sizes="100%"
					className="absolute top-0 left-0 z-10 object-cover w-full h-full max-md:hidden md:flex"
					priority
				/>
				<Image
					src="/home/cover-phone.jpg"
					alt="Hero background image"
					fill
					sizes="100%"
					className="absolute top-0 left-0 z-10 object-cover w-full h-full max-md:flex md:hidden"
					priority
				/>
				<Container
					maxWidth="100vw"
					className="flex flex-col items-center justify-center h-full space-y-12 lg:px-40 bg-none/30 "
				>
					<div className="flex items-end justify-center w-full h-full text-white z-15 lg:p-8 rounded-xl md:justify-start">
						<div className="pb-40 space-y-8 md:w-1/2 max-md:w-full max-lg:pb-20 lg: max-md:text-center">
							<h1 className="!text-[3rem]  md:!text-[4.5rem] lg:!text-[5.5rem] leading-[6.5rem] tracking-tight font-normal text-center md:text-start   ">
								{t("title")}
							</h1>
							<p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-[1.5] text-pretty  lg:text-justify">
								{t("subtitle")}
							</p>
							<Button
								variant="secondary"
								className="size-fit bg-none backdrop-blur-3xl"
							>
								{t("ctaButton")}
							</Button>
						</div>
					</div>
				</Container>
			</div>
		</div>
	);
};

export default Hero;
