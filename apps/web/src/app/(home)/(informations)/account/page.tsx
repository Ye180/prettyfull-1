"use client";

import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { useGetCustomerOrders } from "@/features/account/api/get-orders";
import { customer as fakeCustomer } from "@/lib/fake-data";
import { useRegionStore } from "@/stores/useRegion";
import { Button, Input, Skeleton } from "@prettyfull/ui";
import { formatCurrency_FR } from "@prettyfull/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "../../../../../../../packages/ui/src/components/ui/separator";
import { AddressIcon } from "../../../../../../../packages/ui/src/icons/adresse.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";
import { OrderIcon } from "../../../../../../../packages/ui/src/icons/order.icon";

const StatCard = ({ icon: Icon, label, value, href }: any) => (
	<Link href={href} className="block group">
		<div className="p-6 h-60 bg-white rounded-md border border-gray-100 transition-all duration-200">
			<div className="flex flex-col justify-between items-start">
				<div className="">
					<p className="font-medium text-gray-500 text-md">{label}</p>
					<p className="mt-4 text-3xl font-bold text-gray-900">{value}</p>
				</div>
				<div className="flex justify-end items-center w-full text-gray-400 rounded-full transition-colors h-fit group-hover:text-white">
					<Button
						variant="default"
						className="text-black bg-gray-100 py-4 px-4 w-fit rounded-full hover:*:text-white *:text-black group-hover:bg-black   group-hover:*:text-white rotate-45 "
					>
						<ArrowLinearIcon className="" />
					</Button>
				</div>
			</div>
		</div>
	</Link>
);

const statusLabels: Record<string, { label: string; className: string }> = {
	not_fulfilled: {
		label: "En préparation",
		className: "bg-blue-100 text-blue-800",
	},
	fulfilled: { label: "Livré", className: "bg-green-100 text-green-800" },
	delivered: { label: "Livré", className: "bg-green-100 text-green-800" },
	shipped: { label: "Expédié", className: "bg-indigo-100 text-indigo-800" },
	canceled: { label: "Annulé", className: "bg-red-100 text-red-800" },
	pending: { label: "En attente", className: "bg-yellow-100 text-yellow-800" },
};

export default function AccountPage() {
	const router = useRouter();
	const [customer] = useState(fakeCustomer);
	const [firstName, setFirstName] = useState(fakeCustomer.first_name);
	const [lastName, setLastName] = useState(fakeCustomer.last_name);
	const [email] = useState(fakeCustomer.email);
	const [phone, setPhone] = useState(fakeCustomer.phone ?? "");
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	const region = useRegionStore((state) => state.region);
	const currency = region?.currency_code === "xof" ? "FCFA" : "$";

	const { data: ordersData, isLoading: ordersLoading } = useGetCustomerOrders();
	const [showPassword, setShowPassword] = useState(false);
	const orders = ordersData?.orders ?? [];
	const ordersCount = ordersData?.count ?? 0;

	const handleSaveProfile = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		setSaveSuccess(false);
		setTimeout(() => {
			setIsSaving(false);
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 3000);
		}, 300);
	};

	const lastOrder = orders[0];
	const lastOrderStatus = lastOrder
		? statusLabels[lastOrder.status] || statusLabels.pending
		: null;

	const defaultAddress = customer.addresses?.[0];

	return (
		<div className="pb-20 space-y-12">
			<div className="flex flex-col gap-4 justify-between xs:flex-row xs:items-center xs:px-3">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						Overview
					</h2>
					<p className="text-gray-500">
						Happy to see you again, {customer.first_name || customer.email}.
					</p>
				</div>
				<Button
					variant="outline"
					className="py-6! rounded-full border-gray-200 w-fit px-12!"
				>
					Besoin d&apos;aide ?
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					icon={OrderIcon}
					label="Orders"
					value={ordersLoading ? "..." : String(ordersCount)}
					href="/account/orders"
				/>
				<StatCard
					icon={Heart}
					label="Wishlist"
					value="0"
					href="/account/wishlist"
				/>
				<StatCard
					icon={AddressIcon}
					label="Addresses"
					value={String(customer.addresses?.length ?? 0)}
					href="/account/addresses"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-md!">
					<div className="space-y-10">
						<div className="flex justify-between items-center">
							<p className=" text-gray-800 font-semibold text-xl! ">
								Last Order
							</p>
							{lastOrderStatus && (
								<span
									className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${lastOrderStatus.className}`}
								>
									{lastOrderStatus.label}
								</span>
							)}
						</div>
						{ordersLoading ? (
							<Skeleton className="w-full h-24" />
						) : lastOrder ? (
							<div className="flex gap-4">
								<div className="overflow-hidden w-24 h-24 bg-gray-100 rounded-lg shrink-0">
									{lastOrder.items?.[0]?.thumbnail && (
										<Image
											src={lastOrder.items[0].thumbnail}
											alt={lastOrder.items[0].product_title || "Produit"}
											width={96}
											height={96}
											className="object-fill object-top"
											unoptimized
										/>
									)}
								</div>
								<div>
									<p className="text-sm font-medium text-gray-900">
										Order #{lastOrder.display_id}
									</p>
									<p className="text-sm text-gray-500">
										{new Date(lastOrder.created_at).toLocaleDateString(
											"fr-FR",
											{
												day: "numeric",
												month: "long",
												year: "numeric",
											},
										)}
									</p>
									<p className="mt-1 text-sm font-medium text-gray-900">
										{formatCurrency_FR(lastOrder.total ?? 0, currency)}
									</p>
								</div>
							</div>
						) : (
							<p className="text-sm text-gray-500">No order</p>
						)}
					</div>
					<Link href="/account/orders">
						<Button variant="outline" className="mt-6 w-full border-gray-200">
							See orders
						</Button>
					</Link>
				</div>

				<div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-md!">
					<div className="space-y-10">
						<div className="flex justify-between items-center mb-4">
							<p className=" text-gray-800 font-semibold  text-xl! ">
								Default Address
							</p>
						</div>
						{defaultAddress ? (
							<address className="space-y-1 text-sm not-italic text-gray-600">
								<p className="font-medium text-gray-900">
									{defaultAddress.first_name} {defaultAddress.last_name}
								</p>
								<p>{defaultAddress.address_1}</p>
								{defaultAddress.address_2 && <p>{defaultAddress.address_2}</p>}
								<p>
									{defaultAddress.postal_code} {defaultAddress.city}
								</p>
								<p>{defaultAddress.country_code?.toUpperCase()}</p>
							</address>
						) : (
							<address className="space-y-1 text-sm not-italic text-gray-600">
								<p className="text-gray-500">No address registered</p>
							</address>
						)}
						<Link href="/account/addresses">
							<Button variant="outline" className="mt-6 w-full border-gray-200">
								See Addresses
							</Button>
						</Link>
					</div>
				</div>
			</div>

			<Separator />
			<div className="space-y-8">
				<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
					<div>
						<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
							Personal Information
						</h2>
						<p className="text-gray-500">Update your login information.</p>
					</div>
				</div>
				<div className="px-8 py-12 bg-white border border-gray-100 rounded-md!">
					<form className="space-y-10 w-full" onSubmit={handleSaveProfile}>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Input
								label="First name"
								placeholder="Write first name"
								className="h-fit"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>

							<Input
								label="Last name"
								placeholder="Write last name"
								className="h-fit"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Input
								type="email"
								label="Email"
								placeholder="exemple@gmail.com"
								className="h-fit"
								value={email}
								disabled
							/>

							<Input
								label="Number"
								placeholder="+33 6..."
								className="h-fit"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
							/>
						</div>
						<div className="flex gap-4 items-center pt-6">
							<Button
								type="submit"
								className="px-8 font-medium text-white bg-black rounded-full shadow-lg transition-all hover:bg-gray-800 shadow-gray-200"
								disabled={isSaving}
							>
								{isSaving ? "Saving..." : "Save"}
							</Button>
							{saveSuccess && (
								<span className="text-sm text-green-600">Profile updated!</span>
							)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
