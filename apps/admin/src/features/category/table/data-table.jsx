"use client";
import { DataTable } from "@/shared/component/data-table";
import { useGetCategory } from "../api/get-category";
import { columns } from "./columns";

const DataTableCategory = () => {
	const { data: category } = useGetCategory();

	return (
		<DataTable
			columns={columns}
			data={category || []}
			filter="name"
			labelFiltre="nom de la catégorie"
		/>
	);
};

export default DataTableCategory;
