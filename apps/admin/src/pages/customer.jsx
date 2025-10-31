import Layout from "@/Components/Layout/Layout";
import ModalAddCustomer from "@/Components/Modal/ModalAddCustomer";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableCustomers from "@/features/customer/table/data-table";
import "flag-icons/css/flag-icons.min.css";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const Customer = () => {
	const originalUrl = useHostname();

	const dataTable = [
		{
			id: 1,
			customer_id: "#345918",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ahmad Lipshutz",
				email: "ahmadlipshutz@gmail.com",
			},
			country: "United States",
			order: "534",
			total_spend: "$2,837.90",
		},
		{
			id: 2,
			customer_id: "#345817",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Kadin Kenter",
				email: "kadinkenter@gmail.com",
			},
			country: "Brazil",
			order: "531",
			total_spend: "$2,463.90",
		},
		{
			id: 3,
			customer_id: "#345716",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ryan Mango",
				email: "ryanmango@gmail.com",
			},
			country: "India",
			order: "432",
			total_spend: "#$2,1O2.90",
		},
		{
			id: 4,
			customer_id: "#345615",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Charlie Botosh",
				email: "charliebotosh@gmail.com",
			},
			country: "United States",
			order: "411",
			total_spend: "#$1,566.90",
		},
		{
			id: 5,
			customer_id: "#345614",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Phillip Culhane",
				email: "phillipculhane@gmail.com",
			},
			country: "India",
			order: "321",
			total_spend: "#$1,342.90",
		},
		{
			id: 6,
			customer_id: "#345613",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Adison Schleifer",
				email: "adisonschleifer@gmail.com",
			},
			country: "Australia",
			order: "209",
			total_spend: "#$1,12.90",
		},
		{
			id: 7,
			customer_id: "#345612",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Giana Aminoff",
				email: "gianaaminoff@gmail.com",
			},
			country: "France",
			order: "310",
			total_spend: "#$1,023.90",
		},
	];

	const [searchTerm, setSearchTerm] = useState("");

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<Fragment>
			<Layout title="Customer" description="Customer Desc" dashboard={true}>
				<ModalAddCustomer
					title={"Add Customer"}
					onHideClick={handleClose}
					show={show}
					onHide={handleClose}
					dialogClassName="md:mr-0 warpContent custom-min-h"
					size="md"
				/>

				<SecTop
					title="Customer List"
					subtitle={"Track orders list across your store."}
				>
					<div className="flex items-center gap-3">
						<a
							href="#!"
							className="inline-block px-3 py-2 rounded-lg bg-Msurfacesurfacesecondary text-Mmaincolorgreen"
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/export.svg"} />
								<p className="font-medium text__14">Export</p>
							</div>
						</a>
						<div
							onClick={handleShow}
							className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-black text-white"
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/pluss.svg"} />
								<p className="font-medium text__14">Add Customer</p>
							</div>
						</div>
					</div>
				</SecTop>
				{/* 
				<section className="pt-0 pb-4">
					<Container>
						<div className="flex items-center gap-2 px-2 mb-4 w-full">
							<img src={originalUrl + "/images/search.svg"} alt="" />
							<input
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								type="text"
								className="font-medium w-full text__14 placeholder:text-Mtexttextinvert bg-transparent border-none outline-hidden hover:focus:active:outline-hidden hover:focus:active:border-none"
								placeholder="Search order..."
							/>
						</div>

						<DataCustomerTable
							data={dataTable}
							searchTerm={searchTerm}
							paging={true}
							info={true}
						/>
					</Container>
				</section> */}

				<section className="pt-0 pb-4">
					<Container className=" py-8 ">
						<DataTableCustomers />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Customer;
