import Filter from "@/features/homepage/molecules/collections/apps/filter";
import { cn } from "@prettyfull/utils";

const FilterLayout = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				`w-1/6 h-full max-md:hidden border border-black/20 mb-[8rem] p-8 sticky top-0 mt-[5rem]`,
				className
			)}
		>
			<Filter />
		</div>
	);
};

export default FilterLayout;
