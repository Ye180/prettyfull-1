import { cn } from "@prettyfull/utils";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useCallback, useMemo, useState } from "react";
import { CardProduct, CardProps } from "./card-product";
import { ProductGallery } from "./components/products/products-galery";
import ProductInfos, { SizeOption } from "./components/products/products-infos";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "./components/ui/drawer";
import { Separator } from "./components/ui/separator";
import { CloseIcon } from "./icons/close.icon";

const DrawerVariable = ({
	label,
	productData,
}: {
	label: string;
	name: string;
	photos: string[] | StaticImport[] | undefined;

	productData: CardProps;
}) => {
	const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
	};

	const [variable, setVariable] = useState<{
		images: string[] | StaticImport[];
		sizes: SizeOption[] | string[];
		activeImageOne?: number;
	}>({
		images: [],
		sizes: [],
		activeImageOne: 0,
	});

	const colorByDefault = productData?.variable
		? productData?.variable[0]?.color.code
		: productData.notVariable?.color
			? productData.notVariable.color.code
			: "#3b82f6";

	const sizeByDefault = variable?.sizes[0] as string;

	const [selectedColor, setSelectedColor] = useState<string>(
		colorByDefault as string
	);
	const [selectedSize, setSelectedSize] = useState<string>(
		sizeByDefault as string
	);

	const [activeImage, setActiveImage] = useState<number>(0);

	const [disabled, setDisabled] = useState(true);

	const availableColors = useMemo(() => {
		const colors = productData.variable?.find(
			(v) => v.color.code === selectedColor
		);

		setVariable({
			images:
				((colors?.image as string[]) || productData.notVariable?.image) ?? [],
			sizes: (colors?.size as string[]) || productData.notVariable?.size || [],
		});
	}, [selectedColor]);

	const handleColorChange = useCallback(
		async (selectedColor: string) => {
			variable;
			setSelectedColor(selectedColor);
			setDisabled(true);
			setSelectedSize(null as unknown as string);

			setActiveImage(0);
		},

		[selectedColor]
	);

	const handleSizeChange = useCallback(
		async (size: string) => {
			setSelectedSize(size);
			setDisabled(false);
		},

		[selectedSize]
	);

	const handleClick = () => {
		console.log("Acheter", { size: selectedSize, color: selectedColor });

		const selectedVariant = productData.variable?.find(
			(v) =>
				v.color.code === selectedColor &&
				(v.size as string[])?.includes(selectedSize)
		);

		selectedVariant === undefined ? setDisabled(true) : setDisabled(false);
	};

	return (
		<Drawer direction="bottom">
			<DrawerTrigger asChild>
				<button
					className={cn(
						" px-2 py-2 text-[1.2rem] size-10  text-black flex justify-center items-center rounded-full  duration-200 font-semibold bg-gray-100 cursor-pointer transition-all hover:bg-gray-200 whitespace-nowrap"
					)}
					onClick={(e) => handleClose(e)}
				>
					{label}
				</button>
			</DrawerTrigger>

			<DrawerContent
				title="Details du produit"
				className="flex justify-center py-6 border-none outline-none rounded-t-3xl"
			>
				<DrawerClose
					className="absolute z-30 p-2 text-2xl bg-white rounded-full cursor-pointer right-4 top-4"
					onClick={(e) => e.stopPropagation()}
				>
					<CloseIcon className="w-10 h-10" />
				</DrawerClose>

				<div className="h-[80vh] flex justify-around gap-10 lg:justify-center border-none ">
					<div className="flex justify-around w-full gap-10 px-4 overflow-y-scroll sm:px-10 scrollbar-hide lg:justify-center">
						<div className="flex flex-col w-full gap-6 sm:w-3/5 lg:justify-center sm:flex-row">
							<ProductGallery
								images={variable.images}
								name={productData.name}
								activeImage={activeImage}
								setActiveImage={setActiveImage}
								promotion={productData.promotion}
							/>
							<ProductInfos
								sizes={
									(variable.sizes as string[]) ||
									productData.notVariable?.size ||
									[]
								}
								productData={productData}
								selectedColor={selectedColor}
								setSelectedColor={handleColorChange}
								selectedSize={selectedSize}
								setSelectedSize={handleSizeChange}
								promotion={productData.promotion}
								onClick={() => {
									handleClick();
								}}
								disabled={disabled}
							/>
						</div>

						<Separator
							orientation="vertical"
							className="h-full max-md:hidden "
						/>

						<div className="w-2/5 max-md:hidden ">
							<h2 className="!text-[3rem] font-semibold pb-8">
								Suggestion de produit
							</h2>
							<div className="grid w-full grid-cols-2 gap-4 h-4/6">
								<>
									{Array.from({ length: 2 }).map((_, index) => (
										<CardProduct
											variable={[
												{
													color: {
														label: "Rouge",
														code: "#FF0000",
													},
													size: ["S", "M", "L", "XL", "2XL", "3XL"],
													image: [
														"/assets/product5.webp",
														"/assets/product_2.webp",
													],
													quantity: 1,
												},
												{
													color: {
														label: "Vert",
														code: "#00FF00",
													},
													size: ["S", "M", "L"],
													image: ["/assets/product_2.webp", "image4.jpg"],
													quantity: 1,
												},
												{
													color: {
														label: "Rouge",
														code: "#FF0000",
													},
													size: ["S", "M", "L", "XL", "2XL", "3XL"],
													image: [
														"/assets/product5.webp",
														"/assets/product_2.webp",
													],
													quantity: 1,
												},
												{
													color: {
														label: "Vert",
														code: "#00FF00",
													},
													size: ["S", "M", "L"],
													image: ["/assets/product_2.webp", "image4.jpg"],
													quantity: 1,
												},
												{
													color: {
														label: "Rouge",
														code: "#FF0000",
													},
													size: ["S", "M", "L", "XL", "2XL", "3XL"],
													image: [
														"/assets/product5.webp",
														"/assets/product_2.webp",
													],
													quantity: 1,
												},
												{
													color: {
														label: "Vert",
														code: "#00FF00",
													},
													size: ["S", "M", "L"],
													image: ["/assets/product_2.webp", "image4.jpg"],
													quantity: 1,
												},
												{
													color: {
														label: "Vert",
														code: "#00FF00",
													},
													size: ["S", "M", "L"],
													image: ["/assets/product_2.webp", "image4.jpg"],
													quantity: 1,
												},
												{
													color: {
														label: "Rouge",
														code: "#FF0000",
													},
													size: ["S", "M", "L", "XL", "2XL", "3XL"],
													image: [
														"/assets/product5.webp",
														"/assets/product_2.webp",
													],
													quantity: 1,
												},
												{
													color: {
														label: "Vert",
														code: "#00FF00",
													},
													size: ["S", "M", "L"],
													image: ["/assets/product_2.webp", "image4.jpg"],
													quantity: 1,
												},
											]}
											price={{ amount: 12000, currency: "USD" }}
											promotion={{
												pourcentage: 50,
												reduced_price: {
													amount: 6000,
													currency: "USD",
												},
											}}
											smallDescription="Top polyvalente á Manche"
											name="Sweet-Top"
											// link={PRODUCT_PATHS.productDetail("SWEET-TOP")}
										/>
									))}
								</>
							</div>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerVariable;
