import { Fragment, useState } from "react";
import useHostname from "../Provider/HostnameProvider";

const PaymentMethod = () => {
	const originalUrl = useHostname();

	const [selectedOption, setSelectedOption] = useState("Paypal");

	const handleOptionChange = (value) => {
		setSelectedOption(value);
	};

	return (
		<Fragment>
			<div className="mb-3">
				<h4 className="font-medium text__18 mb-2">Supported Payment Methods</h4>
				<p className="text__14 text-Mtexttextsecondary">
					Payment methods that are available with one of Vuexy's approved
					payment providers.
				</p>
			</div>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<label
					className={
						"flex items-center justify-between cursor-pointer gap-3 p-3 rounded-lg transition-all duration-300 border " +
						(selectedOption === "Paypal"
							? " border-Msurfacesurfacebrand"
							: "border-transparent!")
					}
				>
					<input
						type="radio"
						name="Payment"
						value="Paypal"
						checked={selectedOption === "Paypal"}
						onChange={() => handleOptionChange("Paypal")}
						className="hidden"
					/>
					<div className="flex items-center gap-2">
						<img src={originalUrl + "/images/logos_paypal.svg"} alt="" />
						<div className="">
							<h3 className="font-medium text__16 ">PayPal</h3>
							<p className="text__14">ashlynncarder@gmail.com</p>
						</div>
					</div>
					<div className="flex items-center gap-4 relative">
						{selectedOption === "Paypal" ? (
							<div className="text__14 px-3 py-1 rounded-sm text-Malertssucces bg-[#EFFBF2] border border-[#E5F8EA]! absolute -left-20 top-1/2 -translate-y-1/2 ss:static">
								Active
							</div>
						) : (
							""
						)}
						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOption === "Paypal"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOption === "Paypal" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
					</div>
				</label>
				<label
					className={
						"flex items-center justify-between cursor-pointer gap-3 p-3 rounded-lg transition-all duration-300 border " +
						(selectedOption === "Mastercard"
							? " border-Msurfacesurfacebrand"
							: "border-transparent!")
					}
				>
					<input
						type="radio"
						name="Payment"
						value="Mastercard"
						checked={selectedOption === "Mastercard"}
						onChange={() => handleOptionChange("Mastercard")}
						className="hidden"
					/>
					<div className="flex items-center gap-2">
						<img src={originalUrl + "/images/logos_mastercard.svg"} alt="" />
						<div className="">
							<h3 className="font-medium text__16 ">Mastercard</h3>
							<p className="text__14">1234 3920 3212 3193</p>
						</div>
					</div>
					<div className="flex items-center gap-4 relative">
						{selectedOption === "Mastercard" ? (
							<div className="text__14 px-3 py-1 rounded-sm text-Malertssucces bg-[#EFFBF2] border border-[#E5F8EA]! absolute -left-20 top-1/2 -translate-y-1/2 ss:static">
								Active
							</div>
						) : (
							""
						)}

						<div
							className={
								"w-6 h-6 rounded-fullborder  flex items-center justify-center border shrink-0 rounded-full " +
								(selectedOption === "Mastercard"
									? "border-Mmaincolorgreen"
									: "border-Mgray400")
							}
						>
							{selectedOption === "Mastercard" ? (
								<div className="w-4 h-4 rounded-full bg-Mmaincolorgreen"></div>
							) : (
								""
							)}
						</div>
					</div>
				</label>
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

export default PaymentMethod;
