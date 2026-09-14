import Image from "next/image";
import { STORY } from "../data";

/**
 * Récit de la marque.
 *
 * Deux colonnes au-delà de 1024 px, empilées en dessous - l'image passe alors
 * en premier, parce qu'un mur de texte en ouverture d'écran mobile fait fuir.
 */
const Story = () => (
	<section className="mx-auto w-full max-w-[140rem] px-8 sm:px-20">
		<div className="grid items-center gap-14 sm:grid-cols-2 sm:gap-16 md:gap-24">
			<div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-neutral-100">
				<Image
					src={STORY.image}
					alt=""
					fill
					sizes="(min-width: 1024px) 45vw, 100vw"
					className="object-cover"
				/>
			</div>

			<div>
				<span className="mb-6 block h-px w-16 bg-black" aria-hidden="true" />

				<h2 className="font-bebas-neue text-[4rem]! leading-[1.05] tracking-wide uppercase md:text-[5.5rem]!">
					{STORY.title}
				</h2>

				<div className="mt-8 space-y-6">
					{STORY.paragraphs.map((paragraph) => (
						<p
							key={paragraph.slice(0, 32)}
							className="text-[1.7rem] font-light leading-relaxed text-neutral-700 font-manrope md:text-[1.8rem]"
						>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</div>
	</section>
);

export default Story;
