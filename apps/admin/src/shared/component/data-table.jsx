"use client";

import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useState } from "react";
export function DataTable({ columns, data, filter, labelFiltre, loading }) {
	const [sorting, setSorting] = useState([]);
	const [columnFilters, setColumnFilters] = useState([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			<div className="flex items-center py-4">
				<Input
					placeholder={`Filtre par ${labelFiltre}...`}
					value={table.getColumn(filter)?.getFilterValue() ?? ""}
					onChange={(event) =>
						table.getColumn(filter)?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
			</div>
			<div className="w-full overflow-hidden bg-white border border-gray-200 ">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="border-b-2! border-gray-200 bg-gray-50"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="px-4 py-3 font-semibold text-left text-gray-900 border-gray-100 border-x"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{(table.getRowModel().rows?.length &&
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="transition-colors border-b border-gray-100 hover:bg-gray-50/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className="border-x border-gray-100 py-3 px-4 border-b! "
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))) ||
							(loading && (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 space-y-4 text-center text-gray-500"
									>
										{Array.from({ length: 6 }).map((_, index) => (
											<Skeleton
												className="w-full h-10 rounded-none"
												key={index}
											/>
										))}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end py-4 space-x-2">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
