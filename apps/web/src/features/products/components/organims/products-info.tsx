import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Button,
} from "@prettyfull/ui";
import { cn, formatCurrency_FR } from "@prettyfull/utils";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { ProductTypes } from "../../types";
import { ProductOptions } from "../molecules/product-options";

type ProductInfoData = {
    category: string;
    title: string;
    price: number;
    description: string;
    sizes: { label: string; value: string }[];
    colors: { name: string; code: string }[];
};
type ProductInfosProps = {
    productData: ProductInfoData; // On utilise notre nouveau type
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
};
const ProductInfos = ({
	productData,
	selectedColor,
	setSelectedColor,
	selectedSize,
	setSelectedSize,
}: ProductInfosProps) => {
	const classNames = "!font-light font-manrope !text-[1.8rem]";
	return (
		<div className="w-full lg:w-2/5 ">
			<div className="space-y-6">
				{/* Catégorie */}
				<h4 className="tracking-wide text-gray-500 uppercase !text-[2.1rem] font-bebas-neue">
					{productData.category}
				</h4>

				{/* Titre et prix */}
				<div className="space-y-2">
					<h1 className="!text-[4.8rem] font-bold">{productData.title}</h1>
					<p className="text-3xl font-medium font-bebas-neue">
						{formatCurrency_FR(productData.price)}
					</p>
				</div>

				{/* Options de produit */}
				   <ProductOptions
                    sizes={productData.sizes}
                    colors={productData.colors}
                    selectedSize={selectedSize}
                    selectedColor={selectedColor}
                    onSizeChange={(size) => setSelectedSize(size)}
                    onColorChange={(color) => setSelectedColor(color)}
                />

				{/* Boutons d'action */}
				<div className="flex gap-8 mt-15 w-[70%] items-center">
					<Button variant="default" className="flex-1 py-6 text-lg">
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
				<div className="pt-10 space-y-4">
					<h4 className="!text-[4rem] font-bold">DESCRIPTION</h4>

					<Accordion type="single" collapsible className="space-y-4">
						<AccordionItem value="item-1">
							<AccordionTrigger className={cn(classNames)}>
								Overview
							</AccordionTrigger>
							<AccordionContent>
								<p className="text-gray-700">{productData.description}</p>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2 ">
							<AccordionTrigger className={cn(classNames)}>
								Materials
							</AccordionTrigger>
							<AccordionContent>
								<p className="text-gray-700">
									Fabriqué en coton de haute qualité pour un confort optimal.
								</p>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger className={cn(classNames)}>
								Return Policy
							</AccordionTrigger>
							<AccordionContent>
								<p className="text-gray-700">
									Retours acceptés sous 14 jours dans l'emballage d'origine.
								</p>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
};

export default ProductInfos;
