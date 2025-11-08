'use client';

import { CartSummaryProps } from '../../types';
import { Button } from '@prettyfull/ui';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export const CartSummary = ({
  subtotal,
  shipping,
  taxes,
  total,
}: CartSummaryProps) => {
  const t = useTranslations('cart');
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-xl font-semibold mb-4">{t('summary')}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p>{t('subtotal')}</p>
          <p>{subtotal.toFixed(2)} FCFA</p>
        </div>
        <div className="flex justify-between">
          <p>{t('shipping')}</p>
          <p>{shipping > 0 ? `${shipping.toFixed(2)} FCFA` : 'Gratuit'}</p>
        </div>
        <div className="flex justify-between">
          <p>{t('taxes')}</p>
          <p>{taxes.toFixed(2)} FCFA</p>
        </div>
        <div className="border-t my-2 pt-2 flex justify-between font-bold text-lg">
          <p>{t('total')}</p>
          <p>{total.toFixed(2)} FCFA</p>
        </div>
      </div>
      <Button 
        onClick={handleCheckout} 
        className="w-full mt-6"
        disabled={subtotal === 0} 
      >
        {t('checkout')}
      </Button>
    </div>
  );
};