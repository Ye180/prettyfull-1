const Banner = () => {
	return (
		<div className="w-full h-full bg-dark rounded-xl flex items-center justify-center bg-[url(/collections/banner-mode.jpg)] bg-cover  bg-start bg-no-repea relative overflow-hidden">
			<div className="w-full h-full bg-black/35 absolute inset-0" />

			<h4 className="border max-md:!text-[4rem] md:!text-[7rem] font-bold static z-50 px-10 py-4 text-white rounded-lg bg-black/30 backdrop-blur-sm uppercase tracking-wider">
				Formal Shop
			</h4>
		</div>
	);
};

export default Banner;
