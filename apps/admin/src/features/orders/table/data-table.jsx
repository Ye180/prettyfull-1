"use client";
import { DataTable } from "@/shared/component/data-table";
import { useGetOrders } from "../api/get-orders";
import { columns } from "./columns";

const DataTableOrders = () => {
	const { data: orders } = useGetOrders();

	return (
		<DataTable
			columns={columns}
			data={orders || []}
			filter="orderNumber"
			labelFiltre="numéro de commande"
		/>
	);
};

export default DataTableOrders;
