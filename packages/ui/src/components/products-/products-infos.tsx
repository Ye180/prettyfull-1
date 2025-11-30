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
	productData: CardProps;
	selectedColor: string;
	setSelectedColor: (color: string) => void;
	selectedSize: string;
	setSelectedSize: (size: string) => void;
	sizes: SizeOption[] | string[];
	handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onClick: (params?: { size: string; color: string }) => void;
	disabled?: boolean;
	promotion?: {
		pourcentage: number;
		reduced?: {
			amount: number;
			currency: string;
		};
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
	// Extraire les données du produit (compatible avec le nouveau format Medusa)
	const product = productData.product;
	const productName = product?.title || (productData as any).name || "Produit";
	const productCategory =
		product?.collection?.title ||
		(productData as any).category?.name ||
		"Catégorie";

	// Calcul du prix (utiliser le variant le moins cher)
	let minPrice = 0;
	if (product?.variants && product.variants.length > 0) {
		const prices = product.variants
			.map(
				(v: any) =>
					v.calculated_price?.calculated_amount || v.calculated_price || 0
			)
			.filter((p: number) => p > 0);
		minPrice = prices.length > 0 ? Math.min(...prices) : 0;
	}

	return (
		<div className="w-full lg:w-2/5 ">
			<div className="space-y-2">
				{/* Catégorie */}
				<h4 className="tracking-wide text-gray-500 uppercase text-[2.1rem]! font-bebas-neue">
					{productCategory}
				</h4>

				{/* Titre et prix */}
				<div className="space-y-1">
					{promotion && (
						<span className="font-bold text-red-700 text-[1.5rem]! lg:text-xs! rounded-full max-sm:flex sm:hidden">
							{promotion.pourcentage}% OFF
						</span>
					)}
					<h1 className="text-[3rem]! sm:text-[4.8rem]! font-bold">
						{productName}
					</h1>
					{promotion ? (
						<div className="block text-start">
							<h4 className="text-2xl! sm:text-3xl! whitespace-nowrap">
								{formatCurrency_FR(promotion.reduced?.amount || 0)}
							</h4>
							<h4 className="text-grey/50 line-through text-[2rem]! sm:text-[2.8rem]! whitespace-nowrap">
								{formatCurrency_FR(minPrice)}
							</h4>
						</div>
					) : (
						<h4 className="text-2xl! sm:text-3xl! whitespace-nowrap">
							{formatCurrency_FR(minPrice)}
						</h4>
					)}
				</div>

				{/* Options de produit */}
				<ProductOptions
					sizes={sizes as SizeOption[]}
					product={productData.product}
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
