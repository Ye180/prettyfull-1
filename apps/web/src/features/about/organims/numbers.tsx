import { NUMBERS } from "../data";

/**
 * Bandeau de chiffres clés.
 *
 * Fond noir : c'est la seule respiration sombre de la page, elle sépare le
 * récit des engagements sans avoir besoin d'un titre de section.
 */
const Numbers = () => (
	<section className="w-full bg-black py-20 text-white md:py-28">
		<div className="mx-auto w-full max-w-[140rem] px-8 sm:px-20">
			<dl className="grid grid-cols-2 gap-x-10 gap-y-14 sm:grid-cols-4">
				{NUMBERS.map((item) => (
					<div key={item.label}>
						<dt className="sr-only">{item.label}</dt>
						<dd>
							<span className="block font-bebas-neue text-[5rem] leading-none tracking-wide md:text-[6.5rem]">
								{item.value}
							</span>
							<span className="mt-3 block text-[1.4rem] font-light uppercase tracking-[0.18em] text-white/60 font-manrope">
								{item.label}
							</span>
						</dd>
					</div>
				))}
			</dl>
		</div>
	</section>
);

export default Numbers;
