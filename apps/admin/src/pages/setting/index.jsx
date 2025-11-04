import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import SecTop from "@/Components/Section/SecTop";
import Checkout from "@/Components/Setting/Checkout";
import Location from "@/Components/Setting/Location";
import Notification from "@/Components/Setting/Notification";
import PaymentMethod from "@/Components/Setting/PaymentMethod";
import StoreDetail from "@/Components/Setting/StoreDetail";
import { Fragment, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { ReactSVG } from "react-svg";

const Index = () => {
	const originalUrl = useHostname();

	const [SelectMenu, setSelectMenu] = useState("Store Details");

	return (
		<Fragment>
			<Layout title="Setting" description="Setting Desc" dashboard={true}>
				<SecTop
					title="Settings"
					subtitle={"Track orders list across your store."}
				/>

				<section className="pt-0 pb-4">
					<Container>
						<Row className="gap-y-4">
							<Col md={5} xl={4}>
								<div className="w-full md:grid grid-cols-1 gap-1 hidden">
									{[
										{
											icon: originalUrl + "/images/Storefront.svg",
											name: "Store Details",
										},
										{
											icon: originalUrl + "/images/CreditCard.svg",
											name: "Payment Method",
										},
										{
											icon: originalUrl + "/images/ShoppingCart.svg",
											name: "Checkout",
										},
										{
											icon: originalUrl + "/images/MapPin.svg",
											name: "Location",
										},
										{
											icon: originalUrl + "/images/BellRinging.svg",
											name: "Notification",
										},
									].map((obj) => {
										return (
											<Fragment>
												<div
													className={
														"px-3 py-3 flex items-center justify-between cursor-pointer rounded-xl " +
														(SelectMenu == obj.name
															? "text-Msurfacesurfacebrand bg-[#F2F8F5]"
															: "text-Mtexttextsecondary")
													}
													onClick={() => setSelectMenu(obj.name)}
												>
													<div className="flex items-center gap-2">
														<ReactSVG src={obj.icon} />
														<h5 className="font-medium text__16">{obj.name}</h5>
													</div>
													<ReactSVG
														src={originalUrl + "/images/CaretRight.svg"}
														className={
															"transition-all duration-300 " +
															(SelectMenu == obj.name
																? "opacity-100"
																: "opacity-0")
														}
													/>
												</div>
											</Fragment>
										);
									})}
								</div>

								<Form.Select
									value={SelectMenu}
									onChange={(e) => setSelectMenu(e.target.value)}
									type="text"
									placeholder="Select Menu"
									className="font-medium text__14 bg-transparent h-[54px] rounded-xl px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent md:hidden"
								>
									{[
										{
											icon: originalUrl + "/images/Storefront.svg",
											name: "Store Details",
										},
										{
											icon: originalUrl + "/images/CreditCard.svg",
											name: "Payment Method",
										},
										{
											icon: originalUrl + "/images/ShoppingCart.svg",
											name: "Checkout",
										},
										{
											icon: originalUrl + "/images/MapPin.svg",
											name: "Location",
										},
										{
											icon: originalUrl + "/images/BellRinging.svg",
											name: "Notification",
										},
									].map((obj) => {
										return (
											<option
												selected={SelectMenu == obj.name ? true : false}
												value={obj.name}
											>
												{obj.name}
											</option>
										);
									})}
								</Form.Select>
							</Col>
							<Col md={7} xl={8}>
								{SelectMenu == "Store Details" ? <StoreDetail /> : ""}
								{SelectMenu == "Payment Method" ? <PaymentMethod /> : ""}
								{SelectMenu == "Checkout" ? <Checkout /> : ""}
								{SelectMenu == "Location" ? <Location /> : ""}
								{SelectMenu == "Notification" ? <Notification /> : ""}
							</Col>
						</Row>
					</Container>
				</section>
			</Layout>
		</Fragment>
	);
};

export default Index;
