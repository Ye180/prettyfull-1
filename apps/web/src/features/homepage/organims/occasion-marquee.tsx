"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

interface MarqueeRow {
	items: string[];
	bg: string;
	text: string;
	rotate: string;
	duration: string;
	direction: "left" | "right";
}

const ROWS: MarqueeRow[] = [
	{
		items: [
			"IPHONE NEUF & SCELLÉ",
			"IPHONE SECONDE MAIN",
			"ORDINATEURS",
			"PARFUMS",
			"MADE IN USA",
			"CADEAUX",
		],
		bg: "bg-stone-900",
		text: "text-stone-100",
		rotate: "-rotate-2",
		duration: "28s",
		direction: "left",
	},
	{
		items: [
			"SOINS DU VISAGE",
			"SOINS DU CORPS",
			"SÉRUMS",
			"RAW HAIR",
			"DENTIFRICES",
			"BLANCHIMENT",
		],
		bg: "bg-stone-200",
		text: "text-stone-900",
		rotate: "rotate-1",
		duration: "34s",
		direction: "right",
	},
	{
		items: [
			"LULULEMON",
			"ALO",
			"SACS COACH",
			"VALISES DE VOYAGE",
			"ÉPICES AMÉRICAINES",
			"BISCUITS AMÉRICAINS",
		],
		bg: "bg-[#080808]",
		text: "text-stone-500",
		rotate: "-rotate-1",
		duration: "31s",
		direction: "left",
	},
];

const Item = ({ text, colorClass }: { text: string; colorClass: string }) => (
	<span
		className={`shrink-0 whitespace-nowrap px-4 sm:px-6 text-[1.8rem] sm:text-[2.4rem] lg:text-[2.8rem] font-black uppercase tracking-tight [font-family:var(--font-display)]! ${colorClass}`}
	>
		{text}
	</span>
);

/**
 * Bandeau des rayons - trois pistes de texte en
 * défilement continu, inclinées et débordant du conteneur, dans la lignée
 * des bandeaux de marque type "A ring for every thing". Le rendu statique
 * (sans défilement, une seule copie centrée) sert de repli sous
 * `prefers-reduced-motion`.
 */
export const OccasionMarquee = () => {
	const reducedMotion = useReducedMotion();

	return (
		<section className="overflow-x-hidden py-16 sm:py-24 bg-stone-50">
			<h2 className="px-4 mx-auto max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-center text-[#080808] [font-family:var(--font-display)]!">
				Un article pour chaque envie.
			</h2>

			<div className="flex flex-col gap-3 mt-10 sm:gap-5 sm:mt-14">
				{ROWS.map((row) => {
					const trackStyle: CSSProperties | undefined = reducedMotion
						? undefined
						: {
								animation: `marquee-${row.direction} ${row.duration} linear infinite`,
							};

					return (
						<div
							key={row.bg}
							className={`relative w-[130%] ml-[-15%] overflow-hidden py-3 sm:py-5 shadow-sm ${row.bg} ${row.rotate}`}
						>
							{reducedMotion ? (
								<div className="flex justify-center items-center">
									{row.items.map((item) => (
										<Item key={item} text={item} colorClass={row.text} />
									))}
								</div>
							) : (
								<div
									className="flex w-max hover:[animation-play-state:paused]"
									style={trackStyle}
								>
									{[0, 1].map((copy) => (
										<div key={copy} className="flex items-center">
											{row.items.map((item) => (
												<Item
													key={`${copy}-${item}`}
													text={item}
													colorClass={row.text}
												/>
											))}
										</div>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default OccasionMarquee;
