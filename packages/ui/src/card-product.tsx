"use client";
import { cn, data_url, formatCurrency_FR } from "@prettyfull/utils";
import { VariantProps, cva } from "class-variance-authority";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import {
	SetStateAction,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useAddItemToCartMedusa } from "../../../apps/web/src/features/cart/api/medusa/add-item-to-cart-medusa";
import { Button } from "./button";
import DrawerCart from "./drawer-cart";
import DrawerVariable from "./drawer-variable";
import { CloseIcon } from "./icons/close.icon";
import { Heart } from "./icons/heart.icon";
import Size from "./size";
import type { PricedProduct } from "./types/medusa";

// Type assertion to fix React version mismatch between packages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Image = NextImage as any;

// Helper pour générer un code couleur basé sur le nom (fallback)
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
		// Ajoutez d'autres couleurs selon vos besoins
	};

	const normalized = colorName.toLowerCase().trim();
	return colorMap[normalized] || "#CCCCCC"; // Gris par défaut
};

const cardVariants = cva(["space-y-3 w-[100%] h-fit max-lg:pb-6 "], {
	variants: {
		variant: {
			default: "tracking-wide 	cursor-pointer",
		},
		size: {
			default: " ",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

const INITIAL_DRAWER_STATES = {
	showSizes: false,
	showVariable: false,
};

type DrawerStatesProps = typeof INITIAL_DRAWER_STATES;

export interface CardProps
	extends
		React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	product: PricedProduct;
	// Toutes les autres props sont dépréciées et seront extraites de `product`
}

export function CardProduct({ product, className, ...props }: CardProps) {
	// Vérification de sécurité - si product est undefined
	if (!product) {
		return (
			<article className={cn(cardVariants(), className)} {...props}>
				<div className="relative h-[400px] bg-gray-100 animate-pulse rounded-lg"></div>
				<div className="space-y-3">
					<div className="h-4 bg-gray-200 rounded animate-pulse"></div>
					<div className="h-6 bg-gray-200 rounded animate-pulse"></div>
				</div>
			</article>
		);
	}

	// Extraire les données de l'objet `product` de Medusa
	const {
		id: productId,
		title: name,
		thumbnail,
		variants: medusaVariants,
		options: medusaOptions,
		handle: slug,
		description: smallDescription,
		images: productImages,
	} = product;

	// ===== EXTRACTION DES OPTIONS (Color, Size) =====er
	const colorOption = medusaOptions?.find(
		(opt: any) =>
			opt.title.toLowerCase() === "color" ||
			opt.title.toLowerCase() === "couleur",
	);
	const sizeOption = medusaOptions?.find(
		(opt: any) =>
			opt.title.toLowerCase() === "size" ||
			opt.title.toLowerCase() === "taille",
	);

	// ===== MAPPER LES COULEURS DISPONIBLES =====
	// Créer un tableau de couleurs uniques avec leurs variants associés
	const colorVariants = useMemo(() => {
		if (!medusaVariants || medusaVariants.length === 0) return [];

		// Si pas d'option couleur, créer un variant "par défaut" avec tous les variants
		if (!colorOption) {
			return [
				{
					label: "Default",
					variants: medusaVariants,
					thumbnail:
						thumbnail || productImages?.[0]?.url || "/assets/product_2.jpg",
				},
			];
		}

		const colorMap = new Map<
			string,
			{
				label: string;
				variants: typeof medusaVariants;
				thumbnail: string;
			}
		>();

		medusaVariants.forEach((variant: any) => {
			const colorValue = variant.options?.find(
				(opt: any) => opt.option_id === colorOption.id,
			)?.value;

			if (colorValue && !colorMap.has(colorValue)) {
				// Récupérer tous les variants de cette couleur
				const colorVariantsList = medusaVariants.filter((v: any) =>
					v.options?.some(
						(o: any) =>
							o.option_id === colorOption.id && o.value === colorValue,
					),
				);

				// Prendre la photo du premier variant de cette couleur
				const firstVariantThumbnail = colorVariantsList[0]?.thumbnail;

				colorMap.set(colorValue, {
					label: colorValue, // Nom de la couleur en texte (ex: "Black", "White")
					variants: colorVariantsList,
					thumbnail:
						firstVariantThumbnail || productImages?.[0]?.url || thumbnail || "",
				});
			}
		});

		return Array.from(colorMap.values());
	}, [colorOption, medusaVariants, productImages, thumbnail]);

	// ===== TROUVER LE PRIX LE MOINS CHER + DÉTECTER PROMOTION =====
	const priceInfo = useMemo(() => {
		if (!medusaVariants || medusaVariants.length === 0) {
			return {
				price: { amount: 0, currency: "EUR" },
				hasPromotion: false,
				promotion: null,
			};
		}

		let minCalculatedPrice = Infinity;
		let minOriginalPrice = Infinity;
		let currency = "EUR";

		medusaVariants.forEach((variant: any) => {
			if (variant.calculated_price) {
				const calcPrice =
					typeof variant.calculated_price === "object"
						? variant.calculated_price.calculated_amount
						: variant.calculated_price;
				if (calcPrice !== undefined && calcPrice < minCalculatedPrice) {
					minCalculatedPrice = calcPrice;
					currency =
						typeof variant.calculated_price === "object"
							? variant.calculated_price.currency_code || "EUR"
							: "EUR";
				}
			}

			if (variant.original_price) {
				const origPrice =
					typeof variant.original_price === "object"
						? variant.original_price.calculated_amount
						: variant.original_price;
				if (origPrice !== undefined && origPrice < minOriginalPrice) {
					minOriginalPrice = origPrice;
				}
			}
		});

		const hasPromotion =
			minOriginalPrice !== Infinity &&
			minCalculatedPrice !== Infinity &&
			minCalculatedPrice < minOriginalPrice;

		const promotion = hasPromotion
			? {
					reduced_price: { amount: minCalculatedPrice, currency },
					pourcentage: Math.round(
						((minOriginalPrice - minCalculatedPrice) / minOriginalPrice) * 100,
					),
				}
			: null;

		return {
			price: {
				amount: hasPromotion ? minOriginalPrice : minCalculatedPrice,
				currency,
			},
			hasPromotion,
			promotion,
		};
	}, [medusaVariants]);

	// ===== STATE MANAGEMENT =====
	const [activeColorIndex, setActiveColorIndex] = useState(0);
	const router = useRouter();
	const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
	const [drawerStates, setDrawerStates] = useState<DrawerStatesProps>(
		INITIAL_DRAWER_STATES,
	);

	// --- LOGIQUE D'AJOUT AU PANIER ---
	const addItemToCartMutation = useAddItemToCartMedusa();

	const [selectedSize, setSelectedSize] = useState<string>("");
	// --- FIN DE LA LOGIQUE ---

	const updateDrawerState = useCallback(
		(key: keyof DrawerStatesProps, value: SetStateAction<boolean>) => {
			setDrawerStates((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	// ===== TAILLES DISPONIBLES POUR LA COULEUR ACTIVE =====
	const availableSizes = useMemo(() => {
		if (colorVariants.length === 0) return [];

		const currentColorVariants =
			colorVariants[activeColorIndex]?.variants || [];

		// Si pas d'option taille, retourner les titres des variants
		if (!sizeOption) {
			return currentColorVariants
				.map((v: any) => v.title)
				.filter((title: any) => title && title !== null);
		}

		const sizesSet = new Set<string>();

		currentColorVariants.forEach((variant: any) => {
			const sizeValue = variant.options?.find(
				(opt: any) => opt.option_id === sizeOption.id,
			)?.value;
			if (sizeValue) sizesSet.add(sizeValue);
		});

		return Array.from(sizesSet);
	}, [sizeOption, colorVariants, activeColorIndex]);

	const handleRoutes = (link?: string) => {
		if (link) {
			router.push(link);
		}
	};

	// Gestion de l'affichage des tailles
	const handleShowSizes = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation();
			updateDrawerState("showSizes", !drawerStates.showSizes);
		},
		[drawerStates.showSizes, updateDrawerState],
	);

	// --- FONCTION handleSizeSelect (AJOUT AU PANIER AVEC MEDUSA) ---
	const handleSizeSelect = (selectedSizeValue: string) => {
		setSelectedSize(selectedSizeValue);

		// Trouver le variant_id correspondant à la couleur + taille sélectionnée
		const currentColor = colorVariants[activeColorIndex];
		if (!currentColor) {
			alert("Impossible de trouver la couleur sélectionnée");
			return;
		}

		let matchingVariant;

		if (sizeOption) {
			// Cas normal : chercher par option de taille
			matchingVariant = currentColor.variants.find((variant: any) => {
				const variantSize = variant.options?.find(
					(opt: any) => opt.option_id === sizeOption.id,
				)?.value;
				return variantSize === selectedSizeValue;
			});
		} else {
			// Cas sans option taille : chercher par title
			matchingVariant = currentColor.variants.find(
				(variant: any) => variant.title === selectedSizeValue,
			);
		}

		if (!matchingVariant) {
			alert("Variant non trouvé pour cette taille et couleur");
			return;
		}

		const cartId = localStorage.getItem("cart_id");

		// IMPORTANT: Avec Medusa, on envoie le variant_id directement
		// Adapter votre API backend pour accepter variant_id au lieu de selectedVariants
		addItemToCartMutation.mutate(
			{
				cartId: cartId || "",
				quantity: 1,
				variant_id: matchingVariant.id, // ou adapter votre API
			},
			{
				onSuccess: () => {
					alert("Produit ajouté au panier !");
				},
				onError: (error: any) => {
					console.error("Erreur lors de l'ajout:", error);
					alert(
						`Erreur: ${error?.message || "Impossible d'ajouter au panier"}`,
					);
				},
			},
		);

		updateDrawerState("showSizes", false);
	};

	// Changer de couleur (variant de couleur)
	const handleColorClick = ({
		e,
		index,
	}: {
		e: React.MouseEvent<HTMLButtonElement>;
		index: number;
	}) => {
		setActiveColorIndex(index);
		setSelectedSize(""); // Reset size selection
		e.stopPropagation();
	};

	// Préchargement des images
	useEffect(() => {
		if (colorVariants.length > 0) {
			// console.log("ColorVariants pour", name, ":", colorVariants);

			const loadImages = async () => {
				const loadPromises = colorVariants.map((colorVar, idx) => {
					return new Promise<boolean>((resolve) => {
						const img = new window.Image();
						img.onload = () => {
							// console.log(`Image ${idx} chargée:`, colorVar.thumbnail);
							resolve(true);
						};
						img.onerror = (e) => {
							// console.error(`Image ${idx} échouée:`, colorVar.thumbnail, e);
							resolve(false);
						};
						img.src = colorVar.thumbnail;
					});
				});

				const results = await Promise.all(loadPromises);
				setImagesLoaded(results);
			};

			loadImages();
		}
	}, [colorVariants, name]);

	// URL du produit
	const productLink = slug ? `/products/${slug}` : undefined;

	return (
		<article className={cn(cardVariants(), className)} {...props}>
			<div
				className="relative h-fit  md:hover:[&>div]:opacity-100 "
				onClick={() => handleRoutes(productLink)}
			>
				{colorVariants.length === 0 || !imagesLoaded[activeColorIndex] ? (
					<div className="flex absolute inset-0 z-10 justify-center items-center bg-black/5">
						<div className="w-12 h-12 rounded-full border-4 border-gray-200 animate-spin border-t-transparent"></div>
					</div>
				) : null}
				{colorVariants?.map((colorVar, i) => (
					<Image
						key={i}
						src={colorVar.thumbnail || thumbnail || "/assets/product_2.jpg"}
						alt={`${name} - ${colorVar.label}`}
						width={600}
						height={800}
						sizes="
						(max-width: 344px) 100px,
						(max-width: 375px) 100px,
						(max-width: 639px) 150px,
						(max-width: 767px) 200px,
						(max-width: 989px) 250px,
						(max-width: 1179px) 200px,
						(max-width: 1366px) 250px,
						(max-width: 1800px) 400px,
						(max-width: 2800px) 400px,
						400px
						"
						className={cn(
							"object-contain w-full h-full  transition-opacity duration-300 ",
							i === activeColorIndex ? "opacity-100 " : "hidden opacity-0",
						)}
						priority={i === 0}
						placeholder="blur"
						blurDataURL={data_url}
						style={
							{
								"--aspect-ratio-hack": "149.70059880239518%",
							} as any
						}
					/>
				))}
				{/* Boutons d'action */}
				{!drawerStates.showSizes && (
					<div className="flex absolute bottom-5 gap-8 justify-between items-center px-4 w-full opacity-0 transition-all duration-300 ease-in-out max-md:hidden md:flex">
						<Button
							className="pt-4 pb-5 px-4 w-2/3 text-[1.4rem] font-medium"
							onClick={(e) => handleShowSizes(e)}
						>
							Ajouter au panier
						</Button>
						<button
							className="p-4 text-2xl rounded-full cursor-pointer w-fit bg-secondary"
							onClick={(e) => e.stopPropagation()}
						>
							<Heart />
						</button>
					</div>
				)}
				<div className="flex absolute right-0 bottom-5 justify-between items-center p-2 w-full text-2xl rounded-full cursor-pointer">
					<button
						className="p-2 text-2xl rounded-full cursor-pointer w-fit bg-secondary max-md:flex md:hidden"
						onClick={(e) => e.stopPropagation()}
					>
						<Heart className="w-8 h-8" />
					</button>
					<DrawerCart
						size={availableSizes}
						handleClick={(e) => handleShowSizes(e)}
						close={() => updateDrawerState("showSizes", false)}
					/>
				</div>

				{priceInfo.hasPromotion && priceInfo.promotion && (
					<span className="fond-semibold bg-red-700 text-white text-[0.8rem]! lg:!text-[1.2rem]! lg:text-xs!  absolute top-4 left-4 px-3 py-2 rounded-full">
						{priceInfo.promotion.pourcentage}% OFF
					</span>
				)}
				{availableSizes.length > 0 &&
					(drawerStates.showSizes ? (
						<div className="absolute bottom-5 p-8 px-4 w-full text-sm font-light text-center text-black bg-white rounded-md border-2 border-gray-200 shadow-lg max-md:hidden md:block">
							<div className="flex justify-between items-center mb-6">
								<p className="font-semibold text-[1.4rem]">Size</p>
								<button
									onClick={(e) => (
										e.stopPropagation(),
										updateDrawerState("showSizes", false)
									)}
									className="cursor-pointer"
								>
									<CloseIcon className="w-8 h-8" />
								</button>
							</div>

							<Size
								size={availableSizes}
								selectSize={selectedSize}
								onSizeChange={handleSizeSelect}
							/>
						</div>
					) : null)}
			</div>

			<div className="space-y-3">
				<p className="text-sm  max-sm:hidden capitalize text-grey  tracking-[0.03em] font-light">
					{smallDescription}
				</p>
			</div>
			<div className="flex justify-between items-start text-[#000] ">
				<h4 className="tracking-[0.03em] text-2xl! max-md:text-[2rem]!  md:text-[2.2rem]! truncate line-clamp-1">
					{" "}
					{name}
				</h4>

				{!priceInfo.hasPromotion && (
					<h4 className="text-2xl!  max-md:text-[2rem]!  md:text-[2.2rem]!">
						{" "}
						{formatCurrency_FR(priceInfo.price.amount)}
					</h4>
				)}
				{priceInfo.hasPromotion && priceInfo.promotion && (
					<>
						<div className="block text-end">
							<h4 className="text-2xl!  max-md:text-[2rem]! md:text-[2.2rem]!whitespace-nowrap">
								{" "}
								{formatCurrency_FR(priceInfo.promotion.reduced_price.amount)}
							</h4>
							<h4 className="text-grey/50 text-2xl! line-through max-md:text-[2rem]!  md:text-[2.2rem]!  whitespace-nowrap">
								{formatCurrency_FR(priceInfo.price.amount)}
							</h4>
						</div>
					</>
				)}
			</div>

			<div className="flex flex-wrap gap-2 justify-start items-center">
				{colorVariants?.slice(0, 3)?.map((colorVar, i) => (
					<button
						key={i}
						className={cn(
							"px-4 py-2 text-[1.3rem] border bg-white rounded-full transition-all duration-200 hover:shadow-sm capitalize font-medium",
							i === activeColorIndex
								? "border-black shadow-md bg-black text-white"
								: "border-gray-300 text-gray-700 hover:border-gray-400",
						)}
						onClick={(e) => handleColorClick({ e, index: i })}
						disabled={drawerStates.showSizes}
						title={colorVar.label}
					>
						{colorVar.label}
					</button>
				))}

				{colorVariants && colorVariants.length > 3 && (
					<DrawerVariable
						label={`+ ${colorVariants.length - 3}`}
						product={product}
					/>
				)}
			</div>
		</article>
	);
}
