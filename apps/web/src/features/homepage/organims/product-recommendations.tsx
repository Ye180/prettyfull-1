import Image from "next/image";
import Link from "next/link";

export const ProductRecommendations = () => {
	const articles = [
		{
			id: "art_urban_tee",
			title: "The Urban Tee is a Stylish, Comfortable Piece for City Life.",
			description:
				"Made from quality materials, this tee blends softness and durability, perfect for casual outings and weekends.",
			image: "/home/presentation.jpg",
			href: "/about",
		},
		{
			id: "art_eco_hoodie",
			title: "The Eco-Friendly Hoodie is a Sustainable Choice for Everyday Wear.",
			description:
				"Crafted from recycled fabrics, this hoodie offers warmth and style while reducing your carbon footprint.",
			image: "/home/promotion.jpg",
			href: "/about",
		},
		{
			id: "art_athletic_joggers",
			title: "The Athletic Joggers are Designed for Performance and Comfort.",
			description:
				"Featuring moisture-wicking technology, these joggers are great for workouts and relaxing, offering flexibility.",
			image: "/home/cover-box-3.jpg",
			href: "/about",
		},
	];

	return (
		<section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-10">
				<div className="max-w-xl space-y-2">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#080808]">
						Product Recommendations
					</h2>
					<p className="text-[1.4rem] text-[#666666]">
						From fashion to tech gadgets, there's something for everyone. Join the conversation and see what the buzz is!
					</p>
				</div>

				<Link
					href="/about"
					className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-[1.4rem] font-medium rounded-full whitespace-nowrap hover:bg-[#222] transition-all self-start sm:self-auto shadow"
				>
					<span>Learn More</span>
					<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="7" y1="17" x2="17" y2="7" />
						<polyline points="7 7 17 7 17 17" />
					</svg>
				</Link>
			</div>

			{/* 3 Story Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
				{articles.map((art) => (
					<Link
						key={art.id}
						href={art.href}
						className="group flex flex-col space-y-4"
					>
						<div className="relative w-full aspect-[16/11] rounded-[2.2rem] overflow-hidden bg-[#F5F5F5]">
							<Image
								src={art.image}
								alt={art.title}
								fill
								sizes="(max-width: 768px) 100vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="space-y-2">
							<h3 className="text-[1.7rem] font-bold text-[#080808] group-hover:text-black leading-snug">
								{art.title}
							</h3>
							<p className="text-[1.4rem] text-[#666666] leading-relaxed">
								{art.description}
							</p>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
};

export default ProductRecommendations;
