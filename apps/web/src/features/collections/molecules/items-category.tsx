const ItemsCategory = () => {
	return (
		<div
			className="bg-gray-100 relative h-full w-[17rem] sm:w-[25rem] aspect-square pointer-cursor overflow-hidden flex-shrink-0 snap-center"
			style={{
				backgroundImage: `url('/assets/product_1.jpg')`,
				backgroundSize: "cover",
				backgroundPosition: "start",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="absolute bottom-0 left-0 flex items-end justify-center w-full pb-8 overflow-hidden text-2xl text-white h-1/2 bg-linear-to-t from-black/80 to-black/0 font-bebas-neue">
				<p className="!white-space-nowrap text-ellipsis line-clamp-1 truncate px-4  ">
					BOMBERS
				</p>
			</div>
		</div>
	);
};

export default ItemsCategory;
