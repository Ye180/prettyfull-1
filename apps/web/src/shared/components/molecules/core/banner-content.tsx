import { cn } from "@prettyfull/utils";

const BannerContent = ({ label }: { label: string }) => {
	return (
		<div className="relative flex items-center justify-center w-full h-[20vh] md:h-[35vh] overflow-hidden bg-black bg-no-repeat bg-cover rounded-xl bg-start">
			<h4
				className={cn(
					"border md:min-w-[25rem] md:min-h-[10rem] max-md:!text-[4rem] md:!text-[7rem] font-bold static z-20 px-10 py-4 text-white rounded-lg bg-black/30 backdrop-blur-sm uppercase tracking-wider text-center"
				)}
			>
				{label}
			</h4>
		</div>
	);
};

export default BannerContent;
