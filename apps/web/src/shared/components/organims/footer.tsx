"use client";

import { paths } from "@/lib/routes/paths-en";
import Link from "next/link";
import { useEffect, useRef, type FC } from "react";
import DescriptionFooter from "../molecules/footer/label";
import LinksFooter from "../molecules/footer/links";

export interface FooterProps {
	// ponytail: sticky-reveal footer needs its real height so HomeLayout can
	// pad the content column above it - reported via ResizeObserver instead of
	// a hardcoded number since the giant wordmark scales with viewport width.
	onHeightChange?: (height: number) => void;
}

const Footer: FC<FooterProps> = ({ onHeightChange }) => {
	const rootRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const el = rootRef.current;
		if (!el || !onHeightChange) return;
		const observer = new ResizeObserver(([entry]) => {
			if (entry) onHeightChange(entry.contentRect.height);
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [onHeightChange]);

	return (
		<footer
			ref={rootRef}
			className="overflow-hidden fixed inset-x-0 bottom-0 z-0 px-4 w-full text-white bg-black pt-54"
		>
			<div className="max-w-[150rem] mx-auto w-full lg:px-8">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
					<DescriptionFooter />
					<LinksFooter />
				</div>

				<div className="flex flex-col gap-4 justify-between items-center pt-8 mt-16 text-[1.3rem] border-t border-white/10 text-white/50 sm:flex-row">
					<span>© Prettyfull 2026 - Tous droits réservés</span>
					<div className="flex gap-6">
						<Link
							href={paths.terms}
							className="transition-colors cursor-pointer hover:text-white"
						>
							Conditions générales de vente
						</Link>
						<Link
							href={paths.shippingReturn}
							className="transition-colors cursor-pointer hover:text-white"
						>
							Livraison &amp; retours
						</Link>
					</div>
				</div>
			</div>

			{/* Wordmark géant plein-largeur PRETTYFULL - reveal comes from the
			 * fixed-footer scroll trick above (see HomeLayout), no extra animation
			 * needed here since the footer is always mounted behind the page. */}
			<div className="overflow-hidden pt-8 -mb-4 w-full leading-none text-center select-none">
				<span className="font-bold tracking-tight text-[18vw] text-white/95 uppercase leading-none block font-sans">
					PRETTYFULL
				</span>
			</div>
		</footer>
	);
};

export default Footer;
