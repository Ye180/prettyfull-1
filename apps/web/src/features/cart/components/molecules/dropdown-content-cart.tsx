'use client';

import { useMemo } from 'react';
import { Button, ScrollArea } from '@prettyfull/ui';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import client  from '@/shared/lib/client'; // Importé pour la base URL
import { useCartStore } from '../../../../../../../packages/store/src/use-cart-store';

// Fonction pour obtenir l'URL de l'image (depuis l'intercepteur client)
const getImageUrl = (path?: string) => {
  if (!path) return '/assets/product_1.jpg'; // Image par défaut
  if (path.startsWith('http')) return path;
  
  // Utilise la baseURL d'Axios pour construire le lien complet
  const baseUrl = client.defaults.baseURL?.replace('/api/v1', '') || ''; 
  return `${baseUrl}${path}`;
};

const DropdownContentCart = () => {
  const t = useTranslations('cart');
  const router = useRouter();

  // --- LOGIQUE AJOUTÉE ---
  // 1. Lire les articles depuis le store Zustand
  const { items } = useCartStore();

  // 2. Calculer le sous-total
  const subtotal = useMemo(() => {
    return items
      .reduce((acc, item) => acc + (item.price * item.quantity), 0)
      .toFixed(2);
  }, [items]);
  // --- FIN LOGIQUE AJOUTÉE ---

  const goToCheckout = () => {
    router.push('/checkout');
    // Idéalement, fermer le dropdown ici (dépend du composant parent)
  };
  
  const goToCart = () => {
    router.push('/cart');
    // Idéalement, fermer le dropdown ici
  };

  return (
    <span className="absolute z-50 h-fit p-4 py-6 mt-2 text-sm text-black bg-white rounded-md shadow-2xl w-[40rem] -left-[36rem] top-20 flex flex-col justify-center border border-gray-100 max-sm:hidden">
      
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <h4 className="mb-4 !text-[1.8rem] font-semibold font-manrope">
            {t('empty')}
          </h4>
        </div>
      ) : (
        <>
          <ScrollArea className="h-[200px] w-full pr-4">
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <Image
                    src={getImageUrl(item.product.mainImageUrl)}
                    alt={item.product.name.fr}
                    width={64}
                    height={64}
                    className="object-cover rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{item.product.name.fr}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.price} FCFA
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 mt-4 border-t w-full">
            <div className="flex justify-between font-semibold">
              <p>{t('subtotal')}</p>
              <p>{subtotal} FCFA</p>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={goToCheckout} className="w-full">
                {t('checkout')}
              </Button>
              <Button onClick={goToCart} variant="outline" className="w-full">
                {t('viewCart')}
              </Button>
            </div>
          </div>
        </>
      )}
      {/* --- FIN AFFICHAGE DYNAMIQUE --- */}
    </span>
  );
};

export default DropdownContentCart;