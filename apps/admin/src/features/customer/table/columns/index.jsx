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
					Nom du client
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Email
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "user",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Pays
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div c className="w-12! text-center">
					<p>CI</p>
				</div>
			);
		},
	},
	{
		accessorKey: "orderCount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Nombre de commandes
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return <div className="w-40! text-center">{row.original.orderCount}</div>;
		},
	},

	{
		accessorKey: "totalSpent",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Total dépensé
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "a",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Action
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className="max-w-xs truncate">{row.original.description}</div>
		),
	},
];
