import { Button } from "@prettyfull/ui";
import { cn } from "@prettyfull/utils";
import DrawerReview from "../../../../../../../packages/ui/src/drawer-reviews";
import { ReviewsOneItems, ReviewsResponsive } from "../molecules/reviews-items";

const Reviews = ({ className }: { className?: string }) => {
	return (
		<div className={cn(className, "py-9")}>
			<div className="flex gap-8 justify-between items-center max-md:ml-0 md:ml-24">
				<div>
					<div className="flex flex-row gap-4 justify-start items-center mt-16 mb-16">
						<h4 className="text-[3.5rem] leading-0 ">Reviews</h4>
						<button className="cursor-pointer text-[1.5rem] font-normal">
							Showing 1849 reviews
						</button>
					</div>
				</div>
				<Button
					variant="default"
					className="px-8 py-6 w-fit h-fit whitespace-nowrap max-sm:text-[1rem] sm:text-[1.5rem]"
				>
					Ecrire commentaire
				</Button>
			</div>

			<div className="py-4 space-y-8 w-full">
				<div className="flex overflow-x-auto gap-8 w-full sm:hidden scrolbar">
					<ReviewsResponsive />
					<ReviewsResponsive />
					<ReviewsResponsive />
				</div>

				{Array.from({ length: 9 })
					.slice(5)
					.map((_, index) => (
						<ReviewsOneItems key={index} />
					))}
			</div>

			<Button
				variant="outline"
				className="w-full sm:w-[90%] p-2 py-4 text-2xl  rounded-full cursor-pointer  text-[1.8rem] sm:ml-10  sm:mt-8  sm:flex max-sm:hidden"
			>
				Load more
			</Button>

			<DrawerReview />
		</div>
	);
};

export default Reviews;
