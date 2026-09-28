"use client";

import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { cn } from "@prettyfull/utils";
import Link from "next/link";
import { useState } from "react";

interface NavChild {
	name: string;
	handle: string;
}

interface NavDropdownProps {
	label: string;
	href: string;
	isActive?: boolean;
	/** Sous-catégories du lien - nommé à part de `children` (JSX) pour rester simple prop de données. */
	subcategories?: NavChild[];
	parentSlug?: string;
}

/**
 * Lien de nav avec dropdown simple au survol/focus (liste sobre, pas de
 * mega-menu à grille) - inspiré du dropdown "Our Brands" de la référence.
 */
const NavDropdown = ({
	label,
	href,
	isActive,
	subcategories = [],
	parentSlug,
}: NavDropdownProps) => {
	const [open, setOpen] = useState(false);
	const hasChildren = subcategories.length > 0;

	const buildChildHref = (handle: string) => {
		const pathname = COLLECTION_PATHS.collectionDetail(handle);
		return parentSlug ? `${pathname}?division=${parentSlug}` : pathname;
	};

	return (
		<div
			className="relative"
			onMouseEnter={() => hasChildren && setOpen(true)}
			onMouseLeave={() => hasChildren && setOpen(false)}
		>
			<Link
				href={href}
				className={cn(
					"text-[#111111] hover:text-black transition-colors",
					isActive && "text-black font-semibold",
				)}
				onFocus={() => hasChildren && setOpen(true)}
			>
				{label}
			</Link>

			{hasChildren && open && (
				<div className="absolute left-0 top-full z-50 pt-3 min-w-[200px]">
					<div className="overflow-hidden py-2 bg-white rounded-lg border border-gray-200 shadow-lg">
						{subcategories.map((child) => (
							<Link
								key={child.handle}
								href={buildChildHref(child.handle)}
								className="block px-4 py-2 text-[1.4rem] text-gray-700 transition-colors hover:bg-gray-50 hover:text-black"
								onClick={() => setOpen(false)}
							>
								{child.name}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default NavDropdown;
