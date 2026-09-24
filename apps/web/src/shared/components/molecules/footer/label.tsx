import { SOCIALS_DATA_FOOTER } from "@/lib/utils/constants/constants";
import Link from "next/link";

const DescriptionFooter = () => {
	return (
		<div className="flex flex-col space-y-6 text-[1.4rem] lg:col-span-1">
			{/* Socials - circular outline buttons */}
			<div className="flex gap-3 items-center">
				{SOCIALS_DATA_FOOTER.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						aria-label={item.label}
						className="flex justify-center items-center w-10 h-10 text-white rounded-full transition-all border-white/30 hover:border-white hover:bg-white hover:text-black"
					>
						<item.icon size={16} />
					</Link>
				))}
			</div>

			<p className="w-full text-white/70 leading-relaxed text-[1.4rem]">
				Rue des Jardins, Cocody, Abidjan, Côte d'Ivoire
			</p>
			<p className="text-white/70 text-[1.4rem]">contact@prettyfull.shop</p>
			<p className="text-white/70 text-[1.4rem]">+225 07 08 09 10 11</p>
		</div>
	);
};

export default DescriptionFooter;
