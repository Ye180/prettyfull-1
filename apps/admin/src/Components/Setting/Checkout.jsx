import { Fragment, useState } from "react";
import useHostname from "../Provider/HostnameProvider";

const Checkout = () => {
	const originalUrl = useHostname();

	const [selectedOptionContact, setSelectedOptionContact] =
		useState("Phone Number");
	const [selectedOptionName, setSelectedOptionName] = useState(
		"Only require last name"
	);
	const [selectedOptionCompany, setSelectedOptionCompany] =
		useState("Dont include name");
	const [selectedOptionAddress, setSelectedOptionAddress] =
		useState("Dont include name");
	const [selectedOptionShipping, setSelectedOptionShipping] =
		useState("Dont include name");

	return (
		<Fragment>
			<div className="mb-3">
				<h4 className="font-medium text__18 mb-2">Customer Contact Method</h4>
				<p className="text__14 text-Mtexttextsecondary">
					Select what contact method customers use to check out.
				</p>
			</div>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<label className="flex items-start cursor-pointer gap-3">
					<input
						type="radio"
						name="Contact"
						value="Phone Number"
						checked={selectedOptionContact === "Phone Number"}
						onChange={() => setSelectedOptionContact("Phone Number")}
						className="hidden"
					/>
					<div
						className={
							"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
							(selectedOptionContact === "Phone Number"
								? "border-Mmaincolorgreen"
								: "border-Mgray400")
						}
					>
						{selectedOptionContact === "Phone Number" ? (
							<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
						) : (
							""
						)}
					</div>
					<div>
						<h3 className="font-medium text__16 mb-2">Phone Number</h3>
						<p className="text__14 text-Mtexttextsecondary">+1 234 532 1332</p>
					</div>
				</label>

				{/* Opsi kedua */}
				<label className="flex items-start cursor-pointer gap-3">
					<input
						type="radio"
						name="Contact"
						value="Email"
						checked={selectedOptionContact === "Email"}
						onChange={() => setSelectedOptionContact("Email")}
						className="hidden"
					/>
					<div
						className={
							"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
							(selectedOptionContact === "Email"
								? "border-Mmaincolorgreen"
								: "border-Mgray400")
						}
					>
						{selectedOptionContact === "Email" ? (
							<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
						) : (
							""
						)}
					</div>
					<div>
						<h3 className="font-medium text__16 mb-2">Email</h3>
						<p className="text__14 text-Mtexttextsecondary">
							ashlynncarder@gmail.com
						</p>
					</div>
				</label>
			</div>

			<div className="mt-4 mb-3">
				<h4 className="font-medium text__18">Customer Information</h4>
			</div>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-4">
				<div className=" grid grid-cols-1 gap-3">
					<h4 className="text-Mtexttextsecondary text__14">Pricing</h4>
					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="UseName"
							value="Only require last name"
							checked={selectedOptionName === "Only require last name"}
							onChange={() => setSelectedOptionName("Only require last name")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionName === "Only require last name"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionName === "Only require last name" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Only require last name</h3>
					</label>

					{/* Opsi kedua */}
					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="UseName"
							value="Require first and last name"
							checked={selectedOptionName === "Require first and last name"}
							onChange={() =>
								setSelectedOptionName("Require first and last name")
							}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionName === "Require first and last name"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionName === "Require first and last name" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">
							Require first and last name
						</h3>
					</label>
				</div>

				<div className=" grid grid-cols-1 gap-3">
					<h4 className="text-Mtexttextsecondary text__14">Company Name</h4>
					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="CompanyName"
							value="Dont include name"
							checked={selectedOptionCompany === "Dont include name"}
							onChange={() => setSelectedOptionCompany("Dont include name")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionCompany === "Dont include name"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionCompany === "Dont include name" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Don't include name</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="CompanyName"
							value="Optional"
							checked={selectedOptionCompany === "Optional"}
							onChange={() => setSelectedOptionCompany("Optional")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionCompany === "Optional"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionCompany === "Optional" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Optional</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="CompanyName"
							value="Required"
							checked={selectedOptionCompany === "Required"}
							onChange={() => setSelectedOptionCompany("Required")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionCompany === "Required"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionCompany === "Required" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Required</h3>
					</label>
				</div>

				<div className=" grid grid-cols-1 gap-3">
					<h4 className="text-Mtexttextsecondary text__14">
						Address line 2 (apartment, unit, etc.)
					</h4>
					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Address"
							value="Dont include name"
							checked={selectedOptionAddress === "Dont include name"}
							onChange={() => setSelectedOptionAddress("Dont include name")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionAddress === "Dont include name"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionAddress === "Dont include name" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Don't include name</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Address"
							value="Optional"
							checked={selectedOptionAddress === "Optional"}
							onChange={() => setSelectedOptionAddress("Optional")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionAddress === "Optional"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionAddress === "Optional" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Optional</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Address"
							value="Required"
							checked={selectedOptionAddress === "Required"}
							onChange={() => setSelectedOptionAddress("Required")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionAddress === "Required"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionAddress === "Required" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Required</h3>
					</label>
				</div>

				<div className=" grid grid-cols-1 gap-3">
					<h4 className="text-Mtexttextsecondary text__14">
						Shipping address phone number
					</h4>
					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Shipping"
							value="Dont include name"
							checked={selectedOptionShipping === "Dont include name"}
							onChange={() => setSelectedOptionShipping("Dont include name")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionShipping === "Dont include name"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionShipping === "Dont include name" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Don't include name</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Shipping"
							value="Optional"
							checked={selectedOptionShipping === "Optional"}
							onChange={() => setSelectedOptionShipping("Optional")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionShipping === "Optional"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionShipping === "Optional" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Optional</h3>
					</label>

					<label className="flex items-start cursor-pointer gap-3">
						<input
							type="radio"
							name="Shipping"
							value="Required"
							checked={selectedOptionShipping === "Required"}
							onChange={() => setSelectedOptionShipping("Required")}
							className="hidden"
						/>
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOptionShipping === "Required"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOptionShipping === "Required" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
						<h3 className="font-medium text__16">Required</h3>
					</label>
				</div>
			</div>

			<div className="mt-4 flex items-center gap-2 justify-end">
				<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-white text-Malertserror">
					<p className="font-medium text__14">Discard</p>
				</div>
				<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Mmaincolorgreen text-white">
					<p className="font-medium text__14">Save</p>
				</div>
			</div>
		</Fragment>
	);
};

export default Checkout;
