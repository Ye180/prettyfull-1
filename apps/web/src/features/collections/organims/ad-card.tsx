import { cn } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";

interface AdCardProps {
	image: string;
	imageAlt?: string;
	className?: string;
}

/**
 * Carte éditoriale intercalée dans le grid collection (masonry) — image
 * pleine largeur + légende "See Product ↗ · Ad", pas de produit réel
 * derrière (juste une réutilisation d'un visuel lifestyle existant).
 */
const AdCard = ({ image, imageAlt = "", className }: AdCardProps) => {
	return (
		<article className={cn("pb-4 space-y-3 w-full", className)}>
			<div className="overflow-hidden relative bg-gray-50">
				<div className="relative w-full aspect-4/3">
					<Image
						src={image}
						alt={imageAlt}
						fill
						sizes="(max-width: 1024px) 100vw, 66vw"
						className="object-cover"
						unoptimized
					/>
				</div>
			</div>
			<Link href="#" className="inline-flex gap-1.5 items-center text-sm text-gray-500 hover:text-black">
				See Product <span aria-hidden>↗</span>
				<span className="text-gray-300">·</span>
				Ad
			</Link>
		</article>
	);
};

export default AdCard;
