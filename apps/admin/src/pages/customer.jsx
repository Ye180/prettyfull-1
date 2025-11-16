import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableCustomers from "@/features/customer/table/data-table";
import "flag-icons/css/flag-icons.min.css";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";

const Customer = () => {
	const originalUrl = useHostname();

	const [searchTerm, setSearchTerm] = useState("");

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	return (
		<Fragment>
			<Layout title="Customer" description="Customer Desc" dashboard={true}>
				{/* <ModalAddCustomer
					title={"Add Customer"}
					onHideClick={handleClose}
					show={show}
					onHide={handleClose}
					dialogClassName="md:mr-0 warpContent custom-min-h"
					size="md"
				/> */}

				<SecTop
					title="Liste des consommateurs"
					subtitle={
						"Suivi des commandes des consommateurs dans votre boutique."
					}
				></SecTop>

				<section className="pt-0 pb-4">
					<Container className="py-8 ">
						<DataTableCustomers />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Customer;
