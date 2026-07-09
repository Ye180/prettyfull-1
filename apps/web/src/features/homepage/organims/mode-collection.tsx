import { useGetProductsSameCollection } from "@/shared/api/medusa/get-products-same-collection";
import { LoadingPrettyfull } from "@/shared/components/molecules/core/loading-prettyfull";
import { useRegionStore } from "@/stores/useRegion";
import {
	Button,
	CardProduct,
	GridCardProduct,
	normalizeCollectionProducts,
	RawCollectionProduct,
} from "@prettyfull/ui";
import { getMediaUrl } from "@prettyfull/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetCategoryByHandler } from "../api/medusa/get-chidren-metadata";

interface ModeCollectionProps {
	fourth?: {
		title?: string;
		description?: string;
	};
}

const IMAGE_CONTAINER_CLASS =
	"relative flex items-end w-full md:w-1/2 h-160 md:h-[90vh] overflow-hidden";

const SectionHeader = ({
	title,
	description,
	ctaLabel,
	variant,
	isLoading,
}: {
	title: string;
	description: string;
	ctaLabel: string;
	variant: "mobile" | "desktop";
	isLoading?: boolean;
}) => {
	const isMobile = variant === "mobile";

	if (isLoading) {
		return (
			<div className="">
				<div className="w-full h-24 bg-gray-200 rounded-2xl animate-pulse" />
				<div className="mt-4 w-1/4 h-16 bg-gray-200 rounded-lg animate-pulse" />
			</div>
		);
	}

	return (
		<div
			className={
				isMobile
					? "space-y-4 md:hidden text-center! w-full"
					: "space-y-0 max-md:hidden"
			}
		>
			<h2
				className={
					isMobile
						? "text-[3.5rem]! md:text-[4rem]! font-semibold text-black"
						: "text-[4rem]! font-semibold text-black tracking-wide"
				}
			>
				{title}
			</h2>
			<p
				className={
					isMobile
						? "text-[1.5rem] font-light text-black/70"
						: "text-[1.8rem] font-normal text-black/70"
				}
			>
				{description}
			</p>
			<Button
				variant="default"
				className={`px-12 py-4 size-fit ${isMobile ? "mt-4" : "mt-6"}`}
			>
				{ctaLabel}
			</Button>
		</div>
	);
};

const CategoryImage = ({
	imageUrl,
	dealLabel,
}: {
	imageUrl: string;
	dealLabel: string;
}) => (
	<div className={IMAGE_CONTAINER_CLASS}>
		<Image
			src={imageUrl}
			alt="Collection image"
			fill
			sizes="(max-width: 768px) 100vw, 50vw"
			className="object-cover h-full"
		/>
		<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/40 to-black/0" />
		<div className="flex static z-20 justify-between items-center p-8 pb-16 w-full">
			<h4 className="text-[16px] text-white">{dealLabel}</h4>
		</div>
	</div>
);

const ModeCollection = ({ fourth }: ModeCollectionProps) => {
	const t = useTranslations("HomePage.collection");
	const params = useParams();

	const results = useGetCategoryByHandler(
		params.id as string,
		"fourth_section",
	);

	const queryResult = results[0];
	const isLoading = queryResult?.isLoading ?? true;
	const firstCategory = useMemo(
		() => queryResult?.data?.[0],
		[queryResult?.data],
	);
	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const {
		data: productSameCollection,
		isLoading: loadingProductsSameCollection,
	} = useGetProductsSameCollection();

	const normalizedProducts = useMemo(
		() =>
			productSameCollection?.map((group) =>
				normalizeCollectionProducts(group as RawCollectionProduct),
			) ?? [],
		[productSameCollection],
	);

	const title = fourth?.title || t("title");
	const description = fourth?.description || t("subtitle");
	const ctaLabel = t("ctaButton");
	const imageUrl =
		getMediaUrl(firstCategory?.product_category_image?.[0]?.url) ?? "";

	return (
		<>
			{(firstCategory?.product_category_image?.length ?? 0) > 0 && (
				<Container
					maxWidth="100vw"
					className="flex gap-x-12 justify-between items-start px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12"
				>
					<SectionHeader
						title={title}
						description={description}
						ctaLabel={ctaLabel}
						variant="mobile"
						isLoading={isLoading}
					/>

					{isLoading || !firstCategory ? (
						<LoadingPrettyfull className="w-full md:w-1/2 h-160 md:h-[90vh]" />
					) : (
						<CategoryImage imageUrl={imageUrl} dealLabel={t("deal")} />
					)}
					<div className="overflow-hidden space-y-12 w-full md:w-1/2 h-fit">
						<SectionHeader
							title={title}
							description={description}
							ctaLabel={ctaLabel}
							variant="desktop"
							isLoading={isLoading}
						/>
						{loadingProductsSameCollection ? (
							<div className="grid grid-cols-2 gap-4">
								{Array.from({ length: 2 }, (_, i) => (
									<div key={i} className="space-y-3 animate-pulse">
										<div className="w-full bg-gray-200 rounded-lg h-200" />
										<div className="w-3/4 h-6 bg-gray-200 rounded" />
										<div className="w-1/3 h-6 bg-gray-300 rounded" />
									</div>
								))}
							</div>
						) : (
							<GridCardProduct classGrid="grid grid-cols-2">
								{normalizedProducts.map((product) => (
									<CardProduct
										key={product.collectionId}
										product={product}
										currencyCode={currencyCode}
									/>
								))}
							</GridCardProduct>
						)}
					</div>
				</Container>
			)}
		</>
	);
};

export default ModeCollection;
