import Layout from "@/Components/Layout/Layout";
import useHostname from "@/Components/Provider/HostnameProvider";
import axios from "axios";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

const Verification = () => {
	const originalUrl = useHostname();

	const [countryData, setCountryData] = useState([]);
	const [ToogleSelectRegion, setToogleSelectRegion] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(null);

	useEffect(() => {
		const fetchCountryData = async () => {
			try {
				const response = await axios.get("https://restcountries.com/v3.1/all");
				const data = response.data.map((country) => ({
					value: country.cca2,
					label: country.name.common,
					codePhone: `+${country.ccn3}`,
					flag: country.flags.png,
				}));

				setSelectedCountry({
					value: response.data[0].cca2,
					label: response.data[0].name.common,
					codePhone: `+${response.data[0].ccn3}`,
					flag: response.data[0].flags.png,
				});
				setCountryData(data);
			} catch (error) {
				console.error("Error fetching country data:", error);
			}
		};

		fetchCountryData();
	}, []);

	return (
		<Fragment>
			<Layout
				navbar={false}
				footer={false}
				title="Shotify - Verification"
				description="Shotify - Verification Desc"
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
											<div className="px-4 pb-4 flex justify-end border-b border-Mborderborderprimary">
												<Link href={"/auth/v2/register"}>
													<img
														src={originalUrl + "/images/X.svg"}
														className=""
														alt=""
													/>
												</Link>
											</div>
											<div className="px-4 pt-4">
												<div className="mb-10 text-center">
													<h4 className="font-semibold text__24">
														Verification
													</h4>
													<p className="text__16 text-Mtexttextsecondary">
														Enter your mobile number to receive an SMS <br />{" "}
														verification code
													</p>
												</div>

												<Form.Group
													className="mb-6"
													controlId="exampleForm.ControlInput1"
												>
													<Form.Label className="font-normal text__14 text-[#A3A3A3]">
														Phone Number
													</Form.Label>

													<div className="px-3 border border-Mborderborderprimary rounded-lg flex items-center gap-2">
														<div className="relative">
															<div
																className="flex items-center px-2 py-1 rounded-full bg-[#F9FAFB] cursor-pointer"
																onClick={() =>
																	setToogleSelectRegion(!ToogleSelectRegion)
																}
															>
																<img
																	src={selectedCountry?.flag}
																	className="w-5 h-5 rounded-full object-cover"
																	alt=""
																/>
																<img src="./../images/dfgdfg.svg" alt="" />
															</div>

															<div
																className={
																	"absolute left-0 rounded-md w-[200px] p-3 bg-white shadow-[0px_30px_50px_#0000002e] flex items-start flex-wrap gap-3 max-h-[200px] overflow-auto transition-all duration-300 " +
																	(ToogleSelectRegion
																		? "top-[2.3rem] opacity-100 pointer-events-auto"
																		: "top-16 opacity-0 pointer-events-none")
																}
															>
																{countryData?.map((obj) => {
																	return (
																		<Fragment>
																			<div
																				className="w-full flex items-center gap-2 cursor-pointer"
																				onClick={() => {
																					setSelectedCountry({
																						value: obj.value,
																						label: obj.label,
																						codePhone: obj.codePhone,
																						flag: obj.flag,
																					});
																				}}
																			>
																				<img
																					src={obj?.flag}
																					className="w-5 h-5 rounded-full object-cover"
																					alt=""
																				/>

																				<span className="text__14">
																					{obj?.label}{" "}
																					<span className="font-medium">
																						{obj?.codePhone}
																					</span>
																				</span>
																			</div>
																		</Fragment>
																	);
																})}
															</div>
														</div>
														<div className="flex items-center gap-1">
															<span className="font-medium text__14 text-MTextSecondery">
																{selectedCountry?.codePhone}
															</span>
															<Form.Control
																type="email"
																placeholder="2345 678 4321"
																className="font-medium text__14 h-[54px] rounded-lg px-0 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-none focus:border-none focus:bg-transparent bg-transparent placeholder:text-[#A3A3A3]"
															/>
														</div>
													</div>
												</Form.Group>

												<Link
													href="/auth/v2/confirm"
													className="rounded-xl inline-block text-center font-medium text__16 text-white py-[15px]! bg-Mmaincolorgreen border-Mmbg-Mmaincolorgreen btnClass w-full cursor-pointer"
												>
													Send Code
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

export default Verification;
