"use client";

import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { AddToCardIcon } from "../../../../../../packages/ui/src/icons/add-cart.icon";
import { useGetHeroBanner } from "../api/medusa/get-hero-banner";

const FALLBACK_IMAGE = "/home/commerce1.jpg";

/**
 * Hero contenu (pas plein écran) : image encadrée à coins arrondis, rangée
 * de labels en overlay haut, titre/CTA en overlay bas-gauche.
 */
const Hero = () => {
	const t = useTranslations("HomePage.hero");
	const { data: banner } = useGetHeroBanner();

	const imageUrl = getMediaUrl(banner?.image) ?? FALLBACK_IMAGE;

	return (
		<div className="overflow-hidden relative w-full h-[500px] bg-gray-100 rounded-2xl lg:h-[620px]">
			<Image
				src={imageUrl}
				alt=""
				fill
				sizes="100vw"
				className="object-cover"
				priority
				unoptimized
			/>

			<div className="flex absolute inset-x-0 top-6 justify-between px-6 text-sm text-white sm:px-10">
				<span>{t("eyebrowLeft")}</span>
				<span className="max-sm:hidden">{t("eyebrowCenter")}</span>
				<span>{t("eyebrowRight")}</span>
			</div>

			<div className="absolute inset-x-0 bottom-8 px-6 sm:px-10">
				<div className="flex flex-col gap-4 max-w-md text-white">
					<h1 className="text-4xl leading-[1.05] lg:text-6xl">{t("title")}</h1>
					<p className="text-white/80">{t("subtitle")}</p>
					<Link
						href={COLLECTION_PATHS.collectionDetail("all")}
						className="inline-flex gap-3 items-center px-6 py-3 w-fit text-sm font-medium bg-black rounded-full transition-colors hover:bg-black/90"
					>
						{t("ctaButton")}
						<span className="flex justify-center items-center w-6 h-6 rounded-full bg-white/15">
							<AddToCardIcon className="w-3.5 h-3.5" />
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Hero;
