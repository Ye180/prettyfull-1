import { Fragment, useState } from "react";
import useHostname from "../Provider/HostnameProvider";

const Notification = () => {
	const originalUrl = useHostname();

	const [checks, setChecks] = useState({
		signUp: true,
		passwordReset: true,
		accountInvite: false,
		orderpurchase: true,
		orderCancelled: true,
		orderRefund: false,
		orderConfirmation: false,
		paymentError: false,
		pickedUp: true,
		shippingUpdate: true,
		delivered: false,
	});

	// Handle checkbox toggle
	const handleToggle = (key) => {
		setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
	};
	return (
		<Fragment>
			<h4 className="font-medium text__18 mb-3">Customer</h4>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("signUp")}
				>
					<span className="text__16">New customer sign up</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.signUp
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.signUp ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("passwordReset")}
				>
					<span className="text__16">Customer account password reset</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.passwordReset
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.passwordReset ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("accountInvite")}
				>
					<span className="text__16">Customer account invite</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.accountInvite
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.accountInvite ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>
			</div>

			<h4 className="font-medium text__18 mt-4 mb-3">Orders</h4>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-4">
				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("orderpurchase")}
				>
					<span className="text__16">Order purchase</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.orderpurchase
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.orderpurchase ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("orderCancelled")}
				>
					<span className="text__16">Order cancelled</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.orderCancelled
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.orderCancelled ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("orderRefund")}
				>
					<span className="text__16">Order refund request</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.orderRefund
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.orderRefund ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("orderConfirmation")}
				>
					<span className="text__16">Order confirmation</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.orderConfirmation
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.orderConfirmation ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("paymentError")}
				>
					<span className="text__16">Payment error</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.paymentError
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.paymentError ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>
			</div>

			<h4 className="font-medium text__18 mb-3">Shipping</h4>

			<div className="w-full p-3 border border-Mborderborderprimary rounded-xl grid grid-cols-1 gap-3">
				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("pickedUp")}
				>
					<span className="text__16">Picked up</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.pickedUp
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.pickedUp ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("shippingUpdate")}
				>
					<span className="text__16">Shipping update</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.shippingUpdate
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.shippingUpdate ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
				</div>

				<div className="bg-Mborderborderprimary w-full h-px"></div>

				<div
					className="flex items-center justify-between gap-2 cursor-pointer"
					onClick={() => handleToggle("delivered")}
				>
					<span className="text__16">Delivered</span>
					<div
						className={
							"flex items-center justify-center w-6 h-6 rounded-sm border border-solid  " +
							(checks.delivered
								? "border-Mmaincolorgreen bg-Mmaincolorgreen"
								: "border-[#A3A3A3]")
						}
					>
						<img
							src={originalUrl + "/images/check (3).svg"}
							className={checks.delivered ? "opacity-100" : "opacity-0"}
							alt=""
						/>
					</div>
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

export default Notification;
