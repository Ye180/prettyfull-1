// web/src/app/(home)/(informations)/account/page.tsx
import React from "react";
import Link from "next/link";
import { Separator } from "../../../../../../../packages/ui/src/components/ui/separator";
import { Button, Input } from "@prettyfull/ui";
import { OrderIcon } from "../../../../../../../packages/ui/src/icons/order.icon";
import { AddressIcon } from "../../../../../../../packages/ui/src/icons/adresse.icon";
import { Heart } from "../../../../../../../packages/ui/src/icons/heart.icon";


const StatCard = ({ icon: Icon, label, value, href }: any) => (
  <Link href={href} className="group block">
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  </Link>
);

export default function AccountPage() {
  return (
    <div className="space-y-8">
            
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h2>
          <p className="text-gray-500">Heureux de vous revoir, Track.</p>
        </div>
        <Button variant="outline" className="rounded-full border-gray-200">
          Besoin d'aide ?
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={OrderIcon} label="Commandes" value="12" href="/account/orders" />
        <StatCard icon={Heart} label="Wishlist" value="4" href="/account/wishlist" />
        <StatCard icon={AddressIcon} label="Adresses" value="2" href="/account/addresses" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Dernière commande</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Livré
              </span>
            </div>
            <div className="flex gap-4">
                <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0" /> 
                <div>
                  <p className="text-sm font-medium text-gray-900">Commande #ORD-7782</p>
                  <p className="text-sm text-gray-500">Le 24 Octobre 2024</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">145,00 €</p>
                </div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-6 rounded-xl border-gray-200">
            Voir la commande
          </Button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Adresse par défaut</h3>
              <Link href="/account/addresses" className="text-sm text-gray-400 hover:text-black">
                Modifier
              </Link>
            </div>
            <address className="not-italic text-sm text-gray-600 space-y-1">
              <p className="font-medium text-gray-900">Track G.</p>
              <p>12 Avenue des Champs-Élysées</p>
              <p>75008 Paris, France</p>
            </address>
          </div>
        </div>
      </div>

      <Separator />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
            <p className="text-sm text-gray-500 mt-1">Mettez à jour vos informations de connexion.</p>
          </div>
          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
            AB
          </div>
        </div>

        <form className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prénom</label>
              <Input placeholder="Votre prénom" className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-black rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nom</label>
              <Input placeholder="Votre nom" className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-black rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" placeholder="exemple@mail.com" className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-black rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Téléphone</label>
              <Input type="tel" placeholder="+33 6..." className="h-11 bg-gray-50 border-gray-200 focus:bg-white focus:ring-black rounded-lg" />
            </div>
          </div>
          <div className="pt-4 flex items-center gap-4">
            <Button className="h-11 px-8 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all shadow-lg shadow-gray-200">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
}