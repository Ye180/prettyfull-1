import Filter from "@/features/homepage/molecules/collections/apps/filter";
import { cn } from "@prettyfull/utils";

const FilterLayout = ({ className }: { className?: string }) => {
  return (
    <aside
      className={cn(
        `
        w-1/5
        h-fit
        max-md:hidden
        sticky
        top-24
        self-start
        bg-white
        p-6
        border border-black/20 
        transition-all duration-300
        hover:shadow-md hover:border-black/30
      `,
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Filtres</h3>
      <Filter />
    </aside>
  );
};

export default FilterLayout;
