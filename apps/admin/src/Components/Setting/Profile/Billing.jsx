import useHostname from "@/Components/Provider/HostnameProvider";
import { Fragment, useState } from "react";

const Billing = () => {
	const originalUrl = useHostname();

	const [selectedOption, setSelectedOption] = useState("Paypal");

	const handleOptionChange = (value) => {
		setSelectedOption(value);
	};
	return (
		<Fragment>
			<div className="grid grid-cols-1 gap-4">
				<div className="grid grid-cols-1 gap-4">
					<div className="w-full p-3 border border-Mborderborderprimary rounded-xl">
						<h3 className="font-semibold text__24 mb-1">Bussines Plan</h3>
						<p className="text__16 text-Mtexttextsecondary">
							Next payment on March 3th, 25 for{" "}
							<span className="font-medium text-Mtexttextprimary">
								$299 annually
							</span>
						</p>

						<div className="mt-4 flex items-center gap-2">
							<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Msurfacesurfacesecondary text-Malertserror">
								<p className="font-medium text__14">Cancel Subscription</p>
							</div>
							<div className="cursor-pointer inline-block px-3 py-2 rounded-lg bg-Mmaincolorgreen text-white">
								<p className="font-medium text__14">Upgrade Plan</p>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-3">
						<h5 className="text__18 font-medium">Billing History</h5>
						<div className="w-full px-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
							<table className="tableBilling">
								<thead>
									<tr>
										<th className="text__14 uppercase font-normal! text-Mtexttextsecondary">
											DATE
										</th>
										<th className="text__14 uppercase font-normal! text-Mtexttextsecondary">
											TYPE
										</th>
										<th className="text__14 uppercase font-normal! text-Mtexttextsecondary">
											TOTAL
										</th>
										<th className="text__14 uppercase font-normal! text-Mtexttextsecondary ss:w-[100px]">
											RECEIPT
										</th>
									</tr>
								</thead>
								<tbody className="text__16 font-normal! text-Mtexttextprimary">
									<tr>
										<td className="text-Mtexttextsecondary">March 3, 2024</td>
										<td className="">Pro Bussines</td>
										<td className="">$299</td>
										<td className="">
											<div className="flex items-center gap-2">
												<img
													src={originalUrl + "/images/FileText.svg"}
													alt=""
												/>
												<p>PDF</p>
											</div>
										</td>
									</tr>
									<tr>
										<td className="text-Mtexttextsecondary">March 3, 2024</td>
										<td className="">Pro Bussines</td>
										<td className="">$299</td>
										<td className="">
											<div className="flex items-center gap-2">
												<img
													src={originalUrl + "/images/FileText.svg"}
													alt=""
												/>
												<p>PDF</p>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-3">
						<h5 className="text__18 font-medium">Payment Method</h5>
						<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
							<label
								className={
									"flex items-center justify-between cursor-pointer gap-3 p-3 rounded-lg transition-all duration-300 border relative " +
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
								<div className="flex items-center gap-3">
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
									<div className="flex items-center gap-2">
										<img
											src={originalUrl + "/images/logos_paypal.svg"}
											alt=""
										/>
										<div className="">
											<h3 className="font-medium text__16 ">PayPal</h3>
											<p className="text__14">ashlynncarder@gmail.com</p>
										</div>
									</div>
								</div>
								{selectedOption === "Paypal" ? (
									<div className="text__14 px-3 py-1 rounded-sm text-Malertssucces bg-[#EFFBF2] border border-[#E5F8EA]! text-center ss:block hidden">
										Default <br /> payment <br /> method
									</div>
								) : (
									<div className="text__14 px-3 py-1 rounded-sm text-Mtexttextbrand bg-[#EFFBF2] border border-[#E5F8EA]! text-center absolute right-3 top-1/2 -translate-y-1/2 ss:static">
										Remove
									</div>
								)}
							</label>
							<label
								className={
									"flex items-center justify-between cursor-pointer gap-3 p-3 rounded-lg transition-all duration-300 border relative " +
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
								<div className="flex items-center gap-3">
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
									<div className="flex items-center gap-2">
										<img
											src={originalUrl + "/images/logos_mastercard.svg"}
											alt=""
										/>
										<div className="">
											<h3 className="font-medium text__16 ">Mastercard</h3>
											<p className="text__14">1234 3920 3212 3193</p>
										</div>
									</div>
								</div>
								{selectedOption === "Mastercard" ? (
									<div className="text__14 px-3 py-1 rounded-sm text-Malertssucces bg-[#EFFBF2] border border-[#E5F8EA]! text-center ss:block hidden">
										Default <br /> payment <br /> method
									</div>
								) : (
									<div className="text__14 px-3 py-1 rounded-sm text-Mtexttextbrand bg-[#EFFBF2] border border-[#E5F8EA]! text-center absolute right-3 top-1/2 -translate-y-1/2 ss:static">
										Remove
									</div>
								)}
							</label>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default Billing;
