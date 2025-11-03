"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="p-0 w-fit"
				>
					Nom
					<ArrowUpDown className="w-4 h-2" />
				</Button>
			);
		},
	},
	{
		accessorKey: "sku",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="p-0 w-fit"
				>
					Slug
					<ArrowUpDown className="w-4 h-2" />
				</Button>
			);
		},
	},

	{
		accessorKey: "price.amount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="p-0 w-fit"
				>
					Prix
					<ArrowUpDown className="w-4 h-2" />
				</Button>
			);
		},
	},
	{
		accessorKey: "price.currency",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="p-0 w-fit"
				>
					Devise
					<ArrowUpDown className="w-4 h-2" />
				</Button>
			);
		},
	},
	{
		accessorKey: "promotion.reduced_price.amount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="p-0 w-fit"
				>
					Prix réduit
					<ArrowUpDown className="w-4 h-2" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-green-600">
				{row.original.promotion?.reduced_price.amount || "N/A"}
			</div>
		),
	},
];
