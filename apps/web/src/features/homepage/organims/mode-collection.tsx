import { useGetProductsSameCollection } from "@/shared/api/medusa/get-products-same-collection";
import {
	Button,
	CardProduct,
	GridCardProduct,
	normalizeCollectionProducts,
	RawCollectionProduct,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const ModeCollection = ({ fourth }: { fourth?: any }) => {
	const t = useTranslations("HomePage.collection");

	const {
		data: productSameCollection,
		isLoading: loadingProductsSameCollection,
	} = useGetProductsSameCollection();

	return (
		<Container
			maxWidth="100vw"
			className="flex gap-x-12 justify-between items-start px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12"
		>
			<div className="space-y-4 md:hidden max-md:text-center! max-md:w-full">
				<h2 className="text-[3.5rem]! md:text-[4rem]! font-semibold text-black">
					{fourth?.title || t("title")}
				</h2>
				<p className="text-[1.5rem] font-light text-black/70">
					{fourth?.description || t("subtitle")}
				</p>
				<Button variant="default" className="px-12 py-4 mt-4 size-fit">
					{" "}
					{t("ctaButton")}
				</Button>
			</div>
			<div className="relative flex items-end w-full md:w-1/2 h-160 md:h-[90vh]  overflow-hidden  bg-cover  bg-no-repeat">
				<Image
					src="/home/promo-phone.jpg"
					alt="phone image"
					fill
					objectFit="cover"
					className="overflow-hidden h-full bg-center bg-no-repeat bg-cover bg-black/60"
				/>

				<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/40 to-black/0" />

				<div className="flex static z-20 justify-between items-center p-8 pb-16 w-full">
					<h4 className="text-[16px] text-white">{t("deal")}</h4>
				</div>
			</div>
			<div className="overflow-hidden space-y-12 w-full md:w-1/2 h-fit">
				<div className="space-y-0 max-md:hidden">
					<h2 className="text-[4rem]! font-semibold text-black tracking-wide">
						{fourth?.title || t("title")}
					</h2>
					<p className="text-[1.8rem] font-normal text-black/70">
						{fourth?.description || t("subtitle")}
					</p>
					<Button variant="default" className="px-12 py-4 mt-6 size-fit">
						{" "}
						{t("ctaButton")}
					</Button>
				</div>
				<GridCardProduct
					classGrid="grid grid-cols-2 "
					// className="h-[560px]!"
				>
					<>
						{productSameCollection?.map((group) => {
							const normalized = normalizeCollectionProducts(
								group as RawCollectionProduct
							);
							return (
								<CardProduct
									key={normalized.collectionId}
									product={normalized}
								/>
							);
						})}
					</>
				</GridCardProduct>
			</div>
		</Container>
	);
};

export default ModeCollection;
