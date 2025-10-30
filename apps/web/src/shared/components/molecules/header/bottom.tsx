"use client ";
import { Category } from "@/features/homepage/api/get-category";
import { COLLECTION_PATHS } from "@/lib/routes/paths-en";
import { NavLink, Skeleton } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";

const BottomHeader = ({
	className,
	className_2,
	secondary_category,
}: {
	className?: string;
	className_2?: string;
	secondary_category?: Category[];
}) => {
	// Placeholder for potential future data fetching

	return (
		<div
			className={cn(
				"max-xs:hidden sm:flex items-center justify-start gap-6 mt-4  text-[1.5rem] ",
				className
			)}
		>
			<div className="w-full overflow-x-auto h-fit ">
				<div
					className={cn(
						"flex   max-sm:snap-x md:w-full  md:overflow-hidden overflow-y-hidden  lg:overflow-visible   space-y-0  space-x-0  scrollbar-hide  scroll-smooth snap-x  lg:snap-mandatory gap-x-6  scrolbar text-[1.5rem]",
						className_2
					)}
				>
					{secondary_category ? (
						secondary_category?.map((items: Category, index: number) => (
							<NavLink
								href={COLLECTION_PATHS.collectionDetail(items.slug)}
								key={index}
								className="!text-[1.6rem] capitalize snap-center"
							>
								{" "}
								{items.name}
							</NavLink>
						))
					) : (
						<Skeleton className="h-9 w-[100%]" />
					)}
					{/*  */}
				</div>
			</div>
		</div>
	);
};

export default BottomHeader;
