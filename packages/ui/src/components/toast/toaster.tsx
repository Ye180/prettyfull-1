"use client";

import { cn } from "@prettyfull/utils";
import { Check, Loader2, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ToastVariant = "success" | "error" | "info" | "cart" | "loading";

export interface ToastItem {
	id: number;
	title: string;
	description?: string;
	variant: ToastVariant;
	duration: number;
}

// -----------------------------------------------------------------------------
// Store (framework-agnostic, usable from anywhere)
// -----------------------------------------------------------------------------

type Listener = (toasts: ToastItem[]) => void;

class ToastStore {
	private listeners: Listener[] = [];
	private items: ToastItem[] = [];
	private nextId = 1;

	subscribe(listener: Listener): () => void {
		this.listeners.push(listener);
		listener(this.items);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	private emit() {
		for (const l of this.listeners) l(this.items);
	}

	push(input: {
		id?: number;
		title: string;
		description?: string;
		variant: ToastVariant;
		duration: number;
	}): number {
		// If an id is provided and the toast still exists, update it in place
		if (typeof input.id === "number") {
			const existingIdx = this.items.findIndex((t) => t.id === input.id);
			const existing = existingIdx !== -1 ? this.items[existingIdx] : undefined;
			if (existing) {
				const updated: ToastItem = {
					...existing,
					title: input.title,
					description: input.description,
					variant: input.variant,
					duration: input.duration,
				};
				this.items = [
					...this.items.slice(0, existingIdx),
					updated,
					...this.items.slice(existingIdx + 1),
				];
				this.emit();
				if (updated.duration > 0) {
					setTimeout(() => this.dismiss(updated.id), updated.duration);
				}
				return updated.id;
			}
		}

		const id = this.nextId++;
		const item: ToastItem = {
			id,
			title: input.title,
			description: input.description,
			variant: input.variant,
			duration: input.duration,
		};
		this.items = [...this.items, item];
		this.emit();
		if (item.duration > 0) {
			setTimeout(() => this.dismiss(id), item.duration);
		}
		return id;
	}

	dismiss(id: number) {
		this.items = this.items.filter((t) => t.id !== id);
		this.emit();
	}
}

const store = new ToastStore();

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

interface ToastOptions {
	description?: string;
	duration?: number;
	/** Id d'un toast existant à remplacer (utile pour loading → success). */
	id?: number;
}

const DEFAULT_DURATION = 3500;

const make =
	(variant: ToastVariant, defaultDuration: number) =>
	(title: string, options: ToastOptions = {}) =>
		store.push({
			id: options.id,
			title,
			description: options.description,
			variant,
			duration: options.duration ?? defaultDuration,
		});

export const toast = {
	success: make("success", DEFAULT_DURATION),
	error: make("error", DEFAULT_DURATION),
	info: make("info", DEFAULT_DURATION),
	cart: make("cart", DEFAULT_DURATION),
	/** Toast persistant avec spinner ; dure jusqu'à dismiss ou remplacement via { id }. */
	loading: (title: string, options: ToastOptions = {}) =>
		store.push({
			id: options.id,
			title,
			description: options.description,
			variant: "loading",
			duration: options.duration ?? 0,
		}),
	dismiss: (id: number) => store.dismiss(id),
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

const variantStyles: Record<
	ToastVariant,
	{
		iconBg: string;
		accent: string;
		Icon: React.ComponentType<{ className?: string }>;
	}
> = {
	success: {
		iconBg: "bg-emerald-500",
		accent: "border-l-emerald-500",
		Icon: Check,
	},
	error: {
		iconBg: "bg-red-500",
		accent: "border-l-red-500",
		Icon: X,
	},
	info: {
		iconBg: "bg-blue-500",
		accent: "border-l-blue-500",
		Icon: Check,
	},
	cart: {
		iconBg: "bg-black",
		accent: "border-l-black",
		Icon: ShoppingBag,
	},
	loading: {
		iconBg: "bg-neutral-900",
		accent: "border-l-neutral-900",
		Icon: Loader2,
	},
};

export interface ToasterProps {
	/** Position coin de l'écran */
	position?:
		| "top-right"
		| "top-left"
		| "top-center"
		| "bottom-right"
		| "bottom-left"
		| "bottom-center";
	className?: string;
}

export const Toaster = ({
	position = "top-right",
	className,
}: ToasterProps) => {
	const [items, setItems] = useState<ToastItem[]>([]);

	useEffect(() => store.subscribe(setItems), []);

	const positionClasses: Record<
		NonNullable<ToasterProps["position"]>,
		string
	> = {
		"top-right": "top-4 right-4 items-end",
		"top-left": "top-4 left-4 items-start",
		"top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
		"bottom-right": "bottom-4 right-4 items-end",
		"bottom-left": "bottom-4 left-4 items-start",
		"bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
	};

	const comesFromRight = (position as string).indexOf("right") !== -1;
	const comesFromBottom = (position as string).indexOf("bottom") === 0;

	return (
		<div
			className={cn(
				"flex fixed flex-col gap-3 pointer-events-none z-[100]",
				positionClasses[position],
				className,
			)}
			aria-live="polite"
			aria-atomic="true"
		>
			<AnimatePresence initial={false}>
				{items.map((t) => {
					const v = variantStyles[t.variant];
					const Icon = v.Icon;
					return (
						<motion.div
							key={t.id}
							layout
							initial={{
								opacity: 0,
								x: comesFromRight ? 60 : -60,
								y: comesFromBottom ? 20 : -20,
								scale: 0.96,
							}}
							animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
							exit={{ opacity: 0, x: comesFromRight ? 60 : -60, scale: 0.96 }}
							transition={{ type: "spring", stiffness: 380, damping: 30 }}
							className={cn(
								"pointer-events-auto w-[min(380px,90vw)] overflow-hidden rounded-xl border border-neutral-200 border-l-4 bg-white shadow-lg",
								v.accent,
							)}
						>
							<div className="flex gap-3 items-start p-4">
								<div
									className={cn(
										"flex justify-center items-center w-9 h-9 text-white rounded-full shrink-0",
										v.iconBg,
									)}
								>
									<Icon
										className={cn(
											"w-5 h-5",
											t.variant === "loading" && "animate-spin",
										)}
									/>
								</div>
								<div className="flex-1 min-w-0 pt-0.5">
									<p className="text-[1.3rem] font-semibold leading-tight text-neutral-900">
										{t.title}
									</p>
									{t.description ? (
										<p className="mt-1 text-[1.2rem] leading-snug text-neutral-600">
											{t.description}
										</p>
									) : null}
								</div>
								<button
									type="button"
									onClick={() => store.dismiss(t.id)}
									className="flex justify-center items-center w-6 h-6 rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 shrink-0"
									aria-label="Close notification"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
							{t.duration > 0 ? (
								<motion.div
									initial={{ scaleX: 1 }}
									animate={{ scaleX: 0 }}
									transition={{
										duration: t.duration / 1000,
										ease: "linear",
									}}
									style={{ originX: 0 }}
									className={cn("h-0.5", v.iconBg)}
								/>
							) : null}
						</motion.div>
					);
				})}
			</AnimatePresence>
		</div>
	);
};

export default Toaster;
