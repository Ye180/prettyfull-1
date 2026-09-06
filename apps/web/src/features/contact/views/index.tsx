import Image from "next/image";
import Content from "../organims/content";

/**
 * Page « Contact ».
 *
 * Ouverture plus sobre que celle de la page « À propos » : on vient ici pour
 * agir, pas pour lire une histoire de marque.
 */
const ContactViews = () => (
	<div className="pb-28">
		<section className="relative w-full overflow-hidden bg-black">
			<div className="relative h-[38vh] min-h-[28rem] w-full md:h-[44vh]">
				<Image
					src="/home/cover-desktop.jpg"
					alt=""
					fill
					priority
					sizes="100vw"
					// Point focal remonté : un cadrage centré sur cette bande basse
					// coupe les visages en deux.
					className="object-cover object-[center_22%] opacity-65"
				/>

				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

				<div className="absolute inset-x-0 bottom-0 px-8 pb-12 sm:px-20 md:pb-16">
					<div className="mx-auto max-w-[140rem]">
						<p className="mb-4 text-[1.3rem] font-medium uppercase tracking-[0.35em] text-white/70 font-manrope">
							Service client
						</p>
						<h1 className="font-bebas-neue text-[5rem]! leading-[0.95] tracking-wide text-white uppercase md:text-[7.5rem]!">
							Contact
						</h1>
					</div>
				</div>
			</div>
		</section>

		<div className="pt-20 md:pt-28">
			<Content />
		</div>
	</div>
);

export default ContactViews;
