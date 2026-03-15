"use client";
import { Category } from "@/features/homepage/api/medusa/get-category";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import Link from "next/link";

const BottomHeader = ({
	className,
	className_2,
	secondary_category = [],
	loading,
	parentSlug,
}: {
	className?: string;
	className_2?: string;
	secondary_category?: Category[];
	loading?: boolean;
	parentSlug?: string;
}) => {
	const buildLinkHref = (handle: string) => {
		const pathname = COLLECTION_PATHS.collectionDetail(handle);
		return parentSlug ? `${pathname}?division=${parentSlug}` : pathname;
	};

	return (
		<div
			className={cn(
				"max-xs:hidden sm:flex items-center justify-start gap-6 mt-4  text-[1.5rem] ",
				className,
			)}
		>
			<div className="overflow-x-auto w-full h-fit">
				<div
					className={cn(
						"flex max-sm:snap-x md:w-full md:overflow-hidden overflow-y-hidden lg:overflow-visible space-y-0 space-x-0 scrollbar-hide scroll-smooth snap-x lg:snap-mandatory gap-x-6 text-[1.5rem]",
						className_2,
					)}
				>
					{loading && <Skeleton className="w-full h-9" />}
					{!loading &&
						secondary_category.length > 0 &&
						secondary_category.map((items: Category, index: number) => (
							<Link
								href={buildLinkHref(items.handle as string)}
								key={index}
								className="text-sm font-semibold tracking-wide uppercase whitespace-nowrap transition-all duration-300 ease-in-out snap-center hover:text-primary"
							>
								{items.name}
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};

export default BottomHeader;
