"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns = [
	{
		accessorKey: "orderNumber",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Numero de commande
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Date
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const date = new Date(row.original.createdAt);
			date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
			//je veux ajouter l'heure locale et enlevez les seconde et les millisecondes
			const hours = date.setHours(
				date.getHours() + date.getTimezoneOffset() / 60
			);
			return (
				<div>
					{date.toLocaleDateString()} - {new Date(hours).toLocaleTimeString()}
				</div>
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
					Consomateur
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<div className="space-y-4">
					<p className="font-semibold white-space-nowrap">
						{row.original.user?.firstName} {row.original.user?.lastName}
					</p>
					<p className="text-black/60 text-md">{row.original.user?.email}</p>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Status
					<ArrowUpDown className="h-2 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "shippingAddressInfo.city",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className=" w-fit p-0"
				>
					Method
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
