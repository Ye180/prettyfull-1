import DT from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import DataTable from "datatables.net-react";
import "flag-icons/css/flag-icons.min.css";
import { Fragment, useEffect, useState } from "react";
import useHostname from "../Provider/HostnameProvider";

DataTable.use(DT);

const DataCustomerTable = ({
	data = [],
	info = false,
	paging = false,
	searching = false,
	lengthChange = false,
	searchTerm = "",
}) => {
	const originalUrl = useHostname();

	const [selectedRows, setSelectedRows] = useState([]); // State untuk baris yang dipilih
	const [allSelected, setAllSelected] = useState(false); // State untuk checkbox Select All

	function formatAngka(angka) {
		let strAngka = angka.toString();
		if (strAngka.length > 3) {
			return "..." + strAngka.slice(-3);
		}
		return strAngka; // Jika angka kurang dari 3 digit, tidak perlu dipotong
	}
	function formatEmail(email) {
		let [username, domain] = email.split("@");
		if (domain) {
			return "..." + "@" + domain;
		}
		return email; // Jika tidak sesuai format email
	}

	const columns = [
		{
			title:
				'<input type="checkbox" id="select-all-checkbox" class="w-5 h-5 border border-Mgray400 rounded-sm" />', // Render Select All checkbox as HTML string
			data: null,
			render: function (row) {
				return `<input type="checkbox" class="row-checkbox w-5 h-5 border border-Mgray400 rounded-sm" data-id="${row.id}" />`; // Render checkbox in each row (tbody)
			},
			orderable: false,
		},
		{
			title: "CUSTOMER",
			data: "customer",
			render: function (data) {
				return `
        <div class="flex items-center gap-2">
          <img src="${data.img}" class="w-9 h-9 rounded-full object-cover" alt="" />
          <div class="">
            <h5 class="font-medium text__14">${data.name}</h5>
            <p class="text__12 text-Mtexttextsecondary">${data.email}</p>
          </div>
        </div>
      `;
			},
		},
		{
			title: "CUSTOMER ID",
			data: "customer_id",
			render: function (data) {
				return `<p class="text__14 text-left">${data}</p>`;
			},
		},
		{
			title: "COUNTRY",
			data: "country",
			render: function (data) {
				return ` <div class="flex items-center gap-2 mb-2">
                    <img src="/api/flags/${data}" alt="US Flag" class='w-6 h-6 rounded-full relative object-cover' />
                    <p class='font-medium text__14'>${data}</p>
                </div>`;
			},
		},
		{
			title: "ORDER",
			data: "order",
			render: function (data) {
				return `<p class="text__14">${data}</p>`;
			},
		},
		{
			title: "TOTAL SPEND",
			data: "total_spend",
			render: function (data) {
				return `<p class="text__14 text-left">${data}</p>`;
			},
		},
	];

	// Effect to sync row checkboxes with the selectedRows state
	useEffect(() => {
		const rowCheckboxes = document.querySelectorAll(".row-checkbox");

		// Sync each checkbox with the selectedRows state
		rowCheckboxes.forEach((checkbox) => {
			const rowId = parseInt(checkbox.getAttribute("data-id"), 10);
			checkbox.checked = selectedRows.includes(rowId); // Set the checked property based on the state
		});
	}, [selectedRows]);

	useEffect(() => {
		const selectAllCheckbox = document.getElementById("select-all-checkbox");

		const handleSelectAll = () => {
			if (selectAllCheckbox.checked) {
				setSelectedRows(data.map((row) => row.id)); // Select all rows if Select All is checked
			} else {
				setSelectedRows([]); // Deselect all rows if Select All is unchecked
			}
		};

		selectAllCheckbox.addEventListener("change", handleSelectAll);

		return () => {
			selectAllCheckbox.removeEventListener("change", handleSelectAll); // Cleanup event listener
		};
	}, [data]);

	const handleRowSelect = (rowId) => {
		setSelectedRows(
			(prevSelected) =>
				prevSelected.includes(rowId)
					? prevSelected.filter((id) => id !== rowId) // Unselect row if already selected
					: [...prevSelected, rowId] // Select row if not already selected
		);
	};

	// Filtered data based on search term
	const filteredData = data.filter(
		(item) =>
			String(item.customer.name)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			String(item.customer.email)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			String(item.country).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.order).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.total_spend).toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<Fragment>
			<div className="w-full overflow-auto">
				<div className="w-[1400px] xl:w-full">
					<div className="tableWrapCustom noneClick">
						<DataTable
							className="TableCustom"
							data={filteredData}
							columns={columns}
							options={{
								paging: paging, // Disable pagination
								searching: searching, // Disable the search bar
								info: info, // Disable "Showing X to Y of Z entries"
								lengthChange: lengthChange,
							}}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default DataCustomerTable;
