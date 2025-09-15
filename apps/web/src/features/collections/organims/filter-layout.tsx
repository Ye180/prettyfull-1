import Filter from "@/features/homepage/molecules/collections/apps/filter";

const FilterLayout = () => {
	return (
		<div className="w-1/6 h-full max-md:hidden border border-black/20 mb-[-5.5rem] p-8 ">
			<Filter />
		</div>
	);
};

export default FilterLayout;
