"use client";
import { cn, data_url, formatCurrency_FR } from "@prettyfull/utils";
import { VariantProps, cva } from "class-variance-authority";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import DrawerCart from "./drawer-cart";
import DrawerVariable from "./drawer-variable";
import { CloseIcon } from "./icons/close.icon";
import { Heart } from "./icons/heart.icon";
import Size from "./size";

// (Cet import doit pointer vers le bon chemin dans votre app 'web')
import { useAddItemToCart } from "../../../apps/web/src/features/cart/api/add-item-to-cart";
import { SetStateAction, useCallback, useEffect, useState } from "react";

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
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	productId: string;
	name: string;
	category?: string;
	link?: string;
	variable?: {
		color: { label: string; code: string };
		size: string[];
		image: string[] | StaticImport[];
		quantity: number;
	}[];
	notVariable?: {
		color?: { label: string; code: string };
		size: string[];
		image: string[] | StaticImport[];
		quantity?: number;
	};
	smallDescription?: string;
	description?: string;
	price: { amount: number; currency: string };
	solde?: boolean;
	promotion?: {
		reduced_price: { amount: number; currency: string };
		pourcentage: number;
	};
	isLoading?: boolean;
	label?: string;
	slug?: string;
}
export function CardProduct({
	productId,
	name,
	className,
	smallDescription,
	price,
	children,
	promotion,
	solde,
	variable,
	notVariable,
	isLoading,
	link,
	...props
}: CardProps) {
	const [activeIndex, setActiveIndex] = useState(0);

	const router = useRouter();

	const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);

	const [drawerStates, setDrawerStates] = useState<DrawerStatesProps>(
		INITIAL_DRAWER_STATES,
	);

	// --- LOGIQUE D'AJOUT AU PANIER ---
	const addItemToCartMutation = useAddItemToCart();
	const [selectedSize, setSelectedSize] = useState<string>("");
	// --- FIN DE LA LOGIQUE ---

	const updateDrawerState = useCallback(
		(key: keyof DrawerStatesProps, value: SetStateAction<boolean>) => {
			setDrawerStates((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const [size, setSize] = useState<string[]>([]);

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

			if (variable && variable[activeIndex]) {
				setSize(variable[activeIndex].size as string[]);
			}

			if (notVariable) {
				setSize(notVariable.size as string[]);
			}
		},
		[activeIndex, notVariable, drawerStates.showSizes, variable, updateDrawerState],
	);

	// --- FONCTION handleSizeSelect (POUR L'AJOUT AU PANIER) ---
	const handleSizeSelect = (size: string) => {
		setSelectedSize(size);

		// **LA CORRECTION EST ICI**
		// 1. On type le payload pour qu'il corresponde à ce que la mutation attend.
		const variantsPayload: Record<string, string> = {
			size: size,
		};

		// 2. On ajoute 'color' seulement s'il existe.
		if (variable && variable[activeIndex]) {
			variantsPayload.color = variable[activeIndex].color.code;
		} else if (notVariable && notVariable.color) {
			variantsPayload.color = notVariable.color.code;
		}

		console.log("Ajout au panier (invité ou loggé):", {
			productId,
			quantity: 1,
			selectedVariants: variantsPayload,
		});

		addItemToCartMutation.mutate(
			{
				productId: productId,
				quantity: 1, // Quantité par défaut de 1 depuis la carte
				selectedVariants: variantsPayload, // <-- Cet objet est maintenant du bon type
			},
			{
				onSuccess: () => {
					console.log("Produit ajouté !");
					alert("Produit ajouté au panier !");
				},
				onError: (error: any) => {
					// Type 'any' pour l'erreur générique
					console.error("Erreur lors de l'ajout:", error);
					alert(
						`Erreur: ${error?.message || "Impossible d'ajouter au panier"}`,
					);
				},
			},
		);

		updateDrawerState("showSizes", false);
	};
	// console.log("🟢 CardProduct reçu:", { productId });

	// --- FIN DE LA FONCTION ---

	const handleVariantClick = ({
		e,
		index,
	}: {
		e: React.MouseEvent<HTMLButtonElement>;
		index: number;
	}) => {
		setActiveIndex(index);
		e.stopPropagation();
	};

	// Préchargement des images
	useEffect(() => {
		if (variable) {
			const loadImages = async () => {
				const loadPromises = variable.map((variant, index) => {
					return new Promise<boolean>((resolve) => {
						const img = new window.Image();
						img.onload = () => resolve(true);
						img.onerror = () => resolve(false);
						img.src =
							typeof variant.image[0] === "string" ? variant.image[0] : "src";
					});
				});

				const results = await Promise.all(loadPromises);
				setImagesLoaded(results);
			};

			loadImages();
		}
	}, [variable]);

	return (
		<article className={cn(cardVariants(), className)} {...props}>
			<div
				className="relative h-fit md:hover:[&>div]:opacity-100 "
				onClick={() => handleRoutes(link)}
			>
				{variable?.map((variant, i) => (
					<Image
						key={i}
						src={
							(variant.image[0] as string) ||
							"https://images.unsplash.com/photo-1761782797823-2b555af8a226?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974"
						}
						alt={`Product Image ${i + 1}`}
						width={400}
						height={400}
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
							i === activeIndex ? "opacity-100 " : "hidden opacity-0",
						)}
						priority={i === 0}
						placeholder="blur"
						blurDataURL={data_url}
						style={
							{
								"--aspect-ratio-hack": "149.70059880239518%",
							} as React.CSSProperties
						}
					/>
				))}
				{/* Fallback si pas de produit */}
				{!variable && notVariable?.image && (
					<Image
						src={
							(notVariable.image[0] as string) ||
							"https://images.unsplash.com/photo-1761782797823-2b555af8a226?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974"
						}
						alt="Product Image"
						width={400}
						height={400}
						className="object-cover w-full h-full transition-opacity duration-300 "
						priority
						placeholder="blur"
						blurDataURL={data_url}
						style={
							{
								"--aspect-ratio-hack": "149.70059880239518%",
							} as React.CSSProperties
						}
					/>
				)}

				{!drawerStates.showSizes && (
					<div className="absolute flex items-center justify-between w-full gap-8 px-4 transition-all duration-300 ease-in-out opacity-0 bottom-5 max-md:hidden md:flex">
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

				<DrawerCart
					size={size}
					handleClick={(e) => handleShowSizes(e)}
					close={() => updateDrawerState("showSizes", false)}
				/>
				{promotion && (
					<span className="fond-semibold bg-red-700 text-white !text-[0.8rem] lg:!text-[1.2rem] lg:!text-xs  absolute top-4 left-4 px-3 py-2 rounded-full">
						{promotion.pourcentage}% OFF
					</span>
				)}

				{(notVariable?.size || variable) &&
					(drawerStates.showSizes ? (
						<div className="absolute w-full px-4 bottom-5 bg-white border-2 border-gray-200 text-black text-center rounded-md text-sm font-light p-8 shadow-lg max-md:hidden md:block">
							<div className="flex items-center justify-between mb-6">
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
								size={size}
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
				<h4 className="tracking-[0.03em] !text-2xl  max-md:!text-[2rem]  md:!text-[2.2rem] truncate line-clamp-1">
					{" "}
					{name}
				</h4>

				{!promotion && (
					<h4 className="!text-2xl  max-md:!text-[2rem]  md:!text-[2.2rem]">
						{" "}
						{formatCurrency_FR(price.amount)}
					</h4>
				)}
				{promotion && (
					<>
						<div className="block text-end ">
							<h4 className="!text-2xl  max-md:!text-[2rem]  md:!text-[2.2rem] whitespace-nowrap">
								{" "}
								{promotion.reduced_price.amount || 0}{" "}
								{promotion.reduced_price.currency}
							</h4>
							<h4 className="text-grey/50 !text-2xl line-through max-md:!text-[2rem]  md:!text-[2.2rem]  whitespace-nowrap">
								{price.amount} {promotion.reduced_price.currency}
							</h4>
						</div>
					</>
				)}
			</div>

			<div className="flex items-center justify-start gap-2">
				{variable?.slice(0, 3)?.map((variant, i) => (
					<button
						key={i}
						className={cn(
							"h-fit w-fit p-[2px] border bg-white flex justify-center items-center rounded-full transition-all duration-200",
							i === activeIndex ? "border-black shadow-md" : "border-gray-300",
						)}
						onClick={(e) => handleVariantClick({ e, index: i })}
						disabled={drawerStates.showSizes}
					>
						<span
							className={cn("h-5 w-5 rounded-full cursor-pointer")}
							style={{ backgroundColor: variant.color.code }}
						></span>
					</button>
				))}

				{variable && variable.length > 3 && (
					<DrawerVariable
						label={`+ ${variable.length + 1 - 4}`}
						name={name}
						photos={variable?.map((v) => v.image[0]) as string[]}
						productData={{
							name,
							price: price,
							variable,
							notVariable,
							promotion,
							productId,
							description: smallDescription || "",
						}}
					/>
				)}
			</div>
		</article>
	);
}