import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Container, Form, Modal } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const ModalTwoFactor = ({ onHideClick, title, ...props }) => {
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
			{/* Modal */}
			<Modal {...props}>
				<Modal.Body>
					<div className="border-b border-Mborderborderprimary p-3">
						<Container>
							<div className="flex items-center justify-between">
								<h4 className="font-semibold text__20">{title}</h4>
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
						<div className="text-center mb-4">
							<h2 className="font-semibold text__24 mb-1">
								Enable One Time Password
							</h2>
							<p className="text__16 text-Mtexttextsecondary">
								Verify Your Mobile Number for SMS
							</p>
						</div>

						<Form.Group controlId="exampleForm.ControlInput1">
							<Form.Label className="font-normal text__14 text-[#A3A3A3]">
								Phone Number
							</Form.Label>

							<div className="px-3 border border-Mborderborderprimary rounded-lg flex items-center gap-2">
								<div className="relative">
									<div
										className="flex items-center px-2 py-1 rounded-full bg-[#F9FAFB] cursor-pointer"
										onClick={() => setToogleSelectRegion(!ToogleSelectRegion)}
									>
										<img
											src={selectedCountry?.flag}
											className="w-5 h-5 rounded-full object-cover"
											alt=""
										/>
										<img src={originalUrl + "/images/dfgdfg.svg"} alt="" />
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

						<div className="mt-4 flex items-center gap-2 justify-end">
							<div
								onClick={onHideClick}
								className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Msurfacesurfacesecondary text-Mmaincolorgreen"
							>
								<p className="font-medium text__14">Cancel</p>
							</div>
							<div
								onClick={onHideClick}
								className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Mmaincolorgreen text-white"
							>
								<p className="font-medium text__14">Submit</p>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{/* Modal */}
		</Fragment>
	);
};

export default ModalTwoFactor;
