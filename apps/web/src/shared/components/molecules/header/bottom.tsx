import { SUBS_CATEGORY } from "@/lib/utils/constants/constants";
import { NavLink } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";

const BottomHeader = ({
	className,
	className_2,
}: {
	className?: string;
	className_2?: string;
}) => {
	return (
		<div
			className={cn(
				"max-xs:hidden sm:flex items-center justify-start gap-6 mt-4  text-[1.5rem] ",
				className
			)}
		>
			<div className="w-full overflow-x-auto h-fit ">
				<div
					className={cn(
						"flex   max-sm:snap-x md:w-full  md:overflow-hidden overflow-y-hidden  lg:overflow-visible   space-y-0  space-x-0  scrollbar-hide  scroll-smooth snap-x  lg:snap-mandatory gap-x-6  scrolbar text-[1.5rem]",
						className_2
					)}
				>
					{SUBS_CATEGORY.map((link, index) => (
						<NavLink
							href={link.href}
							key={index}
							className="!text-[1.6rem] capitalize snap-center"
						>
							{" "}
							{link.label}
						</NavLink>
					))}
				</div>
			</div>
		</div>
	);
};

export default BottomHeader;
