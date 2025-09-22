const CategoryCollection = () => {
	return (
		<div className="grid items-center justify-between w-full h-full grid-cols-6 grid-rows-1 gap-x-2 ">
			{Array.from({ length: 6 }).map((_, index) => (
				<button
					key={index}
					className="bg-gray-100  w-[100%] aspect-square pointer-cursor"
					style={{
						backgroundImage: `url('/assets/product_1.jpg')`,
						backgroundSize: "cover",
						backgroundPosition: "start",
						backgroundRepeat: "no-repeat",
					}}
				/>
			))}
		</div>
	);
};

export default CategoryCollection;
