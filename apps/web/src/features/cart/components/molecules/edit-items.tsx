"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";
import { useRemoveCartItem } from "../../api/backend/remove-item-from-cart";
interface Props {
	productId: string;
}

export const EditItems = ({ productId }: Props) => {
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const removeMutation = useRemoveCartItem();

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

		console.log("Add to wishlist", productId);
	};

	return (
		<div className="flex gap-3 items-center">
			<button
				onClick={handleWishlist}
				disabled={false}
				className="flex gap-2 items-center px-2 py-1 text-sm text-gray-600 rounded-md transition hover:text-black"
			>
				<Heart className="w-5 h-5" />
			</button>
			<button
				onClick={handleRemove}
				disabled={removeMutation.isPending}
				className="flex gap-2 items-center px-2 py-1 text-sm text-gray-600 rounded-md transition hover:text-red-600"
			>
				<TrashIcon className="w-5 h-5" />
				{removeMutation.isPending ? "..." : ""}
			</button>
		</div>
	);
};
