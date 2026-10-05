"use client";

import { fetchProductsByCategory } from "@/lib/store-api";
import { COLLECTION_PATHS, PRODUCT_PATHS, paths } from "@/lib/routes/paths-en";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface NavChild {
	name: string;
	handle: string;
}

export interface PromoTile {
	title: string;
	subtitle: string;
	image: string;
	href: string;
}

interface NavMegaMenuProps {
	label: string;
	href: string;
	parentSlug?: string;
	subcategories: NavChild[];
	promoTiles: PromoTile[];
	onNavigate: () => void;
}

const LINK_CLASS =
	"block text-[1.5rem] text-(--color-ink) underline-offset-4 transition-colors hover:underline";

/**
 * Panneau pleine largeur sous la barre de catégories, calqué sur
 * naturium.com : deux colonnes de liens (sous-rayons, meilleures ventes du
 * rayon) puis deux visuels d'appel légendés.
 */
export const NavMegaMenu = ({
	label,
	href,
	parentSlug,
	subcategories,
	promoTiles,
	onNavigate,
}: NavMegaMenuProps) => {
	const t = useTranslations("Header.nav");

	const { data: bestSellers } = useQuery({
		queryKey: ["mega-menu-best-sellers", parentSlug],
		queryFn: () => fetchProductsByCategory(parentSlug!, { limit: 5 }),
		enabled: Boolean(parentSlug),
		staleTime: 10 * 60 * 1000,
	});

	const buildChildHref = (handle: string) => {
		const pathname = COLLECTION_PATHS.collectionDetail(handle);
		return parentSlug ? `${pathname}?division=${parentSlug}` : pathname;
	};

	return (
		<div className="border-b border-(--color-surface-border) bg-white shadow-[0_12px_24px_-16px_rgba(0,0,0,0.18)]">
			<div className="mx-auto flex max-w-[150rem] gap-16 px-10 py-12 xl:px-20">
				<div className="flex shrink-0 gap-16">
					<div className="w-[24rem]">
						<p className="mb-6 font-display text-[2rem] text-(--color-ink)">{t("shopAllHeading")}</p>
						<ul className="space-y-4">
							<li>
								<Link href={href} onClick={onNavigate} className={LINK_CLASS}>
									{t("shopAll", { name: label })}
								</Link>
							</li>
								{subcategories.map((child) => (
								<li key={child.handle}>
									<Link href={buildChildHref(child.handle)} onClick={onNavigate} className={LINK_CLASS}>
										{child.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className="w-[30rem]">
						<p className="mb-6 font-display text-[2rem] text-(--color-ink)">{t("bestSellersHeading")}</p>
						<ul className="space-y-4">
							<li>
								<Link href={paths.collections} onClick={onNavigate} className={LINK_CLASS}>
									{t("allBestSellers")}
								</Link>
							</li>
							{(bestSellers ?? []).map((product) => (
								<li key={product.id}>
									<Link href={PRODUCT_PATHS.productDetail(product.handle)} onClick={onNavigate} className={LINK_CLASS}>
										{product.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="ml-auto grid w-full max-w-[90rem] grid-cols-2 gap-10">
					{promoTiles.map((tile) => (
						<Link key={tile.href} href={tile.href} onClick={onNavigate} className="group block text-center">
							<div className="relative aspect-16/10 overflow-hidden bg-(--color-surface-card)">
								<Image
									src={tile.image}
									alt=""
									fill
									sizes="(max-width: 1536px) 30vw, 45rem"
									className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
									unoptimized
								/>
							</div>
							<p className="mt-6 font-display text-[2.2rem] text-(--color-ink)">{tile.title}</p>
							<p className="mt-2 text-[1.3rem] uppercase tracking-[0.08em] text-(--color-surface-muted)">
								{tile.subtitle}
							</p>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default NavMegaMenu;
