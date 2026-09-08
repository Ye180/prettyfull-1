import Image from "next/image";
import { GALLERY } from "../data";

/**
 * Bande éditoriale.
 *
 * Deux colonnes au mobile, quatre au-delà : une grille à une colonne
 * transformerait la section en interminable défilement d'images.
 */
const Gallery = () => (
	<section className="mx-auto w-full max-w-[160rem] px-4 sm:px-8">
		<div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
			{GALLERY.map((item) => (
				<div
					key={item.src}
					className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-100"
				>
					<Image
						src={item.src}
						alt={item.alt}
						fill
						sizes="(min-width: 768px) 25vw, 50vw"
						className="object-cover transition-transform duration-700 hover:scale-105"
					/>
				</div>
			))}
		</div>
	</section>
);

export default Gallery;
