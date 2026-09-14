"use client";

import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface PromoBoxProps {
	image: string;
	title: string;
	subtitle: string;
	ctaLabel: string;
	href: string;
}

const PromoBox = ({ image, title, subtitle, ctaLabel, href }: PromoBoxProps) => (
	<div className="overflow-hidden relative w-full h-[280px] bg-gray-100 rounded-2xl">
		<Image src={image} alt={title} fill sizes="50vw" className="object-cover" unoptimized />
		<div className="absolute inset-x-0 bottom-6 px-6">
			<div className="flex flex-col gap-3 text-white">
				<h3 className="text-2xl">{title}</h3>
				<p className="text-sm text-white/80">{subtitle}</p>
				<Link
					href={href}
					className="inline-flex gap-2 items-center px-5 py-2.5 w-fit text-sm font-medium bg-white rounded-full text-black transition-colors hover:bg-white/90"
				>
					{ctaLabel}
				</Link>
			</div>
		</div>
	</div>
);

const PromoDuo = () => {
	const t = useTranslations("HomePage.promoDuo");

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<PromoBox
				image="/home/cover-box-7.jpg"
				title={t("saleTitle")}
				subtitle={t("saleSubtitle")}
				ctaLabel={t("saleCta")}
				href={COLLECTION_PATHS.collectionDetail("all")}
			/>
			<PromoBox
				image="/home/commerce.jpg"
				title={t("knitwearTitle")}
				subtitle={t("knitwearSubtitle")}
				ctaLabel={t("knitwearCta")}
				href={COLLECTION_PATHS.collectionDetail("all")}
			/>
		</div>
	);
};

export default PromoDuo;
