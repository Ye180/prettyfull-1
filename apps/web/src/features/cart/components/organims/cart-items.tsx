'use client';

import { CartItemType } from '../../types';
import Image from 'next/image';
import { QuantitySelector } from '../molecules/quantity-selector';
import { EditItems } from '../molecules/edit-items';
import  client  from '@/shared/lib/client';

// Fonction pour obtenir l'URL de l'image (depuis l'intercepteur client)
const getImageUrl = (path?: string) => {
  if (!path) return '/assets/product_1.jpg'; // Image par défaut
  if (path.startsWith('http')) return path;
  const baseUrl = client.defaults.baseURL?.replace('/api/v1', '') || ''; 
  return `${baseUrl}${path}`;
};

export const CartItems = ({ items }: { items: CartItemType[] }) => {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        // --- CORRECTIONS MAJEURES ICI ---
        <div key={item.product._id} className="flex gap-4 p-4 border rounded-md">
          <Image
            src={getImageUrl(item.product.mainImageUrl)}
            alt={item.product.name.fr}
            width={100}
            height={120}
            className="object-cover rounded-md"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-semibold">{item.product.name.fr}</h4>
              <p className="text-sm text-gray-500">
                {/* TODO: Afficher les variantes si elles existent */}
                {/* {item.color} / {item.size} */}
              </p>
              <p className="font-semibold">{item.price} FCFA</p>
            </div>
            
            <div className="flex items-center justify-between">
              <QuantitySelector
                productId={item.product._id}
                initialQuantity={item.quantity}
              />
              <EditItems productId={item.product._id} />
            </div>
          </div>
        </div>
        // --- FIN DES CORRECTIONS ---
      ))}
    </div>
  );
};