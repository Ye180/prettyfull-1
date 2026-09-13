"use client";

import { type FC, useEffect, useRef } from "react";
import DescriptionFooter from "../molecules/footer/label";
import LinksFooter from "../molecules/footer/links";
import Link from "next/link";
import { paths } from "@/lib/routes/paths-en";

export interface FooterProps {
	// ponytail: sticky-reveal footer needs its real height so HomeLayout can
	// pad the content column above it — reported via ResizeObserver instead of
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
			className="overflow-hidden px-4 pt-24 text-white bg-black w-full fixed inset-x-0 bottom-0 z-0"
		>
			<div className="max-w-[150rem] mx-auto w-full lg:px-8">
				<div className="grid grid-cols-1 gap-16 lg:grid-cols-5 lg:gap-12">
					<DescriptionFooter />
					<LinksFooter />
				</div>

				<div className="flex flex-col gap-4 justify-between items-center pt-8 mt-16 text-[1.3rem] border-t border-white/10 text-white/50 sm:flex-row">
					<span>Copyright © Prettyfull 2026</span>
					<div className="flex gap-6">
						<Link href={paths.terms} className="cursor-pointer hover:text-white transition-colors">
							Privacy Policy
						</Link>
						<Link href={paths.terms} className="cursor-pointer hover:text-white transition-colors">
							Terms Of Use
						</Link>
					</div>
				</div>
			</div>

			{/* Wordmark géant plein-largeur PRETTYFULL — reveal comes from the
			 * fixed-footer scroll trick above (see HomeLayout), no extra animation
			 * needed here since the footer is always mounted behind the page. */}
			<div className="w-full pt-8 -mb-4 leading-none text-center select-none overflow-hidden">
				<span className="font-bold tracking-tight text-[18vw] text-white/95 uppercase leading-none block font-sans">
					PRETTYFULL
				</span>
			</div>
		</footer>
	);
};

export default Footer;
