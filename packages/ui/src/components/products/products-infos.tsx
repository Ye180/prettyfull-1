import { formatCurrency_FR } from "@prettyfull/utils";

import { Button } from "../../button";
import { Heart } from "../../icons/heart.icon";
import { ProductOptions } from "./product-options";

import { CardProps } from "../../card-product";

// import { Button } from "@/button";

export interface SizeOption {
	label: string;
	value: string;
}

type ProductInfosProps = {
	productData: CardProps; // On utilise notre nouveau type
	selectedColor: string;
	setSelectedColor: (color: string) => void;
	selectedSize: string;
	setSelectedSize: (size: string) => void;
	sizes: SizeOption[] | string[];
	handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onClick: ({ size, color }: { size: string; color: string }) => void;
	disabled?: boolean;
	promotion?: {
		pourcentage: number;
	};
};

const ProductInfos = ({
	sizes,
	productData,
	selectedColor,
	setSelectedColor,
	selectedSize,
	setSelectedSize,
	handleClick,
	onClick,
	disabled,
	promotion,
}: ProductInfosProps) => {
	const classNames = "!font-light font-manrope !text-[1.8rem]";
	return (
		<div className="w-full lg:w-2/5 ">
			<div className="space-y-2">
				{/* Catégorie */}
				<h4 className="tracking-wide text-gray-500 uppercase !text-[2.1rem] font-bebas-neue">
					{productData?.category}
				</h4>

				{/* Titre et prix */}
				<div className="space-y-1">
					{promotion && (
						<span className="font-bold text-red-700 !text-[1.5rem] lg:!text-xs    rounded-full max-sm:flex sm:hidden ">
							{promotion.pourcentage}% OFF
						</span>
					)}
					<h1 className="!text-[3rem] sm:!text-[4.8rem] font-bold ">
						{productData.name}
					</h1>
					{productData.promotion ? (
						<div className="block text-start ">
							<h4 className="!text-2xl  sm:!text-3xl whitespace-nowrap">
								{" "}
								{formatCurrency_FR(productData.promotion?.reduced_price || 0)}
							</h4>
							<h4 className="text-grey/50  line-through !text-[2rem] sm:!text-[2.8rem]   whitespace-nowrap">
								{productData.price.amount
									? formatCurrency_FR(productData.price.amount)
									: ""}
							</h4>
						</div>
					) : (
						<h4 className="!text-2xl  sm:!text-3xl whitespace-nowrap">
							{formatCurrency_FR(productData.price.amount)}
						</h4>
					)}
				</div>

				{/* Options de produit */}
				<ProductOptions
					sizes={sizes as SizeOption[]}
					variable={productData.variable}
					selectedSize={selectedSize}
					selectedColor={selectedColor}
					onColorChange={(color) => setSelectedColor(color)}
					onSizeChange={(selectedSize) => {
						setSelectedSize(selectedSize);
					}}
					handleClick={handleClick}
				/>

				{/* Boutons d'action */}
				<div className="flex gap-8 mt-15 w-full sm:w-[70%] items-center pb-8">
					<Button
						variant="default"
						className="flex-1 py-6 text-lg"
						onClick={() =>
							onClick({ size: selectedSize, color: selectedColor })
						}
						disabled={disabled}
					>
						Acheter
					</Button>

					<Button
						variant="outline"
						className="p-4 text-2xl rounded-full cursor-pointer w-fit h-fit "
					>
						<Heart />
					</Button>
				</div>

				{/* Section description */}
			</div>
		</div>
	);
};

export default ProductInfos;
