import Link from "next/link";
import { paths } from "@/lib/routes/paths-en";
import { COMMITMENTS } from "../data";

/** Engagements concrets, suivis de l'appel à l'action de fin de page. */
const Commitments = () => (
	<section className="mx-auto w-full max-w-[140rem] px-8 sm:px-20">
		<div className="rounded-3xl bg-neutral-50 px-8 py-16 sm:px-16 md:py-20">
			<div className="mb-14 max-w-[52ch]">
				<span className="mb-6 block h-px w-16 bg-black" aria-hidden="true" />
				<h2 className="font-bebas-neue text-[4rem]! leading-[1.05] tracking-wide uppercase md:text-[5.5rem]!">
					Nos engagements
				</h2>
			</div>

			<div className="grid gap-12 md:grid-cols-3 md:gap-10">
				{COMMITMENTS.map((commitment) => (
					<article key={commitment.title}>
						<h3 className="mb-4 text-[2rem]! font-medium leading-snug font-manrope">
							{commitment.title}
						</h3>
						<p className="text-[1.6rem] font-light leading-relaxed text-neutral-600 font-manrope">
							{commitment.description}
						</p>
					</article>
				))}
			</div>

			<div className="mt-16 flex flex-col gap-4 border-t border-neutral-200 pt-12 sm:flex-row sm:items-center sm:justify-between">
				<p className="text-[1.8rem] font-light font-manrope md:text-[2rem]">
					Une question avant de commander&nbsp;?
				</p>

				<div className="flex flex-wrap gap-4">
					<Link
						href={paths.products}
						className="inline-flex items-center rounded-full bg-black px-10 py-5 text-[1.5rem] font-medium text-white transition-colors hover:bg-neutral-800 font-manrope"
					>
						Voir la boutique
					</Link>
					<Link
						href={paths.contact}
						className="inline-flex items-center rounded-full border border-black px-10 py-5 text-[1.5rem] font-medium transition-colors hover:bg-black hover:text-white font-manrope"
					>
						Nous écrire
					</Link>
				</div>
			</div>
		</div>
	</section>
);

export default Commitments;
