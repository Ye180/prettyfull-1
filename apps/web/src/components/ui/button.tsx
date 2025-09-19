"use client";

import { cn } from "@prettyfull/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "default" | "outline" | "ghost";
}

export function Button({
	className,
	variant = "default",
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

	const variantStyles = {
		default: "bg-black text-white hover:bg-gray-800 disabled:opacity-50",
		outline:
			"border border-black bg-white text-black hover:bg-gray-100 disabled:opacity-50",
		ghost: "bg-transparent text-black hover:bg-gray-100 disabled:opacity-50",
	};

	return (
		<button
			className={cn(baseStyles, variantStyles[variant], className)}
			{...props}
		/>
	);
}
