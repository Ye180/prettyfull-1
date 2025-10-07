const Size = ({ size }: { size: string[] }) => {
	return (
		<div className="grid grid-cols-4 gap-y-8 gap-x-5 ">
			{size.map((size, i) => (
				<button
					key={i}
					className="flex items-center justify-center w-full h-12 px-6 py-4 mx-auto font-normal text-gray-600 uppercase bg-white border border-gray-100 rounded-sm text-[1.3rem] hover:border-black hover:text-black transition-all duration-200 cursor-pointer"
				>
					{size}
				</button>
			))}
		</div>
	);
};

export default Size;
