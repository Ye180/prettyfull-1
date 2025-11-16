import { Fragment, useState } from "react";
import { Container, Form, Modal } from "react-bootstrap";
import useHostname from "../Provider/HostnameProvider";

const ModalAddCustomer = ({ onHideClick, title, ...props }) => {
	const originalUrl = useHostname();

	const [toogleChecklist, settoogleChecklist] = useState(false);

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
	return (
		<Fragment>
			{/* Modal */}
			<Modal {...props}>
				<Modal.Body>
					<div className="border-b border-Mborderborderprimary p-3">
						<Container>
							<div className="flex items-center justify-between py-2">
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
						<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Label className="font-normal text__14 text-[#A3A3A3]">
									Name
								</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter Name"
									className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
								/>
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Label className="font-normal text__14 text-[#A3A3A3]">
									Email
								</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter Email"
									className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
								/>
							</Form.Group>

							<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
								<h5 className="font-medium text__16">Shipping Information</h5>
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

								<div className="grid md:grid-cols-2 gap-3">
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
									<Form.Group controlId="exampleForm.ControlInput1">
										<Form.Label className="font-normal text__14 text-[#A3A3A3]">
											Post Code
										</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter Town"
											className="font-medium text__14 bg-transparent h-[54px] rounded-lg px-3 outline-hidden shadow-none focus:outline-hidden focus:shadow-none border-Mborderborderprimary focus:border-Mborderborderprimary focus:bg-transparent"
										/>
									</Form.Group>
								</div>

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
							</div>

							<div
								className="flex items-start gap-2 cursor-pointer"
								onClick={() => settoogleChecklist(!toogleChecklist)}
							>
								<div
									className={
										"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
										(toogleChecklist
											? "border-Mmaincolorgreen bg-Mmaincolorgreen"
											: "border-[#A3A3A3]")
									}
								>
									<img
										src={originalUrl + "/images/check (3).svg"}
										className={toogleChecklist ? "opacity-100" : "opacity-0"}
										alt=""
									/>
								</div>
								<div className="">
									<h5 className="text__16 font-medium">
										Use as a billing address?
									</h5>
									<p className="text__14">
										If you need more info, please check budget.
									</p>
								</div>
							</div>

							<div className="mt-4 flex items-center gap-2 justify-end">
								<div
									onClick={onHideClick}
									className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-white text-Malertserror"
								>
									<p className="font-medium text__14">Discard</p>
								</div>
								<div
									onClick={onHideClick}
									className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Mmaincolorgreen text-white"
								>
									<p className="font-medium text__14">Add Customer</p>
								</div>
							</div>
						</div>
					</div>
				</Modal.Body>
			</Modal>
			{/* Modal */}
		</Fragment>
	);
};

export default ModalAddCustomer;
