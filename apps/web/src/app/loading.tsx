import { Skeleton } from "@prettyfull/ui";

const loading = () => {
	return (
		<div>
			<Skeleton className="w-full mb-4 rounded-none h-42" />

			<div>
				{Array.from({ length: 4 }).map((_, index) => (
					<Skeleton key={index} className="w-1/3 h-16 mb-2 rounded-none" />
				))}
			</div>
		</div>
	);
};

export default loading;
