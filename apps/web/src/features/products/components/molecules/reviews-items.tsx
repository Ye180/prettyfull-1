import { StarIcon } from "@/components/icons/start.icon";
import { DropdownMenuSeparator } from "@prettyfull/ui";

export const ReviewsOneItems = () => {
	return (
		<div className="space-y-8 max-md:ml-0 md:ml-24 max-sm:hidden ">
			<div className="flex items-start justify-between ">
				<div>
					<div className="text-[1.4rem] font-light flex items-center gap-4">
						<div className="w-20 h-20 rounded-full bg-amber-700 " />
						<div>
							<h5 className="tracking-wide">Marvin McKinney</h5>
							<div className="flex items-center gap-1">
								{Array.from({ length: 5 }).map((_, index) => (
									<span key={index} className=" text-[#ffce31]">
										<StarIcon />
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
				<p className="font-light tracking-wide text-gray-500">2 jours avant</p>
			</div>
			<p className="pl-2 font-normal tracking-wide text-justify text-black text-[1.5rem]">
				I love this stores shirt! It's so comfortable and easy to wear with
				anything. I ended up buying one in every color during their sale. The
				quality is great too. Thank you!
			</p>

			<DropdownMenuSeparator />
		</div>
	);
};

export const ReviewsResponsive = () => {
	return (
		<div className="flex flex-col items-center gap-4 p-4 py-8 border-gray-200 rounded-lg border-1 max-md:ml-0 md:ml-24 max-sm:w-fit">
			<div className="space-y-4 w-[40rem]">
				<div className="flex items-center justify-between ">
					<h5 className="tracking-wide text-[1.6rem]">- Marvin McKinney</h5>
					<div className="flex items-center gap-1">
						{Array.from({ length: 5 }).map((_, index) => (
							<span key={index} className=" text-[#ffce31]">
								<StarIcon />
							</span>
						))}
					</div>
				</div>

				<p className=" font-normal tracking-wide  text-black text-[1.4rem]">
					I love this stores shirt! It's so comfortable and easy to wear with
					anything. I ended up buying one in every color during their sale. The
					quality is great too. Thank you!
				</p>
			</div>

			<div className="w-full text-gray-400  text-end text-[1.2rem]">
				<p> February 15, 2025 </p>
			</div>
		</div>
	);
};
