"use client";

// import {
// 	Bell,
// 	ChevronRight,
// 	CreditCard,
// 	MapPin,
// 	ShoppingCart,
// 	Store,
// } from "lucide-react";
import { useState } from "react";

const menuItems = [
	{
		id: "store",
		label: "Store Details",
		// icon: Store,
		color: "text-teal-600 bg-teal-50",
	},
	{
		id: "payment",
		label: "Payment Method",
		// icon: CreditCard,
		color: "text-gray-600 bg-gray-50",
	},
	{
		id: "checkout",
		label: "Checkout",
		// icon: ShoppingCart,
		color: "text-gray-600 bg-gray-50",
	},
	{
		id: "location",
		label: "Location",
		// icon: MapPin,
		color: "text-gray-600 bg-gray-50",
	},
	{
		id: "notification",
		label: "Notification",
		// icon: Bell,
		color: "text-gray-600 bg-gray-50",
	},
];

const Account = () => {
	const [activeMenu, setActiveMenu] = useState("store");

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="mx-auto max-w-[1400px] px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Settings</h1>
					<p className="mt-1 text-sm text-gray-500">
						Track orders list across your store.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					{/* Sidebar */}
					<div className="lg:col-span-3">
						<div className="p-4 space-y-2 bg-white rounded-lg">
							{menuItems.map((item) => {
								// const Icon = item.icon;
								const isActive = activeMenu === item.id;
								return (
									<button
										key={item.id}
										onClick={() => setActiveMenu(item.id)}
										className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
											isActive
												? "bg-teal-50 text-teal-700"
												: "hover:bg-gray-50 text-gray-700"
										}`}
									>
										<div className="flex items-center gap-3">
											<div
												className={`p-2 rounded-lg ${isActive ? "bg-teal-100" : "bg-gray-100"}`}
											>
												{/* <Icon
													className={`w-5 h-5 ${isActive ? "text-teal-600" : "text-gray-600"}`}
												/> */}
											</div>
											<span className="font-medium">{item.label}</span>
										</div>
										{/* {isActive && (<ChevronRight className="w-5 h-5" />)} */}
									</button>
								);
							})}
						</div>

						{/* Store Details Dropdown */}
						<div className="p-4 mt-4 bg-white rounded-lg">
							<button className="flex items-center justify-between w-full text-left">
								<span className="font-medium text-gray-700">Store Details</span>
								{/* <ChevronRight className="w-5 h-5 text-gray-400" /> */}
							</button>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-9">
						<div className="bg-white rounded-lg shadow-sm">
							<div className="p-6 lg:p-8">
								{/* Profile Section */}
								<div className="mb-8">
									<h2 className="mb-6 text-xl font-semibold text-gray-900">
										Profile
									</h2>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Email
											</label>
											<input
												type="email"
												placeholder="Enter Email"
												className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Store Name
											</label>
											<input
												type="text"
												placeholder="Enter Store Name"
												className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Email
											</label>
											<input
												type="email"
												placeholder="Enter Email"
												className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Phone
											</label>
											<div className="flex gap-2">
												<select className="px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
													<option>🇺🇸</option>
													<option>🇫🇷</option>
													<option>🇬🇧</option>
												</select>
												<input
													type="tel"
													placeholder="2345 678 4321"
													className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Billing Information Section */}
								<div>
									<h2 className="mb-6 text-xl font-semibold text-gray-900">
										Billing information
									</h2>
									<div className="grid grid-cols-1 gap-6">
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Business Name
											</label>
											<input
												type="text"
												placeholder="Enter Bussiness Name"
												className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-500">
												Address
											</label>
											<input
												type="text"
												placeholder="Enter Address"
												className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
											/>
										</div>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-500">
													Town
												</label>
												<input
													type="text"
													placeholder="Enter Town"
													className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-500">
													State/Province
												</label>
												<input
													type="text"
													placeholder="Enter State/Province"
													className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
												/>
											</div>
										</div>
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-500">
													Post Code
												</label>
												<input
													type="text"
													placeholder="Enter Post Code"
													className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-500">
													Country
												</label>
												<select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent">
													<option>Select Country</option>
													<option>United States</option>
													<option>France</option>
													<option>United Kingdom</option>
													<option>Canada</option>
												</select>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Account;
