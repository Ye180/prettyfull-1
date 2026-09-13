import { SOCIALS_DATA_FOOTER } from "@/lib/utils/constants/constants";
import Link from "next/link";

const DescriptionFooter = () => {
	return (
		<div className="flex flex-col space-y-6 text-[1.4rem] lg:col-span-1">
			{/* Socials - circular outline buttons */}
			<div className="flex items-center gap-3">
				{SOCIALS_DATA_FOOTER.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						aria-label={item.label}
						className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 text-white hover:border-white hover:bg-white hover:text-black transition-all"
					>
						<item.icon size={16} />
					</Link>
				))}
			</div>

			<p className="w-full text-white/70 leading-relaxed text-[1.4rem]">
				4567 Oak Avenue, Rivertown, CA 90210, is a charming area with friendly
				faces.
			</p>
			<p className="text-white/70 text-[1.4rem]">info@prettyfull.com</p>
			<p className="text-white/70 text-[1.4rem]">(+89) 090 800 123</p>
		</div>
	);
};

export default DescriptionFooter;
