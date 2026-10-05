import { paths } from "@/lib/routes/paths-en";
import { redirect } from "next/navigation";

// Ancienne URL : la liste de souhaits vit désormais dans l'espace compte.
export default function Page() {
	redirect(paths.wishlist);
}
