"use client";

import { paths } from "@/lib/routes/paths-en";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";

interface CollectionTileProps {
	image: string;
	label: string;
	ctaLabel: string;
}

const CollectionTile = ({ image, label, ctaLabel }: CollectionTileProps) => (
	<Link
		href={paths.collections}
		className="overflow-hidden relative block w-full h-[320px] bg-gray-100 rounded-2xl group"
	>
		<Image
			src={image}
			alt={label}
			fill
			sizes="(min-width: 1024px) 33vw, 100vw"
			className="object-cover transition-transform duration-300 group-hover:scale-105"
			unoptimized
		/>
		<div className="absolute inset-x-0 bottom-5 px-5">
			<div className="flex flex-col gap-2 text-white">
				<span className="text-lg font-medium">{label}</span>
				<span className="inline-flex gap-2 items-center px-4 py-1.5 w-fit text-xs bg-white rounded-full text-black">
					{ctaLabel}
				</span>
			</div>
		</div>
	</Link>
);

const ShopByCollection = () => {
	const t = useTranslations("HomePage.shopByCollection");

	const tiles = [
		{ image: "/home/arrivals-1.jpg", label: t("jacket") },
		{ image: "/home/arrivals-4.jpg", label: t("tshirts") },
		{ image: "/home/arrivals-3.jpg", label: t("shorts") },
	];

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h2 className="text-3xl lg:text-4xl">{t("title")}</h2>
				<div className="flex gap-2 items-center max-sm:hidden">
					<button
						type="button"
						aria-label="Previous"
						className="flex justify-center items-center w-10 h-10 rounded-full border border-black/20 transition-colors hover:bg-black hover:text-white cursor-pointer"
					>
						<ArrowLinearIcon className="w-4 h-4 -rotate-90" />
					</button>
					<button
						type="button"
						aria-label="Next"
						className="flex justify-center items-center w-10 h-10 bg-black text-white rounded-full cursor-pointer"
					>
						<ArrowLinearIcon className="w-4 h-4 rotate-90" />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				{tiles.map((tile) => (
					<CollectionTile
						key={tile.label}
						image={tile.image}
						label={tile.label}
						ctaLabel={t("ctaButton")}
					/>
				))}
			</div>
		</div>
	);
};

export default ShopByCollection;
