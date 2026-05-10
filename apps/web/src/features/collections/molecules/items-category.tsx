const ItemsCategory = () => {
	return (
		<div
			className="overflow-hidden relative w-40 h-full min-w-92 pointer-cursor snap-center"
			style={{
				backgroundImage: `url('/assets/product_1.jpg')`,
				backgroundSize: "cover",
				backgroundPosition: "start",
				backgroundRepeat: "no-repeat",
			}}
		>
			<div className="flex overflow-hidden absolute bottom-0 left-0 justify-center items-end pb-8 w-full h-1/2 text-2xl text-white bg-linear-to-t from-black/80 to-black/0 font-bebas-neue">
				<p className="!white-space-nowrap text-ellipsis line-clamp-1 truncate px-4  ">
					BOMBERS
				</p>
			</div>
		</div>
	);
};

export default ItemsCategory;
