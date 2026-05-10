// import { Button } from "@/components/ui/button";

import { cn } from "@prettyfull/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "./components/ui/dialog";
type DrawerProps = {
	children?: React.ReactNode;
	open: boolean;
	onClose: () => void;
	title?: string;
	description?: string; // Description optionnelle
	trigger?: React.ReactNode; // Icône ou bouton pour ouvrir le Drawer
	triggerClassName?: string; // Classes CSS pour personnaliser le trigger
	titleClassName?: string;
	className?: string;
	close?: boolean;
	describedby?: string;
};

export function CustomModal({
	children,
	open,
	onClose,
	title = "Currency",
	description,
	trigger,
	triggerClassName,
	titleClassName,
	className,
	close,
	describedby,
}: DrawerProps) {
	return (
		<motion.div>
			{/* Rendu du trigger */}
			{trigger && (
				<div
					onClick={onClose}
					className={` cursor-pointer  ${triggerClassName || ""}`}
				>
					{trigger}
				</div>
			)}

			{/* Le contenu du Drawer */}

			<Dialog open={open} onOpenChange={onClose}>
				<DialogContent
					aria-describedby={describedby}
					onInteractOutside={(event) => event.preventDefault()}
					className={cn(
						"overflow-hidden w-1/2 rounded-3xl border-none outline-none",
						className,
					)}
				>
					<AnimatePresence mode="wait">
						<motion.div
							initial={{ opacity: 0 }} // Animation initiale si nécessaire
							animate={{ opacity: 1 }} // Animation active
							exit={{ opacity: 0 }} // Animation de sortie (disparition)
							transition={{ duration: 0.2 }} // Durée de la transition
						>
							{close && (
								<DialogClose className="absolute top-4 right-6 p-2 rounded-full border-0 transition-colors cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-0 focus:ring-gray-300 focus:ring-offset-0">
									<X className="text-gray-500 size-6 hover:text-gray-800" />
								</DialogClose>
							)}

							<DialogHeader className="flex flex-col items-center w-full h-fit">
								<DialogTitle
									className={cn(
										"h-fit text-center text-[2rem]! tracking-wider lg:text-[4.5rem]! pt-6 ",
										titleClassName,
									)}
								>
									{title}
								</DialogTitle>
								<DialogDescription className="text-center text-[1.5rem]">
									{description}
								</DialogDescription>
							</DialogHeader>

							<div className="mt-4 w-full">{children}</div>
						</motion.div>
					</AnimatePresence>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
