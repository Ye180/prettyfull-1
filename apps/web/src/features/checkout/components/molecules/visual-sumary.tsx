import { CartItemType } from "../../types";

const VisualSummary = ({ item }: { item: CartItemType }) => {
  return (
    <div className="flex space-x-8 sm:space-x-10">
      <div
        className="relative w-[12rem] h-[13rem] rounded-md bg-gray-100 aspect-square"
        style={{
          backgroundImage: `url(${item.image || "/assets/product_1.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <p className="absolute flex items-center justify-center font-semibold text-white bg-black rounded-full -top-4 -right-5 size-12 text-[1.4rem]">
          {item.quantity}
        </p>
      </div>

      <div className="flex flex-col justify-between space-y-4">
        <div className="space-y-2 text-[1.5rem]">
          <h5 className="font-semibold !text-[2.2rem] tracking-wider whitespace-nowrap">
            {item.name}
          </h5>
          <p className="text-gray-500 text-md line-clamp-1">
            {item.description || ""}
          </p>
          <p className="text-gray-500 text-md">
            Color: {item.color || "-"}
          </p>
          <p className="text-gray-500 text-md">
            Size: {item.size || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisualSummary;
