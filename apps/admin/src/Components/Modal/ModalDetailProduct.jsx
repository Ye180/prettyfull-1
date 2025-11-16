import { Fragment } from "react";
import { Col, Container, Modal, Row } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const ModalDetailProduct = ({ onHideClick, ...props }) => {
	const originalUrl = useHostname();
	return (
		<Fragment>
			{/* Modal */}
			<Modal {...props}>
				<Modal.Body>
					<div className="border-b border-Mborderborderprimary p-3">
						<Container>
							<div className="flex items-center justify-between py-2">
								<h4 className="font-semibold text__20">Order Details</h4>
								<img
									className="cursor-pointer"
									onClick={onHideClick}
									src={originalUrl + "/images/asdas.svg"}
									alt=""
								/>
							</div>
						</Container>
					</div>
					<div className="p-4">
						<Row className="gap-y-4">
							<Col md={6}>
								<h5 className="font-medium text__18 mb-3">Customer Details</h5>
								<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
									<div className="flex items-center gap-2">
										<img
											src={originalUrl + "/images/sdasd.png"}
											className="w-12 h-12 rounded-full object-cover"
											alt=""
										/>
										<div className="">
											<h5 className="font-medium text__16">Ahmad Lipshutz</h5>
											<p className="text__14 text-Mtexttextsecondary">
												Customer ID: #345918
											</p>
										</div>
									</div>
									<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
										<h5 className="font-medium text__16">3 Orders</h5>

										<div className="flex items-center gap-2">
											<img
												src={originalUrl + "/images/itm (3).png"}
												className="w-20 h-20 overflow-hidden rounded-md"
												alt=""
											/>
											<div className="grid grid-cols-1 gap-y-1">
												<h4 className="font-medium text__16">
													Air Jordan 1 Retro High OG
												</h4>
												<h4 className="font-medium text__16">$124</h4>

												<div className="flex items-center gap-2 ss:gap-3 flex-wrap ss:flex-nowrap">
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Qty:
														</p>
														<p className="text__14">1</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Size:
														</p>
														<p className="text__14">US 45</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Color:
														</p>
														<p className="text__14">Black</p>
													</div>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<img
												src={originalUrl + "/images/itm (1).png"}
												className="w-20 h-20 overflow-hidden rounded-md"
												alt=""
											/>
											<div className="grid grid-cols-1 gap-y-1">
												<h4 className="font-medium text__16">
													Air Jordan 1 Retro
												</h4>
												<h4 className="font-medium text__16">$130</h4>

												<div className="flex items-center gap-2 ss:gap-3 flex-wrap ss:flex-nowrap">
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Qty:
														</p>
														<p className="text__14">1</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Size:
														</p>
														<p className="text__14">US 45</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Color:
														</p>
														<p className="text__14">Black</p>
													</div>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<img
												src={originalUrl + "/images/itm (2).png"}
												className="w-20 h-20 overflow-hidden rounded-md"
												alt=""
											/>
											<div className="grid grid-cols-1 gap-y-1">
												<h4 className="font-medium text__16">
													Air Jordan 1 Retro
												</h4>
												<h4 className="font-medium text__16">$130</h4>

												<div className="flex items-center gap-2 ss:gap-3 flex-wrap ss:flex-nowrap">
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Qty:
														</p>
														<p className="text__14">1</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Size:
														</p>
														<p className="text__14">US 45</p>
													</div>
													<div className="flex items-center gap-1">
														<p className="text__14 text-Mtexttextinvert">
															Color:
														</p>
														<p className="text__14">Black</p>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="w-full p-3 border border-Mborderborderprimary rounded-xl flex items-center justify-between">
										<div className="flex items-center gap-2">
											<h5 className="font-medium text__16">FedEx</h5>
											<p className="text__16 text-Mtexttextsecondary">
												(First class package)
											</p>
										</div>
										<h5 className="font-medium text__16">$12.00</h5>
									</div>
									<div className="w-full p-3 border border-Mborderborderprimary rounded-xl">
										<div className="grid grid-cols-1 gap-2">
											<h5 className="font-medium text__16">Payment Summary</h5>
											<div className="flex items-center justify-between">
												<p className="text__16 text-Mtexttextsecondary">
													Subtotal (3 items)
												</p>
												<h5 className="font-medium text__16">$388.00</h5>
											</div>
											<div className="flex items-center justify-between">
												<p className="text__16 text-Mtexttextsecondary">
													Delivery
												</p>
												<h5 className="font-medium text__16">$12.00</h5>
											</div>
											<div className="flex items-center justify-between">
												<p className="text__16 text-Mtexttextsecondary">Tax</p>
												<h5 className="font-medium text__16">$00.00</h5>
											</div>
											<div className="w-full h-px bg-Mborderborderprimary"></div>
											<div className="flex items-center justify-between">
												<p className="text__16 text-Mtexttextsecondary">
													Total
												</p>
												<h5 className="font-medium text__16">$400.00</h5>
											</div>
										</div>
									</div>
								</div>
							</Col>
							<Col md={6}>
								<div className="grid grid-cols-1 gap-3">
									<h5 className="font-medium text__18">Delivery</h5>
									<div className="w-full p-3 border border-Mborderborderprimary rounded-xl flex items-center justify-between">
										<Row className="gap-y-4">
											<Col md={6}>
												<div className="grid grid-cols-1 gap-3">
													<h5 className="font-medium text__18 ">Delivery</h5>
													<div className="flex items-center gap-2">
														<img
															src={originalUrl + "/images/EnvelopeSimple.svg"}
															alt=""
														/>
														<p className="text__14 shrink-0">
															ahmadlipshutz@gmail.com
														</p>
													</div>
													<div className="flex items-center gap-2">
														<img
															src={originalUrl + "/images/Phone.svg"}
															alt=""
														/>
														<p className="text__14 shrink-0">+1 234 532 1332</p>
													</div>
												</div>
											</Col>
											<Col md={6}>
												<div className="grid grid-cols-1 gap-3">
													<h5 className="font-medium text__18 ">
														Shipping Address
													</h5>
													<p className="text__14">Ahmad Lipshutz</p>
													<p className="text__14">
														14554 Friesen Pine Apt. 843
													</p>
													<p className="text__14">Lake Ferneville</p>
													<p className="text__14">78464-4849</p>
													<p className="text__14">United States</p>
												</div>
											</Col>
										</Row>
									</div>

									<h5 className="font-medium text__18">Shipping Activity</h5>
									<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-col-1 gap-8 relative stepShipping">
										{/* status: done, current, ongoing */}
										{[
											{
												title: "Order was placed (Order ID: #32543)",
												subtitle: "Pick-up scheduled with courier",
												date: "Thursday 11:29 AM",
												status: "done",
											},
											{
												title: "Pick-up",
												subtitle: "Pick-up scheduled with courier",
												date: "Wednesday 11:29 AM",
												status: "done",
											},
											{
												title: "Dispatched",
												subtitle: "tem has been picked up by courier",
												date: "Thursday 11:29 AM",
												status: "done",
											},
											{
												title: "Package arrived",
												subtitle: "Package arrived at an Amazon facility, NY",
												date: "Saturday 15:20 AM",
												status: "done",
											},
											{
												title: "Dispatched for delivery",
												subtitle: "Package has left an Amazon facility, NY",
												date: "Today 14:12 PM",
												status: "current",
											},
											{
												title: "Delivery",
												subtitle: "Package will be delivered by tomorrow",
												date: "",
												status: "ongoing",
											},
										].map((obj) => {
											return (
												<div className="flex gap-3 w-full">
													<div className="relative">
														<div className="absolute top-[1.72rem] left-1/2 -translate-x-1/2 bg-Mborderborderprimary h-[98%] w-0.5 rounded-full lineStep"></div>
														{obj.status == "current" ? (
															<img
																src={originalUrl + "/images/st(3).svg"}
																alt=""
																className="relative  z-1"
															/>
														) : obj.status == "done" ? (
															<img
																src={originalUrl + "/images/st(1).svg"}
																alt=""
																className="relative  z-1"
															/>
														) : (
															<img
																src={originalUrl + "/images/st(2).svg"}
																alt=""
																className="relative  z-1"
															/>
														)}
													</div>
													<div className="flex justify-between w-full">
														<div className="">
															<h4 className="font-semibold text__16">
																{obj.title}
															</h4>
															<p className="text__14 text-Mtexttextsecondary">
																{obj.subtitle}
															</p>
														</div>
														<p className="text__12 text-Mtexttextsecondary">
															{obj.date}
														</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</Col>
						</Row>
					</div>
				</Modal.Body>
			</Modal>
			{/* Modal */}
		</Fragment>
	);
};

export default ModalDetailProduct;
