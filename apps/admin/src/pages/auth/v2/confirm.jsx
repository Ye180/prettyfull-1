import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const Confirm = () => {
	const originalUrl = useHostname();

	const [currencies] = useState([
		{
			name: "United States Dollar",
			symbol: "$",
			spell: "USD",
		},
		{
			name: "Indonesian Rupiah",
			symbol: "Rp",
			spell: "IDR",
		},
		{
			name: "Euro",
			symbol: "€",
			spell: "EUR",
		},
		{
			name: "Japanese Yen",
			symbol: "¥",
			spell: "JPY",
		},
		{
			name: "British Pound",
			symbol: "£",
			spell: "GBP",
		},
		{
			name: "Australian Dollar",
			symbol: "A$",
			spell: "AUD",
		},
		{
			name: "Canadian Dollar",
			symbol: "C$",
			spell: "CAD",
		},
		{
			name: "Swiss Franc",
			symbol: "CHF",
			spell: "CHF",
		},
		{
			name: "Chinese Yuan",
			symbol: "¥",
			spell: "CNY",
		},
		{
			name: "Singapore Dollar",
			symbol: "S$",
			spell: "SGD",
		},
		{
			name: "Malaysian Ringgit",
			symbol: "RM",
			spell: "MYR",
		},
		{
			name: "Thai Baht",
			symbol: "฿",
			spell: "THB",
		},
	]);
	return (
		<Fragment>
			<Layout
				navbar={false}
				footer={false}
				title="Shotify - Confirm"
				description="Shotify - Confirm Desc"
			>
				<div className="w-full min-h-dvh md:bg-white bg-Mmaincolorlightgreen">
					<Row className="min-h-dvh">
						<Col
							md={6}
							className="relative bg-Mmaincolorlightgreen md:block hidden"
						>
							<img
								src={originalUrl + "/images/safds.png"}
								className="absolute w-full h-full right-0 bottom-0 object-top-right object-cover"
								alt=""
							/>
						</Col>
						<Col md={6}>
							<div className="relative min-h-dvh ">
								<Container className="min-h-dvh w-full flex items-center justify-center">
									<div className="w-full py-6 xl:px-10">
										<div className="bg-white p-4 rounded-xl">
											<div className="px-4 pb-4 flex justify-start border-b border-Mborderborderprimary">
												<Link
													href={"/auth/v2/verification"}
													className="flex items-center gap-2"
												>
													<img
														src={originalUrl + "/images/ArrowLeft.svg"}
														className=""
														alt=""
													/>
													<p className="tewxt__16 text-Msurfacesurfacebrand">
														Back
													</p>
												</Link>
											</div>
											<div className="px-4 pt-4">
												<div className="mb-10 text-center">
													<h4 className="font-semibold text__24">
														Setup your store
													</h4>
													<p className="text__16 text-Mtexttextsecondary">
														If you’re still figuring it out, you can skip this
														now
													</p>
												</div>

												<Form.Group
													className="mb-3"
													controlId="exampleForm.ControlInput1"
												>
													<Form.Label className="font-normal text__14 text-[#A3A3A3]">
														Store Name
													</Form.Label>
													<Form.Control
														type="email"
														placeholder="Enter your Store Name"
														className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
													/>
												</Form.Group>

												<Form.Group
													className="mb-3"
													controlId="exampleForm.ControlInput1"
												>
													<Form.Label className="font-normal text__14 text-[#A3A3A3]">
														Store Currency
													</Form.Label>

													<Form.Select
														aria-label="Default select example"
														className="font-medium text__14 bg-transparent h-[54px] rounded-llg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
													>
														{currencies.map((obj) => {
															return (
																<option value={obj.spell}>{obj.spell}</option>
															);
														})}
													</Form.Select>
												</Form.Group>

												<Link
													href="/"
													className="rounded-xl inline-block text-center font-medium text__16 text-white py-[15px]! bg-Mmaincolorgreen border-Mmbg-Mmaincolorgreen btnClass w-full cursor-pointer"
												>
													Continue
												</Link>
											</div>
										</div>
									</div>
								</Container>
							</div>
						</Col>
					</Row>
				</div>
			</Layout>
		</Fragment>
	);
};

export default Confirm;
