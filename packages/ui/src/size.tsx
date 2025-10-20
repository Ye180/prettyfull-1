import { cn } from "@prettyfull/utils";
import { Button } from "./button";

const Size = ({
	size,
	selectSize,
	className,
	classButton,
	onSizeChange,
	onclose,
}: {
	size: string[];
	selectSize?: string;
	className?: string;
	classButton?: string;
	onSizeChange?: (size: string) => void;
	onclose?: (
		e: React.MouseEvent<HTMLButtonElement>,
		selectSize: string
	) => void;
}) => {
	const sizeOptions = [
		{
			label: "XS",
			code: "XS",
		},
		{
			label: "S",
			code: "S",
		},
		{
			label: "M",
			code: "M",
		},
		{
			label: "L",
			code: "L",
		},
		{
			label: "XL",
			code: "XL",
		},
		{
			label: "2XL",
			code: "2XL",
		},
		{
			label: "3XL",
			code: "3XL",
		},
	];

	const handleClick = (
		e?: React.MouseEvent<HTMLButtonElement>,
		size?: string
	) => {
		e?.stopPropagation();

		onSizeChange && onSizeChange(size as string);

		onclose &&
			onclose(e as React.MouseEvent<HTMLButtonElement>, size as string);
	};

	return (
		<div
			className={cn(
				"grid grid-cols-4 gap-y-4 items-center gap-x-5 justify-between  ",
				className
			)}
		>
			{sizeOptions.map((items, i) => (
				<Button
					key={i}
					onClick={(e) => {
						handleClick(e, items.label);
					}}
					disabled={!size.includes(items.label)}
					size="lg"
					className={cn(
						"flex   w-fit  text-center  h-14 px-6 pb-4 pt-3  mx-auto font-normal text-gray-600 uppercase bg-white border border-gray-300 rounded-sm text-[1.3rem] hover:border-black hover:text-white transition-all duration-200 cursor-pointer",
						size.includes(selectSize as string) && selectSize === items.label
							? "border-black"
							: "border-gray-200 hover:border-gray-500",

						classButton
					)}
				>
					{items.label}
				</Button>
			))}
		</div>
	);
};

export default Size;
