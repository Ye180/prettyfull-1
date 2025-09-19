import { StarIcon } from "@/components/icons/start.icon";
import { Button, DropdownMenuSeparator } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";

const Reviews = ({ className }: { className?: string }) => {
	return (
		<div className={cn(className)}>
			<div className="flex items-center justify-between gap-8 max-md:ml-0  md:ml-24">
				<div>
					<div className="flex flex-row items-center justify-start gap-4 mt-16 mb-16">
						<h4 className="!text-[3.5rem] bg-amber-500 leading-0 ">Reviews</h4>
						<button className="cursor-pointer text-[1.5rem] font-normal">
							Showing 1849 reviews
						</button>
					</div>
				</div>
				<Button variant="default" className="px-8 py-6 w-fit h-fit">
					Ecrire commentaire
				</Button>
			</div>
			<div className="space-y-8">
				{Array.from({ length: 5 }).map((_, index) => (
					<div className="max-md:ml-0 md:ml-24 space-y-8 " key={index}>
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
							<p className="font-light tracking-wide text-gray-500">
								2 jours avant
							</p>
						</div>
						<p className="pl-2 font-normal tracking-wide text-justify text-black text-[1.5rem]">
							I love this stores shirt! It's so comfortable and easy to wear
							with anything. I ended up buying one in every color during their
							sale. The quality is great too. Thank you!
						</p>

						<DropdownMenuSeparator />
					</div>
				))}
			</div>
		</div>
	);
};

export default Reviews;
