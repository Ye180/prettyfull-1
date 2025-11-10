'use client';

import { useMemo } from 'react';
import { Button, ScrollArea } from '@prettyfull/ui';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import client  from '@/shared/lib/client';
import { useCartStore } from '../../../../../../../packages/store/src/use-cart-store';
import { useAuth } from '@/hooks/useAuth'; // ⬅️ 1. IMPORTER LE BON HOOK D'AUTH

// Fonction pour obtenir l'URL de l'image (depuis l'intercepteur client)
const getImageUrl = (path?: string) => {
  if (!path) return '/assets/product_1.jpg'; // Image par défaut
  if (path.startsWith('http')) return path;
  
  const baseUrl = client.defaults.baseURL?.replace('/api/v1', '') || ''; 
  return `${baseUrl}${path}`;
};

const DropdownContentCart = () => {
  const t = useTranslations('cart');
  const router = useRouter();
  const { items } = useCartStore();
  
  // ⬅️ 2. RÉCUPÉRER L'ÉTAT DE L'UTILISATEUR
  const { isAuthenticated, isLoading } = useAuth(); 
const total = items.reduce(
  (acc, item) => acc + (item.unitPrice?.amount || 0) * item.quantity,
  0
);

  const subtotal = useMemo(() => {
    return items
      .reduce(
  (acc, item) =>
    acc + ((item.unitPrice?.amount ?? 0) * (item.quantity ?? 0)),
  0
)
      .toFixed(2);
  }, [items]);

  // ⬅️ 3. CRÉER LA MÊME LOGIQUE DE REDIRECTION SÉCURISÉE
  const handleCheckout = () => {
    if (isLoading) {
      return; // Ne rien faire pendant le chargement
    }

    if (isAuthenticated) {
      // Si connecté, aller au checkout
      router.push('/checkout');
    } else {
      // Si invité, aller au login et mémoriser le checkout
      router.push('/login?callbackUrl=/checkout');
    }
    // Idéalement, fermer le dropdown ici (si la logique existe)
  };
  
  const goToCart = () => {
    router.push('/cart');
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
  <div key={item.product.id} className="flex gap-4">
    <img
      src={item.product.image || "/placeholder.jpg"}
      alt={
        typeof item.product.name === "string"
          ? item.product.name
          : (item.product.name as any)?.fr ?? ""
      }
      className="w-16 h-16 object-cover"
    />
    <div>
      <p className="font-semibold">
        {typeof item.product.name === "string"
          ? item.product.name
          : (item.product.name as any)?.fr ?? ""}
      </p>
      <p>
        {item.quantity} x {item.unitPrice?.amount} {item.unitPrice?.currency}
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
              {/* 4. APPLIQUER LE HANDLER ET LE LOADING STATE */}
              <Button 
                onClick={handleCheckout} 
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {t('checkout')}
              </Button>
              <Button onClick={goToCart} variant="outline" className="w-full">
                {t('viewCart')}
              </Button>
            </div>
          </div>
        </>
      )}
      
    </span>
  );
};

export default DropdownContentCart;