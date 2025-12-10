"use client";

// Imports React/Next
import { useRouter } from "next/navigation";
import { useState } from "react";

// Import du type TProduct
import { TProduct } from "../../types";

// Imports des hooks
import { useAddItemToCart } from "@/features/cart/api/backend/add-item-to-cart";
import { useCreateWishlist } from "@/features/wishlist/api/create-wishlist";
import { useAuth } from "@/hooks/useAuth";

// Imports des composants UI et Icônes
import { Button } from "@prettyfull/ui";

// Imports des composants locaux
import { Cart } from "@/components/icons/cart.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { ProductOptions } from "../molecules/product-options";
import { NotifyMeModal } from "./notify-me";
import Reviews from "./reviews";

// --- SUPPRIMÉ ---
// Le type SelectedVariant n'est pas fourni par product-options.tsx
/*
type SelectedVariant = {
  size: string;
  color: { name: string; code: string };
  image: string;
  inStock: boolean;
} | null;
*/

export const ProductsInfos = ({ product }: { product: TProduct }) => {
	const [quantity, setQuantity] = useState(1);
	const router = useRouter();
	const { isAuthenticated } = useAuth(); // Hook d'authentification

	// Nos hooks de mutation
	const addItemToCartMutation = useAddItemToCart();
	const addToWishlistMutation = useCreateWishlist();

	// États pour le modal et le stock
	const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

	// --- CORRECTIONS ÉTAT ---
	// Remplacer l'ancien état 'selectedVariant'
	const [selectedSize, setSelectedSize] = useState<string>("");
	const [selectedColor, setSelectedColor] = useState<string>("");

	// NOTE: La logique de stock est simpliste.
	// product-options.tsx devrait être mis à jour pour
	// remonter si la VARIANTE (taille+couleur) est en stock.
	// Pour l'instant, on se base sur le stock général du produit.
	const [isVariantInStock, setIsVariantInStock] = useState(product.stock > 0);

	const handleAddToCart = () => {
		// 1. Vérifier la connexion
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		// 2. Vérifier le produit
		if (!product?._id) {
			console.error("ID de produit manquant");
			return;
		}

		// 3. Vérifier le stock
		if (!isVariantInStock) {
			// Pas en stock -> ouvrir le modal
			setIsNotifyModalOpen(true);
			return;
		}

		// --- CORRECTION PAYLOAD ---
		// 4. Construire l'objet des variantes pour le backend
		const variantsPayload: Record<string, string> = {};
		if (selectedSize) {
			variantsPayload.size = selectedSize; // Assurez-vous que 'size' est la clé attendue
		}
		if (selectedColor) {
			variantsPayload.color = selectedColor; // Assurez-vous que 'color' est la clé attendue
		}

		// 5. Si tout est OK, appeler la mutation avec les variantes
		addItemToCartMutation.mutate(
			{
				productId: product._id,
				quantity: quantity,
				selectedVariants: variantsPayload, // <-- ENVOYER LES VARIANTES
			},
			{
				onSuccess: () => {
					console.log("Produit ajouté au panier via API !");
					alert("Produit ajouté au panier !");
				},
				onError: (error) => {
					console.error("Erreur lors de l'ajout au panier:", error);
					alert(`Erreur: ${error.message || "Impossible d'ajouter au panier"}`);
				},
			}
		);
	};

	// Logique pour la Wishlist
	const handleAddToWishlist = () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}
		if (!product?._id) {
			console.error("ID de produit manquant");
			return;
		}

		addToWishlistMutation.mutate(product._id, {
			onSuccess: () => {
				console.log("Produit ajouté à la wishlist !");
				alert("Produit ajouté à la wishlist !");
			},
			onError: (error) => {
				console.error("Erreur lors de l'ajout à la wishlist:", error);
				alert(
					`Erreur: ${error.message || "Impossible d'ajouter à la wishlist"}`
				);
			},
		});
	};

	// --- CORRECTIONS CALLBACKS ---
	// Remplacer handleVariantChange

	const handleSizeChange = (size: string) => {
		setSelectedSize(size);
		// TODO: Vous devriez avoir une logique ici pour vérifier
		// le stock de la combinaison (size, selectedColor)
		// et mettre à jour 'setIsVariantInStock'.
	};

	const handleColorChange = (colorCode: string) => {
		setSelectedColor(colorCode);
		// TODO: Idem, vérifier le stock pour (selectedSize, colorCode)
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-semibold">
					{typeof product.name === "string"
						? product.name
						: ((product.name as any)?.fr ?? "")}
				</h1>

				<p className="text-sm font-medium">{product.price.amount} FCFA</p>
			</div>

			<div className="w-full h-px bg-gray-200" />

			{/* TODO: Ajouter un sélecteur de quantité ici, car il n'est pas dans ProductOptions */}
			{/* Exemple : <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /> */}

			{/* --- CORRECTION PROPS --- */}
			{/* Passer les bons props à ProductOptions */}
			<ProductOptions
				variable={
					product.options?.sizes || product.options?.colors
						? [
								{
									color: product.options?.colors?.[0]
										? {
												label: product.options.colors[0].name,
												code: product.options.colors[0].code,
											}
										: { label: "", code: "" },
									size: product.options?.sizes || [],
									image: product.images || [],
									quantity: 1,
								},
							]
						: []
				}
				sizes={product.options?.sizes || []}
				selectedSize={selectedSize}
				onSizeChange={handleSizeChange}
				selectedColor={selectedColor}
				onColorChange={handleColorChange}
				classButton="my-4"
				className="w-full"
			/>

			<div className="flex flex-col gap-4">
				{/* Le bouton principal change de texte selon le stock */}
				<Button
					className="w-full"
					onClick={handleAddToCart}
					disabled={addItemToCartMutation.isPending}
				>
					<Cart />
					{addItemToCartMutation.isPending
						? "Ajout en cours..."
						: isVariantInStock
							? "Ajouter au panier"
							: "Me notifier"}
				</Button>

				<Button
					variant={"secondary"}
					className="w-full"
					onClick={handleAddToWishlist}
					disabled={addToWishlistMutation.isPending}
				>
					<Heart />
					{addToWishlistMutation.isPending
						? "Ajout..."
						: "Ajouter à la Wishlist"}
				</Button>
			</div>

			{/* Le modal est prêt à être utilisé */}

			<NotifyMeModal
				isOpen={isNotifyModalOpen}
				onClose={() => setIsNotifyModalOpen(false)}
				product={product}
				variant={{
					size: selectedSize,
					color: { name: selectedColor, code: selectedColor },
					image: product.images?.[0] || "",
				}}
			/>

			<div className="w-full h-px bg-gray-200" />

			<Reviews />
		</div>
	);
};
