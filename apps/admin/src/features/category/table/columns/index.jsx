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
		accessorKey: "slug",
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
		accessorKey: "productCount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Nombre de produits
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "description",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Description
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="max-w-xs truncate">{row.original.description}</div>
		),
	},
];
