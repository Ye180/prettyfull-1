import { Skeleton } from "@prettyfull/ui";

const ProductLoading = () => (
	<div>
		<div className="flex flex-col space-y-3">
			<Skeleton className="sm:h-[355px] w-[200px] h-[250px] sm:w-[300px] rounded-none" />
			<div className="space-y-2">
				<Skeleton className="h-9 w-[150px] sm:w-[250px] rounded-none" />
				<Skeleton className="h-9 w-[100px] sm:w-[200px] rounded-none" />
			</div>
		</div>
	</div>
);

const ProductResultLoading = () => (
	<div className="flex space-y-2 gap-x-8">
		<Skeleton className="h-[500px] w-1/4  rounded-none" />
		<div className="w-1/4 space-y-2">
			<Skeleton className="w-3/4 h-[100px] rounded-none" />
			<Skeleton className="w-1/2 h-[150px] rounded-none" />
		</div>
	</div>
);

const ReviewLoading = () => (
	<div className="flex items-center space-x-4">
		<Skeleton className="w-24 h-24 rounded-full" />
		<div className="space-y-3">
			<Skeleton className="h-10 w-[350px]" />
			<Skeleton className="h-10 w-[300px]" />
		</div>
	</div>
);

const Account = () => {
	return (
		<div className="p-4 space-y-8">
			<ProductLoading />

			<ProductResultLoading />

			<ReviewLoading />
		</div>
	);
};

export default Account;
