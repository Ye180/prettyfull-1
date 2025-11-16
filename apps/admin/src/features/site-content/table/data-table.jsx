"use client";
import { DataTable } from "@/shared/component/data-table";
import { useGetProducts } from "../api/get-product";
import { columns } from "./columns";

const DataTableProducts = () => {
	const { data: products } = useGetProducts({
		// paginationParams: {
		page: 1,
		limit: 10,
		// },
	});

	return (
		<DataTable
			columns={columns}
			data={products?.products || []}
			filter="name"
			labelFiltre="nom du produit"
		/>
	);
};

export default DataTableProducts;
