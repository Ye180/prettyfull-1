import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import { Button } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ArrowIcon } from "../../../../../../packages/ui/src/icons/arrow-top.icon";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

interface HeroProps {
	video?: boolean;
	firstSection?: {
		title?: string;
		description?: string;
		button?: string;
		imageUrlDesktop?: string;
		imageUrlMobile?: string;
	};
}

const heroImageClassName =
	"object-cover absolute top-0 left-0 z-10 w-full h-full";

const PromoBanner = ({ ctaLabel }: { ctaLabel: string }) => (
	<Link
		href={COLLECTION_PATHS.collectionDetail("new-arrivals")}
		className="flex justify-between items-center h-[10%] lg:h-[7%] bg-black w-full absolute z-30 inset-0 text-white gap-4 py-4"
	>
		<p className="font-manrope text-[1.6rem]! sm:text-[2rem]! md:text-[2.2rem]! lg:text-[3.5rem]! pl-8 line-clamp-2 font-semibold whitespace-nowrap max-sm:flex max-sm:flex-col max-sm:items-start max-sm:gap-2">
			<span className="pr-2 sm:mr-4 sm:border-r-4">
				GET $20 OFF ON $99+ ORDERS{" "}
			</span>
			<span className="font-light!">USE CODE: FREE20</span>
		</p>
		<span className="flex gap-2 items-center pr-8 uppercase whitespace-nowrap font-manrope hover:underline underline-offset-4">
			<span>{ctaLabel}</span>
			<span className="pr-1 rotate-90">
				<ArrowIcon />
			</span>
		</span>
	</Link>
);

const HeroVideo = () => (
	<video
		width="500"
		height="500"
		autoPlay
		muted
		loop
		playsInline
		className={`flex ${heroImageClassName}`}
	>
		<source src="/video/video.mp4" type="video/mp4" />
	</video>
);

const HeroImages = ({
	isLoading,
	desktopUrl,
	mobileUrl,
}: {
	isLoading: boolean;
	desktopUrl?: string;
	mobileUrl?: string;
}) => {
	if (isLoading) {
		return <LoadingPrettyfull />;
	}

	return (
		<>
			{desktopUrl ? (
				<Image
					src={desktopUrl}
					alt="Hero background image"
					fill
					sizes="100vw"
					className={`${heroImageClassName} max-sm:hidden sm:flex`}
					priority
				/>
			) : null}
			{mobileUrl ? (
				<Image
					src={mobileUrl}
					alt="Hero background image"
					fill
					sizes="100vw"
					className={`${heroImageClassName} max-sm:flex sm:hidden`}
					priority
				/>
			) : null}
		</>
	);
};

const HeroOverlay = ({
	firstSection,
	t,
}: {
	firstSection: NonNullable<HeroProps["firstSection"]>;
	t: (key: string) => string;
}) => (
	<Container
		maxWidth="100vw"
		className="flex flex-col justify-center items-center space-y-12 h-full lg:px-40 bg-none/30"
	>
		<div className="flex justify-center items-end w-full h-full text-white rounded-xl z-15 lg:p-8 md:justify-start">
			<div className="pb-40 space-y-8 md:w-1/2 max-md:w-full max-lg:pb-20 max-md:text-center">
				<h1 className="text-[3rem]! md:text-[4.5rem]! lg:text-[5.5rem]! leading-26 tracking-tight font-normal text-center md:text-start">
					{firstSection.title || t("title")}
				</h1>
				<p className="mt-8 text-[1.5rem] max-md:hidden lg:text-[1.8rem] font-light leading-normal text-pretty lg:text-justify">
					{firstSection.description || t("subtitle")}
				</p>
				<Button
					variant="default"
					className="bg-none backdrop-blur-3xl size-fit"
				>
					{firstSection.button || t("ctaButton")}
				</Button>
			</div>
		</div>
	</Container>
);

const Hero = ({ video, firstSection }: HeroProps) => {
	const t = useTranslations("HomePage.hero");
	const params = useParams();
	const router = useRouter();

	const results = useGetCategoryByHandler(params.id as string, "first-section");
	const queryResult = results[0];
	const category = queryResult?.data;
	const isLoading = queryResult?.isLoading ?? true;

	const firstCategory = useMemo(() => category?.[0], [category]);

	const desktopUrl = firstCategory?.product_category_image?.[2]?.url
		? `${firstCategory.product_category_image[2].url}?view=1`
		: undefined;
	const mobileUrl = firstCategory?.product_category_image?.[3]?.url
		? `${firstCategory.product_category_image[3].url}?view=1`
		: undefined;

	const handleHeroClick = useCallback(() => {
		if (firstCategory?.handle) {
			router.push(COLLECTION_PATHS.collectionDetail(firstCategory.handle));
		}
	}, [firstCategory?.handle, router]);

	const showOverlay =
		firstSection?.title && firstSection?.description && firstSection?.button;

	return (
		<div className="overflow-hidden relative z-0 w-full h-screen">
			<PromoBanner ctaLabel={t("ctaButton")} />

			<div
				className="h-full absolute top-[7%] left-0 w-full z-20 cursor-pointer"
				onClick={handleHeroClick}
			>
				{video ? (
					<HeroVideo />
				) : (
					<HeroImages
						isLoading={isLoading}
						desktopUrl={desktopUrl}
						mobileUrl={mobileUrl}
					/>
				)}

				{showOverlay && <HeroOverlay firstSection={firstSection} t={t} />}
			</div>
		</div>
	);
};

export default Hero;
