"use client";

import CartSummary from "@/features/cart/components/molecules/cart-summary";
import CartItems from "@/features/cart/components/organims/cart-items";
import { useCartTotals } from "@/features/cart/hooks/use-cart-totals";
import { useRegionStore } from "@/stores/useRegion";
import type { CartItem } from "@prettyfull/store";
import { cn } from "@prettyfull/utils";
import { ReactNode } from "react";

interface CartContentProps {
	items: CartItem[];
	/**
	 * "page" renders the two-column layout used on /cart (items + sticky
	 * summary side by side, md: breakpoint). "drawer" (default) renders the
	 * same idea but tuned for the bottom-sheet cart drawer: short and wide
	 * rather than tall and narrow, so the 2-column split kicks in earlier
	 * (sm:) and each column scrolls independently within the sheet's fixed
	 * height. Falls back to a stacked single column on narrow phones.
	 */
	layout?: "page" | "drawer";
	/** Extra content rendered under the item list — only used by the "page" layout. */
	itemsFooter?: ReactNode;
	/**
	 * Page-level row selection (checkboxes) — UI-only, not part of the cart
	 * store. Omit both props to render rows without checkboxes (drawer).
	 */
	selectedIds?: Set<string>;
	onToggleItem?: (productId: string) => void;
}

const CartContent = ({
	items,
	layout = "drawer",
	itemsFooter,
	selectedIds,
	onToggleItem,
}: CartContentProps) => {
	const regions = useRegionStore((state) => state.region);
	const totals = useCartTotals(items);
	const currency = regions?.currency_code === "xof" ? "FCFA" : "$";
	const isPage = layout === "page";
	const isDrawer = layout === "drawer";
	// ponytail: squared corners are scoped to the drawer via this flag instead
	// of a global CSS override — keeps /cart page's rounded styling untouched.
	const square = isDrawer;

	return (
		<div
			className={cn(
				isPage && "grid grid-cols-1 gap-x-20 md:grid-cols-12",
				isDrawer &&
					"flex flex-col gap-6 sm:grid sm:grid-cols-12 sm:gap-6 sm:h-full sm:min-h-0",
			)}
		>
			<section
				className={cn(
					"bg-white",
					isPage && "md:col-span-8",
					isDrawer && "sm:col-span-7 sm:h-full sm:min-h-0 sm:overflow-y-auto sm:pr-2",
				)}
			>
				<div className="divide-y divide-gray-100">
					<CartItems
						items={items}
						selectedIds={selectedIds}
						onToggleItem={onToggleItem}
						square={square}
					/>
				</div>
				{isPage && itemsFooter}
			</section>

			<aside
				className={cn(
					isPage && "md:col-span-4",
					isDrawer && "sm:col-span-5 sm:h-full sm:min-h-0 sm:overflow-y-auto",
				)}
			>
				<div className={cn(isPage && "sticky top-24")}>
					<CartSummary {...totals} currency={currency} square={square} />
				</div>
			</aside>
		</div>
	);
};

export default CartContent;
