import DT from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import DataTable from "datatables.net-react";
import $ from "jquery";
import { Fragment, useEffect, useState } from "react";
import ModalDetailProduct from "../Modal/ModalDetailProduct";
import useHostname from "../Provider/HostnameProvider";

DataTable.use(DT);

const DataCustomTable = ({
	data = [],
	info = false,
	paging = false,
	searching = false,
	lengthChange = false,
	searchTerm = "",
}) => {
	const originalUrl = useHostname();

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

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
		{ title: "ORDER", data: "order" },
		{ title: "DATE", data: "date" },
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
			title: "PAYMENT",
			data: "payment",
			render: function (data) {
				return data == "Successful"
					? `
        <div class="flex items-center gap-2 text-Malertssucces">
        <div class="w-1.5 h-1.5 rounded-full bg-Malertssucces"></div>
        <p class="text__14">${data}</p>
        </div>
      `
					: `<div class="flex items-center gap-2 text-Malertserror">
        <div class="w-1.5 h-1.5 rounded-full bg-Malertserror"></div>
        <p class="text__14">${data}</p>
        </div>`;
			},
		},
		{
			title: "STATUS",
			data: "status",
			render: function (data) {
				return data == "Scheduled"
					? `<div class="text__14 text-Malertswarning px-2 py-2 inline-block rounded-sm border border-[#FFF5CC]! bg-[#FFFAE5]">${data}</div>`
					: data == "Cancel"
					? `<div class="text__14 text-Malertserror px-2 py-2 inline-block rounded-sm border border-[#FFEBEA]! bg-[#FFEFEE]">${data}</div>`
					: `
        <div class="text__14 text-Malertssucces px-2 py-2 inline-block rounded-sm border border-[#D6F4DE]! bg-[#EFFBF2]">${data}</div>
      `;
			},
		},
		{
			title: "METHOD",
			data: "method",
			render: function (data) {
				return data.type == "PayPal"
					? `
        <div class="flex items-center gap-2">
          <img src="${data.img}" class="w-6" alt="" />
          <p class="text__14 text-Mtexttextsecondary">${formatEmail(
						data.info
					)}</p>
        </div>`
					: ` <div class="flex items-center gap-2">
          <img src="${data.img}" class="w-6" alt="" />
          <p class="text__14 text-Mtexttextsecondary">${formatAngka(
						data.info
					)}</p>
        </div>`;
			},
		},
		{
			title: "ACTIONS",
			data: null,
			render: function (row) {
				return `<div class="w-full text-center">
        <img src="${originalUrl}/images/DotsThreeVertical.svg" class="mx-auto" alt="" />
        </div>`;
			},
			orderable: false,
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
			String(item.order).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.date).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.customer.name)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			String(item.customer.email)
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			String(item.payment).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.status).toLowerCase().includes(searchTerm.toLowerCase()) ||
			String(item.method.type).toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleRowClick = (data) => {
		handleShow(); // Ensure handleShow is defined to show a popup or handle the row click in another way
	};

	return (
		<Fragment>
			<ModalDetailProduct
				onHideClick={handleClose}
				show={show}
				onHide={handleClose}
				dialogClassName="xl:mr-0 warpContent custom-width-modal"
			/>

			<div className="w-full overflow-auto">
				<div className="w-[1400px] xl:w-full">
					<div className="tableWrapCustom">
						<DataTable
							className="TableCustom"
							data={filteredData}
							columns={columns}
							options={{
								paging: paging, // Disable pagination
								searching: searching, // Disable the search bar
								info: info, // Disable "Showing X to Y of Z entries"
								lengthChange: lengthChange, // Disable "Entries per page" dropdown
								rowCallback: (row, data) => {
									$(row).on(
										"click",
										"td:not(:first-child):not(:last-child)",
										() => handleRowClick(data)
									);
								},
							}}
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default DataCustomTable;
