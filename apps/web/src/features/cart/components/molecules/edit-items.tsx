"use client";

import { useCreateWishlist } from "@/features/wishlist/api/create-wishlist";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { useRemoveCartItem } from "../../api/remove-item-from-cart";
interface Props {
	productId: string;
}

export const EditItems = ({ productId }: Props) => {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const removeMutation = useRemoveCartItem();
	const wishlistMutation = useCreateWishlist();

	const handleRemove = () => {
		if (window.confirm("Supprimer cet article du panier ?")) {
			removeMutation.mutate({ productId });
		}
	};

	const handleWishlist = () => {
		if (!isAuthenticated) {
			router.push("/login");
			return;
		}

		wishlistMutation.mutate(productId, {
			onSuccess: () => {
				alert("Ajouté à la wishlist !");
			},
			onError: (error) => {
				alert(`Erreur: ${error.message || "Impossible d'ajouter"}`);
			},
		});
	};

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={handleWishlist}
				disabled={wishlistMutation.isPending}
				className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 transition rounded-md hover:text-black"
			>
				<Heart className="w-5 h-5" />
			</button>
			<button
				onClick={handleRemove}
				disabled={removeMutation.isPending}
				className="flex items-center gap-2 px-2 py-1 text-sm text-gray-600 transition rounded-md hover:text-red-600"
			>
				<TrashIcon className="w-5 h-5" />
				{removeMutation.isPending ? "..." : ""}
			</button>
		</div>
	);
};
