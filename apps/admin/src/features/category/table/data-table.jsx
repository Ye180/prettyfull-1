"use client";
import { DataTable } from "@/shared/component/data-table";
import { useGetCategory } from "../api/get-category";
import { columns } from "./columns";

const DataTableCategory = () => {
	const { data: category, isLoading } = useGetCategory();

	return (
		<DataTable
			columns={columns}
			data={category || []}
			loading={isLoading}
			filter="name"
			labelFiltre="nom de la catégorie"
		/>
	);
};

export default DataTableCategory;
