import { cn } from "@prettyfull/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { Spinner } from "./icons/spinner.icon";
import Flex from "./layouts/helpers/flex";
const buttonVariants = cva(
	"inline-flex items-center  justify-center cursor-pointer  w-full font-medium transition-colors focus:outline-none  disabled:opacity-50 disabled:pointer-events-none max-md:py-6 ",
	{
		variants: {
			variant: {
				default: " bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-white hover:bg-destructive/90",
				outline:
					"border border-black bg-transparent hover:bg-black hover:text-white",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: " px-[4rem] py-[1.9rem]",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
			},
			shape: {
				rounded: "rounded-full",
				square: "rounded-none",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			shape: "rounded",
		},
	},
);

interface ButtonProps
	extends
		ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	isLoading?: boolean;
	icon?: React.ReactNode;
	/** Position de l'icône. "end" reproduit le pattern CTA + flèche circulaire de la DA. */
	iconPosition?: "start" | "end";
	fullWidth?: boolean;
}

export const Button = ({
	children,
	className,
	variant,
	size,
	shape,
	icon,
	iconPosition = "start",
	isLoading,
	fullWidth,
	...props
}: PropsWithChildren<ButtonProps>) => {
	const disabled = props.disabled || isLoading;

	const iconEl = icon && (
		<span
			className={cn(
				"flex shrink-0 justify-center items-center",
				iconPosition === "end" &&
					"w-6 h-6 rounded-full bg-white/15 text-current",
			)}
		>
			{icon}
		</span>
	);

	return (
		<button
			className={cn(
				buttonVariants({ variant, size, shape }),
				{ "w-full": fullWidth },
				className,
			)}
			{...props}
			disabled={disabled}
		>
			<Flex settings={{ align: "center", spacing: "gap-3" }}>
				{iconPosition === "start" && iconEl}
				<div className="flex gap-3">
					{children}
					{isLoading && <Spinner />}
				</div>
				{iconPosition === "end" && iconEl}
			</Flex>
		</button>
	);
};
