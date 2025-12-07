import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowIcon } from "../../../../../../packages/ui/src/icons/arrow-top.icon";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

const Hero = ({
	video,
	firstSection,
}: {
	video?: boolean;
	firstSection?: {
		title?: string;
		description?: string;
		button?: string;
		imageUrlDesktop?: string;
		imageUrlMobile?: string;
	};
}) => {
	const t = useTranslations("HomePage.hero");

	const params = useParams();

	const { data: category } = useGetCategoryByHandler(
		params.id as string,
		"first-section"
	);

	const router = useRouter();

	return (
		<div className="overflow-hidden relative z-0 w-full h-screen bg-gray-400">
			<Link
				href={COLLECTION_PATHS.collectionDetail("new-arrivals")}
				className=" flex justify-between items-center h-[10%]  lg:h-[7%]  bg-black w-full absolute z-30 inset-0 text-white gap-4 py-4"
			>
				<p className="font-manrope text-[1.6rem]!   sm:text-[2rem]!  md:text-[2.2rem]! lg:text-[3.5rem]! pl-8 line-clamp-2 font-semibold whitespace-nowrap max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-2">
					<span className="pr-2 sm:mr-4 sm:border-r-4">
						GET $20 OFF ON $99+ ORDERS{" "}
					</span>
					<span className="font-light!">USE CODE: FREE20</span>
				</p>
				<span className="flex gap-2 items-center pr-8 uppercase whitespace-nowrap font-manrope hover:underline underline-offset-4">
					<span>{t("ctaButton")}</span>
					<span className="pr-1 rotate-90">
						<ArrowIcon />
					</span>
				</span>
			</Link>
			<div
				className="h-full absolute top-[7%] left-0 w-full  z-20 cursor-pointer"
				onClick={() =>
					router.push(
						COLLECTION_PATHS.collectionDetail(category?.[0]?.handle as string)
					)
				}
			>
				{video ? (
					<video
						width="500"
						height="500"
						autoPlay
						muted
						loop
						playsInline
						className="flex object-cover absolute top-0 left-0 z-10 w-full h-full"
					>
						<source src="/video/video.mp4" type="video/mp4" />;
						{/* codecs="avc1.42E01E, git Your browser does not support the video tag. */}
					</video>
				) : (
					<>
						{firstSection?.imageUrlMobile && firstSection?.imageUrlDesktop && (
							<>
								<Image
									src={
										firstSection?.imageUrlMobile + "?view=1" ||
										"/home/cover-phone.jpg"
									}
									alt="Hero background image"
									fill
									sizes="100%"
									className="object-cover absolute top-0 left-0 z-10 w-full h-full max-md:flex md:hidden"
									priority
								/>
								<Image
									src={
										firstSection?.imageUrlDesktop + "?view=1" ||
										"/home/cover-desktop-1.jpg"
									}
									alt="Hero background image"
									fill
									sizes="100%"
									className="object-cover absolute top-0 left-0 z-10 w-full h-full max-md:hidden md:flex"
									priority
								/>
							</>
						)}

						<Image
							src={category?.[0]?.product_category_image?.[1]?.url as string}
							alt="Hero background image"
							fill
							sizes="100%"
							className="object-cover absolute top-0 left-0 z-10 w-full h-full max-sm:hidden sm:flex"
							priority
						/>

						<Image
							src={category?.[0]?.product_category_image?.[0]?.url as string}
							alt="Hero background image"
							fill
							sizes="100%"
							className="object-cover absolute top-0 left-0 z-10 w-full h-full max-sm:flex sm:hidden"
							priority
						/>
					</>
				)}

				{/*  */}

				{firstSection?.title &&
					firstSection?.description &&
					firstSection?.button && (
						<Container
							maxWidth="100vw"
							className="flex flex-col justify-center items-center space-y-12 h-full lg:px-40 bg-none/30"
						>
							<div className="flex justify-center items-end w-full h-full text-white rounded-xl z-15 lg:p-8 md:justify-start">
								<div className="pb-40 space-y-8 md:w-1/2 max-md:w-full max-lg:pb-20 lg: max-md:text-center">
									<h1 className="text-[3rem]!  md:text-[4.5rem]! lg:text-[5.5rem]! leading-26 tracking-tight font-normal text-center md:text-start   ">
										{firstSection?.title || t("title")}
									</h1>
									<p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-normal text-pretty  lg:text-justify">
										{firstSection?.description || t("subtitle")}
									</p>
									<Button
										variant="default"
										className="bg-none backdrop-blur-3xl size-fit"
									>
										{firstSection?.button || t("ctaButton")}
									</Button>
								</div>
							</div>
						</Container>
					)}
			</div>
		</div>
	);
};

export default Hero;
