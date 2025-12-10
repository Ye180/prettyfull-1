import { OrderCard } from "@/features/account/components/order-card";
import { Button } from "@prettyfull/ui";
import Link from "next/link";
import { OrderIcon } from "../../../../../../../../packages/ui/src/icons/order.icon";

const MOCK_ORDERS = [
	{
		id: "ord_01",
		displayId: "7782",
		createdAt: "2024-10-24T14:30:00Z",
		status: "delivered" as const,
		total: 145.0,
		currency: "€",
		items: [
			{
				id: "1",
				title: "T-shirt Noir",
				quantity: 1,
				thumbnail: "/assets/product_1.jpg",
			},
			{
				id: "2",
				title: "Casquette",
				quantity: 2,
				thumbnail: "/assets/product_2.jpg",
			},
		],
	},
	{
		id: "ord_02",
		displayId: "7750",
		createdAt: "2024-09-12T09:15:00Z",
		status: "processing" as const,
		total: 89.9,
		currency: "€",
		items: [
			{
				id: "3",
				title: "Sneakers",
				quantity: 1,
				thumbnail: "/assets/product5.webp",
			},
		],
	},
];

export default function OrdersPage() {
	const orders = MOCK_ORDERS;

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-4 justify-between sm:flex-row sm:items-center">
				<div>
					<h2 className="text-4xl! font-bold tracking-wider text-gray-900">
						Mes Commandes
					</h2>
					<p className="mt-1 text-gray-500">
						Suivez et gérez vos commandes récentes.
					</p>
				</div>
			</div>

			{orders.length > 0 ? (
				<div className="grid gap-6">
					{orders.map((order) => (
						<OrderCard key={order.id} order={order} />
					))}
				</div>
			) : (
				<div className="flex flex-col justify-center items-center p-12 text-center bg-white rounded-2xl border border-gray-200 border-dashed">
					<div className="flex justify-center items-center mb-4 w-16 h-16 bg-gray-50 rounded-full">
						<OrderIcon className="w-8 h-8 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900">
						Aucune commande pour le moment
					</h3>
					<p className="mx-auto mt-2 mb-8 max-w-sm text-gray-500">
						Vous n'avez pas encore passé de commande. Découvrez nos dernières
						nouveautés et laissez-vous tenter !
					</p>
					<Link href="/products">
						<Button className="px-8 py-6 h-auto text-base text-white bg-black rounded-full hover:bg-gray-800">
							Commencer le shopping
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}
