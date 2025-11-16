import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import DataTableOrders from "@/features/orders/table/data-table";
import "flag-icons/css/flag-icons.min.css";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Container } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const Order = () => {
	const originalUrl = useHostname();

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
							className="inline-block px-3 py-2 text-white bg-black rounded-lg"
						>
							<div className="flex items-center gap-2">
								<ReactSVG src={originalUrl + "/images/export.svg"} />
								<Link
									className="flex items-center gap-2 py-1 font-semibold text-white text__14"
									href="/add-category"
								>
									Export
								</Link>
							</div>
						</a>
					</div>
				</SecTop>

				<section className="pt-0 pb-4">
					<Container className="py-8 ">
						<DataTableOrders />
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Order;
