import { Skeleton } from "@prettyfull/ui";

const Loading = () => {
	return (
		<div className="p-4 space-y-4">
			<Skeleton className="w-full  h-[10vh]  rounded-md " />
			<Skeleton className="w-full  h-[50vh]  rounded-md " />

			<div className="grid grid-cols-3 gap-3 justify-items-stretch max-sm:hidden sm:flex">
				{Array.from({ length: 3 }).map((_, index) => (
					<Skeleton key={index} className="w-full mb-2 rounded-md h-140" />
				))}
			</div>

			<Skeleton className="w-full mb-2 rounded-md max-sm:flex sm:hidden h-140" />
		</div>
	);
};

export default Loading;
