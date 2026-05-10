import ItemsCategory from "../molecules/items-category";

const CategoryCollection = () => {
	return (
		<div className="w-full max-lg:overflow-x-auto scrolbarRecomandation">
			<div className="flex gap-x-4 max-sm:snap-x lg:gap-x-3 h-[300px] lg:w-full lg:justify-between">
				{Array.from({ length: 7 }).map((_, index) => (
					<ItemsCategory key={index} />
				))}
			</div>
		</div>
	);
};

export default CategoryCollection;
