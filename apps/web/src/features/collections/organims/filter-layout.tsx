import Filter from "@/features/homepage/molecules/collections/apps/filter";

const FilterLayout = () => {
	return (
		<div className="w-1/6 h-full max-md:hidden border border-black/20 mb-[8rem]  p-8 static mt-[5rem] ">
			<Filter />
		</div>
	);
};

export default FilterLayout;
