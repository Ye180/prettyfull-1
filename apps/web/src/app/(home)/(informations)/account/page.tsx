// web/src/app/(home)/(informations)/account/page.tsx
import { ArrowLinearIcon } from "@/components/icons/arrow-linear-icon";
import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
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

export default function AccountPage() {
	return (
		<div className="pb-20 space-y-12">
			<div className="flex flex-col gap-4 justify-between xs:flex-row xs:items-center xs:px-3">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						Vue d'ensemble
					</h2>
					<p className="text-gray-500">Heureux de vous revoir, Track.</p>
				</div>
				<Button
					variant="outline"
					className="py-6! rounded-full border-gray-200 w-fit px-12!"
				>
					Besoin d'aide ?
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<StatCard
					icon={OrderIcon}
					label="Commandes"
					value="12"
					href="/account/orders"
				/>
				<StatCard
					icon={Heart}
					label="Wishlist"
					value="4"
					href="/account/wishlist"
				/>
				<StatCard
					icon={AddressIcon}
					label="Adresses"
					value="2"
					href="/account/addresses"
				/>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-md!">
					<div className="space-y-10">
						<div className="flex justify-between items-center">
							<p className=" text-gray-800 font-semibold text-xl! ">
								Dernière commande
							</p>
							<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
								Livré
							</span>
						</div>
						<div className="flex gap-4">
							<div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0" />
							<div>
								<p className="text-sm font-medium text-gray-900">
									Commande #ORD-7782
								</p>
								<p className="text-sm text-gray-500">Le 24 Octobre 2024</p>
								<p className="mt-1 text-sm font-medium text-gray-900">
									145,00 €
								</p>
							</div>
						</div>
					</div>
					<Button variant="outline" className="mt-6 w-full border-gray-200">
						Voir la commande
					</Button>
				</div>

				<div className="flex flex-col justify-between p-6 bg-white border border-gray-100 rounded-md!">
					<div className="space-y-10">
						<div className="flex justify-between items-center mb-4">
							<p className=" text-gray-800 font-semibold  text-xl! ">
								Adresse par défaut
							</p>
						</div>
						<address className="space-y-1 text-sm not-italic text-gray-600">
							<p className="font-medium text-gray-900">Track G.</p>
							<p>12 Avenue des Champs-Élysées</p>
							<p>75008 Paris, France</p>
						</address>

						<Button variant="outline" className="mt-6 w-full border-gray-200">
							Modifier
						</Button>
					</div>
				</div>
			</div>

			<Separator />
			<div className="space-y-8">
				<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
					<div>
						<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
							Informations Personnelles
						</h2>
						<p className="text-gray-500">
							Mettez à jour vos informations de connexion.
						</p>
					</div>
				</div>
				<div className="px-8 py-12 bg-white border border-gray-100 rounded-md!">
					<form className="space-y-10 w-full">
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Input
								label="First name"
								placeholder="Write first name "
								className=""
							/>

							<Input
								label="Last name"
								placeholder="Write last name "
								className=""
							/>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<Input
								type="email"
								label="Email"
								placeholder="exemple@gmail.com"
								className=""
							/>

							<Input label="Number" placeholder="+33 6..." className="" />
						</div>
						<div className="flex gap-4 items-center pt-6">
							<Button className="px-8 font-medium text-white bg-black rounded-full shadow-lg transition-all hover:bg-gray-800 shadow-gray-200">
								Enregistrer
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
