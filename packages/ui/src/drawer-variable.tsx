import { cn } from "@prettyfull/utils";
import { useCallback, useMemo, useState } from "react";
import { ProductGallery } from "./components/products-/products-galery";
import ProductInfos from "./components/products-/products-infos";

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "./components/ui/drawer";

import { Separator } from "./components/ui/separator";
import { CloseIcon } from "./icons/close.icon";
import type { PricedProduct } from "./types/medusa";

// Helper pour générer un code couleur basé sur le nom (même que dans CardProduct)
const generateColorCode = (colorName: string): string => {
	const colorMap: Record<string, string> = {
		black: "#000000",
		white: "#FFFFFF",
		red: "#FF0000",
		blue: "#0000FF",
		green: "#00FF00",
		yellow: "#FFFF00",
		orange: "#FFA500",
		purple: "#800080",
		pink: "#FFC0CB",
		gray: "#808080",
		grey: "#808080",
		brown: "#A52A2A",
	};

	const normalized = colorName.toLowerCase().trim();
	return colorMap[normalized] || "#CCCCCC";
};

const DrawerVariable = ({
	label,
	product,
}: {
	label: string;
	product: PricedProduct;
}) => {
	const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
	};

	// Extraire les options Color et Size depuis Medusa
	const {
		title: name,
		thumbnail,
		variants: medusaVariants,
		options: medusaOptions,
		images: productImages,
	} = product;

	const colorOption = medusaOptions?.find(
		(opt: any) =>
			opt.title.toLowerCase() === "color" ||
			opt.title.toLowerCase() === "couleur"
	);

	const sizeOption = medusaOptions?.find(
		(opt: any) =>
			opt.title.toLowerCase() === "size" || opt.title.toLowerCase() === "taille"
	);

	// Mapper les couleurs disponibles (même logique que CardProduct)
	const colorVariants = useMemo(() => {
		if (!medusaVariants || medusaVariants.length === 0) return [];

		if (!colorOption) {
			return [
				{
					label: "Default",
					variants: medusaVariants,
					thumbnail:
						thumbnail || productImages?.[0]?.url || "/assets/product_2.jpg",
					images: productImages?.map((img: any) => img.url) || [],
				},
			];
		}

		const colorMap = new Map<
			string,
			{
				label: string;
				variants: typeof medusaVariants;
				thumbnail: string;
				images: string[];
			}
		>();

		medusaVariants.forEach((variant: any) => {
			const colorValue = variant.options?.find(
				(opt: any) => opt.option_id === colorOption.id
			)?.value;

			if (colorValue && !colorMap.has(colorValue)) {
				// Récupérer tous les variants de cette couleur
				const colorVariantsList = medusaVariants.filter((v: any) =>
					v.options?.some(
						(o: any) => o.option_id === colorOption.id && o.value === colorValue
					)
				);

				// Récupérer les images de tous les variants de cette couleur
				const colorVariantImages = colorVariantsList
					.map((v: any) => v.thumbnail)
					.filter((img: string) => img);

				// Prendre la photo du premier variant de cette couleur
				const firstVariantThumbnail = colorVariantsList[0]?.thumbnail;

				colorMap.set(colorValue, {
					label: colorValue, // Nom de la couleur en texte
					variants: colorVariantsList,
					thumbnail:
						firstVariantThumbnail || productImages?.[0]?.url || thumbnail || "",
					images:
						colorVariantImages.length > 0
							? colorVariantImages
							: productImages?.map((img: any) => img.url) || [],
				});
			}
		});

		return Array.from(colorMap.values());
	}, [colorOption, medusaVariants, productImages, thumbnail]);

	// État pour la couleur et taille sélectionnées
	const [activeColorIndex, setActiveColorIndex] = useState(0);
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [activeImage, setActiveImage] = useState<number>(0);
	const [disabled, setDisabled] = useState(true);

	// Tailles disponibles pour la couleur active
	const availableSizes = useMemo(() => {
		if (colorVariants.length === 0) return [];

		const currentColorVariants =
			colorVariants[activeColorIndex]?.variants || [];

		if (!sizeOption) {
			return currentColorVariants
				.map((v: any) => v.title)
				.filter((title: any) => title && title !== null);
		}

		const sizesSet = new Set<string>();
		currentColorVariants.forEach((variant: any) => {
			const sizeValue = variant.options?.find(
				(opt: any) => opt.option_id === sizeOption.id
			)?.value;
			if (sizeValue) sizesSet.add(sizeValue);
		});

		return Array.from(sizesSet);
	}, [sizeOption, colorVariants, activeColorIndex]);

	// Images pour la couleur active
	const currentImages = useMemo(() => {
		if (colorVariants.length === 0) return [];
		return colorVariants[activeColorIndex]?.images || [];
	}, [colorVariants, activeColorIndex]);

	const handleColorChange = useCallback(
		async (colorLabel: string) => {
			const newIndex = colorVariants.findIndex((cv) => cv.label === colorLabel);
			if (newIndex !== -1) {
				setActiveColorIndex(newIndex);
				setSelectedSize("");
				setDisabled(true);
				setActiveImage(0);
			}
		},
		[colorVariants]
	);

	const handleSizeChange = useCallback(async (size: string) => {
		setSelectedSize(size);
		setDisabled(false);
	}, []);

	const handleClick = () => {
		const currentColor = colorVariants[activeColorIndex];
		if (!currentColor) return;

		let matchingVariant;

		if (sizeOption) {
			matchingVariant = currentColor.variants.find((variant: any) => {
				const variantSize = variant.options?.find(
					(opt: any) => opt.option_id === sizeOption.id
				)?.value;
				return variantSize === selectedSize;
			});
		} else {
			matchingVariant = currentColor.variants.find(
				(variant: any) => variant.title === selectedSize
			);
		}

		if (matchingVariant) {
			console.log("Acheter", {
				variant_id: matchingVariant.id,
				size: selectedSize,
				color: currentColor.label,
			});
			// Ajouter ici la logique d'ajout au panier si nécessaire
		}
	};

	return (
		<Drawer direction="bottom">
			<DrawerTrigger>
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
								images={currentImages}
								name={name}
								activeImage={activeImage}
								setActiveImage={setActiveImage}
								promotion={undefined}
							/>
							<ProductInfos
								sizes={availableSizes}
								productData={{ product }}
								selectedColor={colorVariants[activeColorIndex]?.label || ""}
								setSelectedColor={handleColorChange}
								selectedSize={selectedSize}
								setSelectedSize={handleSizeChange}
								promotion={undefined}
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
							<h2 className="text-[3rem]! font-semibold pb-8">
								Suggestion de produit
							</h2>
							<div className="grid w-full grid-cols-2 gap-4 h-4/6">
								{/* TODO: Remplacer par de vrais produits suggestions depuis l'API */}
								<p className="text-gray-400">Chargement des suggestions...</p>
							</div>
						</div>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerVariable;
