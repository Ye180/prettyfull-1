"use client";

import { ArrowRightIcon } from "@/components/icons/arrow-icon";
import { useDisplayCurrency } from "@/hooks/use-display-currency";
import { paths } from "@/lib/routes/paths-en";
import type { CurrencyCode } from "@prettyfull/contracts";
import { useWishlistStore } from "@prettyfull/store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

const ItemLink = ({
	href,
	className,
	children,
}: {
	href?: string;
	className: string;
	children: React.ReactNode;
}) =>
	href ? (
		<Link href={href} className={className}>
			{children}
		</Link>
	) : (
		<div className={className}>{children}</div>
	);

/** Liste de souhaits - rendue dans l'espace compte (barre latérale fournie par le layout). */
const WishlistView = () => {
	const t = useTranslations("Wishlist");
	const items = useWishlistStore((state) => state.items);
	const removeItem = useWishlistStore((state) => state.removeItem);
	const { format } = useDisplayCurrency();

	return (
		<div className="space-y-8">
			<div>
				<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
					{t("pageTitle")}{" "}
					<span className="font-normal text-(--color-surface-muted)">
						({items.length})
					</span>
				</h2>
				<p className="mt-1 text-gray-500">{t("pageSubtitle")}</p>
			</div>

			{items.length > 0 ? (
				<ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
					{items.map((item) => {
						// Anciens favoris enregistrés sans slug : pas de lien plutôt qu'une 404.
						const href = item.product.handle
							? `${paths.products}/${item.product.handle}`
							: undefined;
						return (
							<li key={item.productId} className="flex flex-col group">
								<ItemLink
									href={href}
									className="block overflow-hidden relative w-full aspect-4/5 bg-(--color-surface-card)"
								>
									<Image
										src={
											item.product.image || "/products/shop/hero-shopping.jpg"
										}
										alt={item.product.name}
										fill
										sizes="(max-width: 1024px) 50vw, 25vw"
										className="object-cover transition-transform duration-500 group-hover:scale-105"
										unoptimized
									/>
								</ItemLink>

								<div className="flex flex-col flex-1 gap-1 pt-4">
									<ItemLink
										href={href}
										className="text-[1.5rem] font-medium leading-snug line-clamp-2 text-(--color-ink) hover:underline underline-offset-4"
									>
										{item.product.name}
									</ItemLink>
									{item.product.price && (
										<span className="text-[1.5rem] font-semibold text-(--color-ink)">
											{format(
												item.product.price.amount,
												item.product.price.currency as CurrencyCode,
											)}
										</span>
									)}
									<button
										type="button"
										onClick={() => removeItem(item.productId)}
										aria-label={t("removeAria", { name: item.product.name })}
										className="self-start mt-2 text-[1.3rem] underline underline-offset-4 transition-colors cursor-pointer text-(--color-surface-muted) hover:text-(--color-ink)"
									>
										{t("remove")}
									</button>
								</div>
							</li>
						);
					})}
				</ul>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
					<h3 className="text-[2.2rem]! [font-family:var(--font-display)]!">
						{t("emptyTitle")}
					</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-[1.4rem] text-gray-500">
						{t("emptyDescription")}
					</p>
					<Link
						href={paths.collections}
						className="inline-flex gap-2 justify-center items-center px-8 py-3.5 text-[1.3rem] font-semibold tracking-[0.08em] text-white uppercase transition-colors bg-(--color-ink) hover:bg-black"
					>
						{t("exploreCollections")}
						<ArrowRightIcon className="w-4 h-4" />
					</Link>
				</div>
			)}
		</div>
	);
};

export default WishlistView;
