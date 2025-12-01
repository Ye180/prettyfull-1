import ItemsCategory from "../molecules/items-category";

const CategoryCollection = () => {
  return (
    <div className="overflow-x-auto w-full h-fit scrolbarRecomandation">
      <div className="flex overflow-y-hidden gap-x-4 h-80 md:gap-x-16 max-sm:snap-x md:w-full md:overflow-hidden lg:overflow-visible lg:gap-x-6 sm:h-140 lg:space-y-0 lg:space-x-0 lg:scrollbar-hide lg:scroll-smooth lg:snap-x lg:snap-mandatory scrolbarRecomandation">
        {Array.from({ length: 8 }).map((_, index) => (
          <ItemsCategory key={index} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCollection;
