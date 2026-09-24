import Image from "next/image";
import { HERO } from "../data";

/**
 * Ouverture de la page.
 *
 * Le titre est posé sur l'image plutôt qu'en dessous : c'est ce qui donne son
 * ton éditorial à la page. Le dégradé - et non un voile uniforme - préserve la
 * lisibilité du texte sans éteindre la photo.
 */
const Hero = () => (
	<section className="relative w-full overflow-hidden bg-black">
		<div className="relative h-[62vh] min-h-[42rem] w-full md:h-[74vh]">
			<Image
				src={HERO.image}
				alt=""
				fill
				priority
				sizes="100vw"
				className="object-cover object-center opacity-80"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />

			<div className="absolute inset-x-0 bottom-0 px-8 pb-16 sm:px-20 md:pb-24">
				<div className="mx-auto max-w-[140rem]">
					<p className="mb-5 text-[1.3rem] font-medium uppercase tracking-[0.35em] text-white/70 font-manrope">
						{HERO.eyebrow}
					</p>

					<h1 className="max-w-[22ch] font-bebas-neue text-[5.5rem]! leading-[0.95] tracking-wide text-white uppercase md:text-[9rem]!">
						{HERO.title}
					</h1>

					<p className="mt-8 max-w-[62ch] text-[1.7rem] font-light leading-relaxed text-white/85 font-manrope md:text-[1.9rem]">
						{HERO.lead}
					</p>
				</div>
			</div>
		</div>
	</section>
);

export default Hero;
