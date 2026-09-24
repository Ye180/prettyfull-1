"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { fetchProductByHandle } from "@/lib/store-api";
import { useRegionStore } from "@/stores/useRegion";
import { useWishlistStore } from "@prettyfull/store";
import { Skeleton } from "@prettyfull/ui";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import ProductFaq from "../components/organims/product-faq";
import { ProductGalleryNew } from "../components/organims/product-gallery-new";
import { ProductInfosNew } from "../components/organims/product-infos-new";
import ProductSuggestion from "../components/organims/product-suggestion";
import Reviews from "../components/organims/reviews";
import { useAddToCart } from "../hooks/use-add-to-cart";
import { useProductReviews } from "../hooks/use-product-reviews";
import { useProductVariants } from "../hooks/use-product-variants";

export default function ProductViews() {
	const params = useParams();
	const handle = params.handle as string;

	const { data: product, isLoading } = useQuery({
		queryKey: ["product-by-handle", handle],
		queryFn: () => fetchProductByHandle(handle),
		enabled: Boolean(handle),
	});

	const categorySlug = product?.collection?.handle;

	const {
		activeImage,
		setActiveImage,
		selectedColor,
		selectedSize,
		sizeOption,
		colorOption,
		colorVariants,
		availableSizes,
		currentImages,
		availableColors,
		colorSwatches,
		productPrice,
		handleColorChange,
		handleSizeChange,
	} = useProductVariants(product);

	const currencyCode = useRegionStore((state) => state.region?.currency_code);
	const currencyLabel = currencyCode === "xof" ? "FCFA" : "$";

	// Variante exacte (coloris × taille) affichée : même appariement que
	// `useAddToCart`, pour que le prix montré soit celui réellement commandé.
	const currentVariant = useMemo(() => {
		const groupVariants =
			colorVariants.find((cv) => cv.label === selectedColor)?.variants ??
			product?.variants ??
			[];
		if (!sizeOption) return groupVariants[0];
		return (
			groupVariants.find(
				(v) =>
					v.options?.find((o) => o.option_id === sizeOption.id)?.value ===
					selectedSize,
			) ?? groupVariants[0]
		);
	}, [colorVariants, selectedColor, sizeOption, selectedSize, product]);

	const { handleAddToCart } = useAddToCart(product, {
		colorOption,
		sizeOption,
		selectedColor,
		selectedSize,
		currentImages,
		currencyCode,
	});

	const { summary } = useProductReviews(product?.id);

	const isWishlisted = useWishlistStore(
		(state) => !!product && state.items.some((i) => i.productId === product.id),
	);
	const toggleWishlistItem = useWishlistStore((state) => state.toggleItem);
	const handleAddToWishlist = () => {
		if (!product) return;
		toggleWishlistItem({
			productId: product.id,
			product: {
				id: product.id,
				name: product.title,
				image: currentImages?.[0],
				price: {
					amount:
						currentVariant?.calculated_price.calculated_amount ?? productPrice,
					currency: currencyCode ?? "usd",
				},
			},
		});
	};

	if (isLoading) {
		return (
			<div className="px-4 py-12 mx-auto space-y-6 max-w-400 sm:px-6 lg:px-8">
				<div className="flex flex-col gap-8 md:flex-row md:gap-10">
					<Skeleton className="w-full rounded-3xl md:flex-1 md:max-w-220 aspect-4/5" />
					<Skeleton className="w-full rounded-2xl md:w-100 h-140" />
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="flex flex-col items-center px-4 py-24 mx-auto text-center max-w-400 sm:px-6 lg:px-8">
				<div className="flex justify-center items-center mb-6 w-16 h-16 bg-gray-100 rounded-full">
					<svg
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						className="text-gray-400"
					>
						<circle cx="11" cy="11" r="7" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
						<line x1="8" y1="11" x2="14" y2="11" />
					</svg>
				</div>
				<span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
					Produit introuvable
				</span>
				<h1 className="mt-3 text-2xl font-bold text-gray-900 sm:text-3xl">
					Ce produit n&apos;existe pas ou n&apos;est plus disponible
				</h1>
				<p className="mt-2 max-w-md text-gray-500">
					Il a peut-être été retiré du catalogue ou l&apos;adresse a changé.
				</p>
				<Link
					href="/collections"
					className="mt-8 inline-flex items-center gap-3 px-8 py-3.5 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition shadow-lg group text-sm sm:text-base"
				>
					<span>Retour à la boutique</span>
					<ArrowRightIcon className="w-4 h-4 text-white transition-transform group-hover:translate-x-1" />
				</Link>
			</div>
		);
	}

	return (
		<div className="px-4 py-8 mx-auto max-w-400 sm:px-6 lg:px-8">
			<div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
				<ProductGalleryNew
					className="md:flex-1 md:max-w-220"
					images={currentImages}
					title={product.title}
					activeImage={activeImage}
					setActiveImage={setActiveImage}
				/>
				<ProductInfosNew
					productName={product.title}
					productCategory={product.collection?.title ?? ""}
					price={
						currentVariant?.calculated_price.calculated_amount ?? productPrice
					}
					originalPrice={currentVariant?.calculated_price.original_amount}
					colors={availableColors}
					colorSwatches={colorSwatches}
					sizes={availableSizes}
					selectedColor={selectedColor}
					selectedSize={selectedSize}
					onColorChange={handleColorChange}
					onSizeChange={handleSizeChange}
					onAddToCart={handleAddToCart}
					onAddToWishlist={handleAddToWishlist}
					isWishlisted={isWishlisted}
					description={product.description}
					disabled={availableSizes.length > 0 && !selectedSize}
					rating={summary.average}
					reviewCount={summary.count}
					currency={currencyLabel}
				/>
			</div>

			<Reviews productId={product.id} />
			<ProductSuggestion
				categorySlug={categorySlug}
				excludeProductId={product.id}
			/>
			<ProductFaq />
		</div>
	);
}
