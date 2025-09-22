import { cn } from "@prettyfull/utils";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { TrashIcon } from "../../../../../../../packages/ui/src/icons/trash.icon";

const EditItems = ({
	onRemove,
	className,
}: {
	onRemove: (id: string) => void;
	className?: string;
}) => {
	return (
		<div className={cn("flex sm:space-x-4  mt-2 ", className)}>
			<div className="rounded-full border p-4 border-gray-200 hover:bg-gray-100 transition">
				<Heart className="w-8 h-8 cursor-pointer hover:text-black" />
			</div>
			<div className="rounded-full border p-4 border-gray-200 hover:bg-gray-100 transition">
				<TrashIcon
					className="w-8 h-8 cursor-pointer hover:text-red-500"
					onClick={() => onRemove}
				/>
			</div>
		</div>
	);
};

export default EditItems;
