"use client";

import { useGetPrimaryCategories } from "@/features/homepage/api/medusa/get-primary-categories";
import type { StoreCategory } from "@/lib/store-api/types";
import { useTranslations } from "next-intl";
import { useState } from "react";
import NavBarHeaders from "../molecules/header/navbar";

const ANNOUNCEMENT_KEYS = ["shipping", "labTested", "guarantee"] as const;

const Chevron = ({ direction }: { direction: "left" | "right" }) => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
		<path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
	</svg>
);

const Header = ({ main_category }: { main_category?: StoreCategory[] }) => {
	const t = useTranslations("Header.announcement");
	const { data: fallbackCategories } = useGetPrimaryCategories();
	const [index, setIndex] = useState(0);

	const categories = main_category || fallbackCategories || [];
	const step = (delta: number) =>
		setIndex((current) => (current + delta + ANNOUNCEMENT_KEYS.length) % ANNOUNCEMENT_KEYS.length);

	return (
		<header className="sticky top-0 z-40">
			<div className="bg-white">
				<div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
					<button type="button" onClick={() => step(-1)} aria-label={t("previous")} className="p-1 text-(--color-surface-muted) hover:text-black cursor-pointer">
						<Chevron direction="left" />
					</button>
					<p className="text-center text-[1.2rem] font-semibold uppercase tracking-[0.12em] text-(--color-ink) sm:text-[1.3rem]">
						{t(ANNOUNCEMENT_KEYS[index]!)}
					</p>
					<button type="button" onClick={() => step(1)} aria-label={t("next")} className="p-1 text-(--color-surface-muted) hover:text-black cursor-pointer">
						<Chevron direction="right" />
					</button>
				</div>
			</div>
			<NavBarHeaders main_category={categories} />
		</header>
	);
};

export default Header;
