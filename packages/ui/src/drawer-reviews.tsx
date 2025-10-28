// import { Button } from "./button";
import { StarIcon } from "lucide-react";
import { Button } from "./button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "./components/ui/drawer";
import { DropdownMenuSeparator } from "./components/ui/dropdown-menu";
import { CloseIcon } from "./icons/close.icon";

const DrawerReview = () => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className="w-full sm:w-[90%] p-2 py-4 text-2xl  rounded-full cursor-pointer  text-[1.8rem] sm:ml-24  sm:mt-8  sm:hidden max-sm:flex"
				>
					View All Reviews
				</Button>
			</DrawerTrigger>

			{/* Contenu du Drawer */}

			<DrawerContent
				title="Reviews"
				className="w-full p-5 border-none outline-none  md:hidden lg:hidden xl:hidden 2xl:hidden max-h-[90%] "
			>
				<DrawerClose
					className="absolute z-30 p-2 text-2xl bg-white rounded-full cursor-pointer right-4 top-4"
					onClick={(e) => e.stopPropagation()}
				>
					<CloseIcon className="w-10 h-10" />
				</DrawerClose>

				<div className="w-full h-[70vh]  max-w-5xl px-4 py-8 mx-auto overflow-y-auto ">
					{Array.from({ length: 9 }).map((_, index) => (
						<div className="pb-4 space-y-8 max-md:ml-0 md:ml-24 " key={index}>
							<div className="flex items-start justify-between ">
								<div>
									<div className="text-[1.4rem] font-light flex items-center gap-4">
										<div className="w-20 h-20 rounded-full bg-amber-700 " />
										<div>
											<h5 className="tracking-wide">Marvin McKinney</h5>
											<div className="flex items-center gap-1">
												{Array.from({ length: 5 }).map((_, index) => (
													<span key={index} className=" text-[#ffce31]">
														<StarIcon className="w-6 h-6" />
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
							<p className="pl-2 font-normal tracking-wide text-justify text-black text-[1.4rem] sm:text-[1.5rem]">
								I love this stores shirt! It's so comfortable and easy to wear
								with anything. I ended up buying one in every color during their
								sale. The quality is great too. Thank you!
							</p>

							<DropdownMenuSeparator />
						</div>
					))}

					<Button
						variant="outline"
						className="w-full sm:w-[90%] p-2 py-4 text-2xl  rounded-full cursor-pointer  text-[1.8rem] sm:ml-10  sm:mt-8   my-8 sm:flex "
					>
						Load more
					</Button>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default DrawerReview;
