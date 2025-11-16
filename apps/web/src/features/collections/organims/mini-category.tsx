import ItemsCategory from "../molecules/items-category";

const CategoryCollection = () => {
	return (
		<div className="w-full overflow-x-auto h-fit scrolbarRecomandation">
			<div className="flex gap-x-4 md:gap-x-16 max-sm:snap-x md:w-full  h-[20rem] md:overflow-hidden overflow-y-hidden  lg:overflow-visible  lg:gap-x-6  sm:h-[35rem]  lg:space-y-0  lg:space-x-0  lg:scrollbar-hide  lg:scroll-smooth  lg:snap-x  lg:snap-mandatory scrolbarRecomandation ">
				{Array.from({ length: 8 }).map((_, index) => (
					<ItemsCategory key={index} />
				))}
			</div>
		</div>
	);
};

export default CategoryCollection;
