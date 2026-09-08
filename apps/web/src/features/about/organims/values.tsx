import { VALUES } from "../data";

/**
 * Nos principes, numérotés.
 *
 * Le numéro est décoratif — le titre porte seul le sens, pour qu'un lecteur
 * d'écran ne s'entende pas annoncer « zéro un » avant chaque bloc.
 */
const Values = () => (
	<section className="mx-auto w-full max-w-[140rem] px-8 sm:px-20">
		<div className="mb-14 max-w-[52ch]">
			<span className="mb-6 block h-px w-16 bg-black" aria-hidden="true" />
			<h2 className="font-bebas-neue text-[4rem]! leading-[1.05] tracking-wide uppercase md:text-[5.5rem]!">
				Ce à quoi nous tenons
			</h2>
		</div>

		<div className="grid gap-x-16 gap-y-14 sm:grid-cols-2">
			{VALUES.map((value) => (
				<article key={value.number} className="border-t border-neutral-200 pt-8">
					<span
						aria-hidden="true"
						className="mb-5 block font-bebas-neue text-[2.6rem] leading-none tracking-widest text-neutral-400"
					>
						{value.number}
					</span>

					<h3 className="mb-4 text-[2.1rem]! font-medium leading-snug font-manrope md:text-[2.3rem]!">
						{value.title}
					</h3>

					<p className="text-[1.6rem] font-light leading-relaxed text-neutral-600 font-manrope">
						{value.description}
					</p>
				</article>
			))}
		</div>
	</section>
);

export default Values;
