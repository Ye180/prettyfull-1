import { cn } from "@prettyfull/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes } from "react";

const inputVariants = cva(
	[
		"w-full h-full",
		"outline-none focus-visible:ring-0 ",
		"disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none max-md:px-4 max-md:h-20",
	],
	{
		variants: {
			variant: {
				default: "border-primary border",
				outline: "border border-gray-300 bg-transparent",
				filled: "bg-gray-100",
			},
			sizes: {
				default: "pl-[1.6rem] py-[1.8rem] font-medium",
			},
		},
		defaultVariants: {
			variant: "default",
			sizes: "default",
		},
	},
);

interface InputProps
	extends
		InputHTMLAttributes<HTMLInputElement>,
		VariantProps<typeof inputVariants> {
	label?: string;
	errorMessage?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, label, variant, errorMessage, ...props }, ref) => {
		return (
			<div>
				{label && (
					<label className="mb-2 block text-[2.4rem] font-medium font-family-heading max-md:text-[1.9rem]">
						{label}
					</label>
				)}
				<input
					ref={ref}
					className={cn(inputVariants({ variant }), className)}
					{...props}
					placeholder={props.placeholder ?? "Type here..."}
				/>
				{errorMessage && (
					<p className="mt-2 text-sm text-red-500">{errorMessage}</p>
				)}
			</div>
		);
	},
);

Input.displayName = "Input";
