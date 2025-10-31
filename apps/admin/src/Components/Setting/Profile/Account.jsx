import useHostname from "@/Components/Provider/HostnameProvider";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

const Account = () => {
	const originalUrl = useHostname();

	const [countryData, setCountryData] = useState([]);
	const [ToogleSelectRegion, setToogleSelectRegion] = useState(false);
	const [selectedCountry, setSelectedCountry] = useState(null);

	const countries = [
		"Afghanistan",
		"Albania",
		"Algeria",
		"Andorra",
		"Angola",
		"Argentina",
		"Armenia",
		"Australia",
		"Austria",
		"Azerbaijan",
		"Bahamas",
		"Bahrain",
		"Bangladesh",
		"Barbados",
		"Belarus",
		"Belgium",
		"Belize",
		"Benin",
		"Bhutan",
		"Bolivia",
		"Bosnia and Herzegovina",
		"Botswana",
		"Brazil",
		"Brunei",
		"Bulgaria",
		"Burkina Faso",
		"Burundi",
		"Cambodia",
		"Cameroon",
		"Canada",
		"Cape Verde",
		"Central African Republic",
		"Chad",
		"Chile",
		"China",
		"Colombia",
		"Comoros",
		"Congo (Brazzaville)",
		"Congo (Kinshasa)",
		"Costa Rica",
		"Croatia",
		"Cuba",
		"Cyprus",
		"Czech Republic",
		"Denmark",
		"Djibouti",
		"Dominica",
		"Dominican Republic",
		"Ecuador",
		"Egypt",
		"El Salvador",
		"Equatorial Guinea",
		"Eritrea",
		"Estonia",
		"Eswatini",
		"Ethiopia",
		"Fiji",
		"Finland",
		"France",
		"Gabon",
		"Gambia",
		"Georgia",
		"Germany",
		"Ghana",
		"Greece",
		"Grenada",
		"Guatemala",
		"Guinea",
		"Guinea-Bissau",
		"Guyana",
		"Haiti",
		"Honduras",
		"Hungary",
		"Iceland",
		"India",
		"Indonesia",
		"Iran",
		"Iraq",
		"Ireland",
		"Israel",
		"Italy",
		"Jamaica",
		"Japan",
		"Jordan",
		"Kazakhstan",
		"Kenya",
		"Kiribati",
		"Korea (North)",
		"Korea (South)",
		"Kuwait",
		"Kyrgyzstan",
		"Laos",
		"Latvia",
		"Lebanon",
		"Lesotho",
		"Liberia",
		"Libya",
		"Liechtenstein",
		"Lithuania",
		"Luxembourg",
		"Madagascar",
		"Malawi",
		"Malaysia",
		"Maldives",
		"Mali",
		"Malta",
		"Marshall Islands",
		"Mauritania",
		"Mauritius",
		"Mexico",
		"Micronesia",
		"Moldova",
		"Monaco",
		"Mongolia",
		"Montenegro",
		"Morocco",
		"Mozambique",
		"Myanmar",
		"Namibia",
		"Nauru",
		"Nepal",
		"Netherlands",
		"New Zealand",
		"Nicaragua",
		"Niger",
		"Nigeria",
		"North Macedonia",
		"Norway",
		"Oman",
		"Pakistan",
		"Palau",
		"Panama",
		"Papua New Guinea",
		"Paraguay",
		"Peru",
		"Philippines",
		"Poland",
		"Portugal",
		"Qatar",
		"Romania",
		"Russia",
		"Rwanda",
		"Saint Kitts and Nevis",
		"Saint Lucia",
		"Saint Vincent and the Grenadines",
		"Samoa",
		"San Marino",
		"Sao Tome and Principe",
		"Saudi Arabia",
		"Senegal",
		"Serbia",
		"Seychelles",
		"Sierra Leone",
		"Singapore",
		"Slovakia",
		"Slovenia",
		"Solomon Islands",
		"Somalia",
		"South Africa",
		"Spain",
		"Sri Lanka",
		"Sudan",
		"Suriname",
		"Sweden",
		"Switzerland",
		"Syria",
		"Taiwan",
		"Tajikistan",
		"Tanzania",
		"Thailand",
		"Timor-Leste",
		"Togo",
		"Tonga",
		"Trinidad and Tobago",
		"Tunisia",
		"Turkey",
		"Turkmenistan",
		"Tuvalu",
		"Uganda",
		"Ukraine",
		"United Arab Emirates",
		"United Kingdom",
		"United States",
		"Uruguay",
		"Uzbekistan",
		"Vanuatu",
		"Vatican City",
		"Venezuela",
		"Vietnam",
		"Yemen",
		"Zambia",
		"Zimbabwe",
	];

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
			<div className="grid grid-cols-1 gap-4">
				<div className="grid grid-cols-1 gap-3">
					<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
						<Row className="gap-y-3">
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										First Name
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter First Name"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Last Name
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Last Name"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Email
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Email"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Phone
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
							</Col>
						</Row>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-3">
					<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
						<Row className="gap-y-3">
							<Col className="col-12">
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Address
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Address"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Town
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Town"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										State/Province
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter State/Province"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Post Code
									</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter Post Code"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									/>
								</Form.Group>
							</Col>
							<Col md={6}>
								<Form.Group controlId="exampleForm.ControlInput1">
									<Form.Label className="font-normal text__14 text-[#A3A3A3]">
										Country
									</Form.Label>

									<Form.Select
										type="text"
										placeholder="Enter Product Name"
										className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
									>
										<option selected hidden>
											Select Country
										</option>
										{countries.map((obj) => {
											return <option value={obj}>{obj}</option>;
										})}
									</Form.Select>
								</Form.Group>
							</Col>
						</Row>
					</div>
					<div className="mt-4 flex items-center gap-2 justify-end">
						<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-white text-Malertserror">
							<p className="font-medium text__14">Discard</p>
						</div>
						<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Mmaincolorgreen text-white">
							<p className="font-medium text__14">Save Changes</p>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Account;
