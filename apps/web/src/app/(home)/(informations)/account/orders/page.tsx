import React from "react";
import Link from "next/link";
import { Button } from "@prettyfull/ui";
import { OrderCard } from "@/features/account/components/order-card";
import { OrderIcon } from "../../../../../../../../packages/ui/src/icons/order.icon";


const MOCK_ORDERS = [
  {
    id: "ord_01",
    displayId: "7782",
    createdAt: "2024-10-24T14:30:00Z",
    status: "delivered" as const,
    total: 145.00,
    currency: "€",
    items: [
      { id: "1", title: "T-shirt Noir", quantity: 1, thumbnail: "/assets/product_1.jpg" }, 
      { id: "2", title: "Casquette", quantity: 2, thumbnail: "/assets/product_2.jpg" },
    ]
  },
  {
    id: "ord_02",
    displayId: "7750",
    createdAt: "2024-09-12T09:15:00Z",
    status: "processing" as const,
    total: 89.90,
    currency: "€",
    items: [
      { id: "3", title: "Sneakers", quantity: 1, thumbnail: "/assets/product5.webp" },
    ]
  }
];

export default function OrdersPage() {
  const orders = MOCK_ORDERS; 

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Commandes</h1>
          <p className="text-gray-500 mt-1">Suivez et gérez vos commandes récentes.</p>
        </div>
        {orders.length > 0 && (
            <Button variant="outline" className="rounded-full border-gray-200">
                Télécharger les factures
            </Button>
        )}
      </div>

      {orders.length > 0 ? (
        <div className="grid gap-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
             <OrderIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Aucune commande pour le moment</h3>
          <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-8">
            Vous n'avez pas encore passé de commande. Découvrez nos dernières nouveautés et laissez-vous tenter !
          </p>
          <Link href="/products">
            <Button className="rounded-full bg-black text-white hover:bg-gray-800 px-8 py-6 h-auto text-base">
              Commencer le shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}