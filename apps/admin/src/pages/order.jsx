import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableOrders from "@/features/orders/table/data-table";
import "flag-icons/css/flag-icons.min.css";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const Order = () => {
	const originalUrl = useHostname();

	const dataTable = [
		{
			id: 1,
			order: "#345918",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ahmad Lipshutz",
				email: "ahmadlipshutz@gmail.com",
			},
			payment: "Successful",
			status: "Scheduled",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 2,
			order: "#345817",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Kadin Kenter",
				email: "kadinkenter@gmail.com",
			},
			payment: "Successful",
			status: "Scheduled",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "kadinkenter@gmail.com",
			},
		},
		{
			id: 3,
			order: "#345716",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ryan Mango",
				email: "ryanmango@gmail.com",
			},
			payment: "Successful",
			status: "Cancel",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 4,
			order: "#345615",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Charlie Botosh",
				email: "charliebotosh@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "charliebotosh@gmail.com",
			},
		},
		{
			id: 5,
			order: "#345614",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Phillip Culhane",
				email: "phillipculhane@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "phillipculhane@gmail.com",
			},
		},
		{
			id: 6,
			order: "#345613",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Adison Schleifer",
				email: "adisonschleifer@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 7,
			order: "#345612",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Giana Aminoff",
				email: "gianaaminoff@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "gianaaminoff@gmail.com",
			},
		},
		{
			id: 8,
			order: "#345918",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ahmad Lipshutz",
				email: "ahmadlipshutz@gmail.com",
			},
			payment: "Successful",
			status: "Scheduled",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 9,
			order: "#345817",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Kadin Kenter",
				email: "kadinkenter@gmail.com",
			},
			payment: "Successful",
			status: "Scheduled",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "kadinkenter@gmail.com",
			},
		},
		{
			id: 10,
			order: "#345716",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Ryan Mango",
				email: "ryanmango@gmail.com",
			},
			payment: "Successful",
			status: "Cancel",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 11,
			order: "#345615",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Charlie Botosh",
				email: "charliebotosh@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "charliebotosh@gmail.com",
			},
		},
		{
			id: 12,
			order: "#345614",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Phillip Culhane",
				email: "phillipculhane@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "phillipculhane@gmail.com",
			},
		},
		{
			id: 13,
			order: "#345613",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Adison Schleifer",
				email: "adisonschleifer@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_mastercard.png",
				type: "Credit Card",
				info: "12323453234",
			},
		},
		{
			id: 14,
			order: "#345612",
			date: "Apr 15, 2024, 10:21",
			customer: {
				img: originalUrl + "/images/sdasd.png", // Replace with actual image path
				name: "Giana Aminoff",
				email: "gianaaminoff@gmail.com",
			},
			payment: "Successful",
			status: "Delivered",
			method: {
				img: originalUrl + "/images/logos_paypal.png",
				type: "PayPal",
				info: "gianaaminoff@gmail.com",
			},
		},
	];

	const [searchTerm, setSearchTerm] = useState("");
	return (
		<Fragment>
			<Layout title="Order" description="Order Desc" dashboard={true}>
				<SecTop
					title="Liste des commandes"
					subtitle="Gérez les commandes de votre boutique."
				>
					<div className="flex items-center gap-3">
						<a
							href="#!"
							className="inline-block px-3 py-2 rounded-lg bg-black text-white"
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/export.svg"} />
								<p className="font-medium text__14">Export</p>
							</div>
						</a>
					</div>
				</SecTop>

				{/* <section className="pt-0 pb-4">
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

						<DataCustomTable
							data={dataTable}
							searchTerm={searchTerm}
							paging={true}
							info={true}
						/>
					</Container>
				</section> */}

				<section className="pt-0 pb-4">
					<Container className=" py-8 ">
						
						<DataTableOrders />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Order;
