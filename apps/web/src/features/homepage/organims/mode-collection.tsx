import { Button, CardProduct, GridCardProduct } from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsMedusa } from "../api/medusa/get-products-medusa";

const ModeCollection = ({ fourth }: { fourth?: any }) => {
	const t = useTranslations("HomePage.collection");

	const { data: productMedusa, isLoading: loadingProductsMedusa } =
		useGetProductsMedusa();

	return (
		<Container
			maxWidth="100vw"
			className="flex items-start justify-between px-4 lg:px-40 max-md:flex-col h-fit max-md:space-y-12 gap-x-12"
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
					className="h-full overflow-hidden bg-center bg-no-repeat bg-cover bg-black/60"
				/>

				<div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/40 to-black/0" />

				<div className="static z-20 flex items-center justify-between w-full p-8 pb-16">
					<h4 className="text-[16px] text-white">{t("deal")}</h4>
				</div>
			</div>
			<div className="w-full space-y-12 overflow-hidden md:w-1/2 h-fit ">
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
				<GridCardProduct classGrid="grid grid-cols-2  ">
					<>
						{productMedusa?.slice(0, 2).map((product) => (
							<CardProduct key={product.id} product={product as any} />
						))}
					</>
				</GridCardProduct>
			</div>
		</Container>
	);
};

export default ModeCollection;
