"use client";
import { DataTable } from "@/shared/component/data-table";
import { useGetCustomers } from "../api/get-customers";
import { columns } from "./columns";

const DataTableCustomers = () => {
	const { data: customers } = useGetCustomers();

	return (
		<DataTable
			columns={columns}
			data={customers || []}
			filter="name"
			labelFiltre="nom du client"
		/>
	);
};

export default DataTableCustomers;
