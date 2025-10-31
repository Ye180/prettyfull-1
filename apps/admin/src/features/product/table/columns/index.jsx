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
					className=" w-fit p-0"
				>
					Nom
					<ArrowUpDown className="h-2 w-4" />
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
					className=" w-fit p-0"
				>
					Slug
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "label",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Nombre de produits
					<ArrowUpDown className="h-2 w-4 " />
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
					className=" w-fit p-0"
				>
					Prix
					<ArrowUpDown className="h-2 w-4" />
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
					className=" w-fit p-0"
				>
					Devise
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "promotion.reduced_price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Prix réduit
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="text-green-600">
				{row.original.promotion?.reduced_price || "N/A"}
			</div>
		),
	},
];
