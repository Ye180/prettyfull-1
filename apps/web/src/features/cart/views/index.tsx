'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@prettyfull/ui';
import { useCartStore } from '../../../../../../packages/store/src/use-cart-store';
import { useGetCart } from '../api/get-cart-by-userid';
import { CartItems } from '../components/organims/cart-items';
import { CartSummary } from '../components/molecules/cart-summary';

const TAX_RATE = 0.18;
const STANDARD_SHIPPING_FEE = 5000;
const FREE_SHIPPING_THRESHOLD = 50000;

export function CartView() {
// ✅ Sécurité : on protège l’appel de traduction (pour éviter crash SSR)
type Translator = ReturnType<typeof useTranslations>;

// ✅ Fonction de secours compatible TypeScript
const fallbackT = Object.assign(
  (key: string, ..._args: unknown[]) => key,
  {
    rich: (key: string, ..._args: unknown[]) => key,
    markup: (key: string, ..._args: unknown[]) => key,
    raw: (key: string, ..._args: unknown[]) => key,
    has: () => false,
  }
) as unknown as Translator;

let t: Translator;
try {
  t = useTranslations('cart');
} catch {
  t = fallbackT;
}


  const router = useRouter();
  const { items, setCart } = useCartStore();
  const { data: cartData, isLoading } = useGetCart();

  // 🧠 Synchronisation du panier backend → store Zustand
  useEffect(() => {
    if (cartData?.items && cartData.items.length > 0) {
      setCart(cartData.items);
    }
  }, [cartData, setCart]);

  // 💰 Calcul des totaux (mémorisé)
  const { subtotal, shipping, taxes, total } = useMemo(() => {
    const subtotalCalc = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxesCalc = subtotalCalc * TAX_RATE;
    const shippingCalc =
      subtotalCalc > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const totalCalc = subtotalCalc + shippingCalc + taxesCalc;

    return { subtotal: subtotalCalc, shipping: shippingCalc, taxes: taxesCalc, total: totalCalc };
  }, [items]);

  // 🌀 État de chargement
  if (isLoading) {
    return <p className="text-center py-24">Chargement du panier...</p>;
  }

  // 🛒 Panier vide
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-8 py-24">
        <h1 className="text-2xl font-semibold">{t('empty')}</h1>
        <Button onClick={() => router.push('/')}>
          {t('continueShopping')}
        </Button>
      </div>
    );
  }

  // ✅ Rendu principal
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <CartItems items={items} />
      </div>
      <CartSummary
        subtotal={subtotal}
        shipping={shipping}
        taxes={taxes}
        total={total}
      />
    </div>
  );
}
