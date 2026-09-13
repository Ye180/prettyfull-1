'use client'; // Ajout du 'use client' manquant

import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	GridCardProduct,
	Input,
	Spinner,
} from "@prettyfull/ui";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CloseIcon } from "../../../../../../../packages/ui/src/icons/close.icon";
import { ProductTypes, TProduct } from "../../types";

interface NotifyMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: TProduct; // Utilisation de TProduct (de types/index.ts)
  variant: {
    size: string;
    color: { name: string; code: string };
    image: string;
  } | null;
}

// Type pour les produits similaires (inchangé)
type SimilarProduct = {
  id: number | string;
  price: number;
  smallDescription: string;
  title: string; // Gardé pour CardProduct (même si TProduct a 'name')
  notVariable: {
    image: string[] | StaticImport[];
    size: string[];
  };
};

export const NotifyMeModal = ({
  isOpen,
  onClose,
  product,
  variant,
}: NotifyMeModalProps) => {
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      const fetchSimilarProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // --- Simulation de l'appel API ---
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const simulatedData: SimilarProduct[] = Array.from({
            length: 6,
          }).map((_, i) => ({
            id: `sim_${i}`,
            price: 12000 + i * 1000,
            smallDescription: 'Top similaire à la mode',
            title: `Body Confort ${i + 1}`,
            notVariable: {
              image: [`/assets/product_${i % 2 === 0 ? '1' : '2'}.jpg`],
              size: ['S', 'M', 'L'],
            },
          }));
          // --- Fin de la simulation ---
          setSimilarProducts(simulatedData);
        } catch (err) {
          setError('Impossible de charger les produits similaires.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchSimilarProducts();
    }
  }, [isOpen, product]);

  // Si le modal n'est pas ouvert ou n'a pas de variant, ne rien rendre
  if (!isOpen || !variant) return null; 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-4xl p-0 overflow-hidden border-none rounded-3xl"
      >
        <div className="relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute z-10 p-2 bg-white rounded-full top-4 right-4 cursor-pointer"
          >
            <CloseIcon className="w-8 h-8" />
          </button>
          <div className="p-12 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-widest text-center uppercase">
                NOTIFY ME
              </DialogTitle>
            </DialogHeader>

						<div className="flex items-center gap-6">
							<div className="relative w-24 h-24 bg-gray-100 rounded-2xl shrink-0">
								<Image
									src={variant.image}
									alt={product.name}
									layout="fill"
									objectFit="cover"
									className="rounded-2xl"
								/>
							</div>
							<div className="space-y-1">
								<p className="font-semibold">
									{product.name} - {variant.color.name}
								</p>
								<p className="text-gray-500 text-md">{`$${product.price}`}</p>
							</div>
						</div>

            <p className="text-center text-gray-700 text-md">
              Sign up for email or text and we will notify you when{' '}
              <span className="font-semibold">Size: {variant.size}</span> is
              available.
            </p>

            <div className="space-y-4">
              <label
                htmlFor="contact-info"
                className="text-sm font-medium text-gray-800"
              >
                Send to*
              </label>
              <Input
                id="contact-info"
                placeholder="Email Address or Phone Number"
                className="w-full py-6 text-center border-gray-400"
              />
              <Button fullWidth className="py-6 text-lg">
                Sign up
              </Button>
            </div>

            <p className="text-xs text-center text-gray-400">
              By signing up via email, you agree to Fashion Nova's{' '}
              <a href="#" className="underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              . By signing up via text, you agree to receive recurring automated
              promotional and personalized marketing text messages...
            </p>
          </div>

					<div className="px-12 py-8 bg-gray-50">
						<h3 className="mb-6 text-xl font-bold text-center uppercase">
							SHOP SIMILAR
						</h3>
						{/* Affichage conditionnel ici */}
						{isLoading ? (
							<div className="flex items-center justify-center h-48">
								<Spinner className="w-12 h-12" />
							</div>
						) : error ? (
							<p className="text-center text-red-500">{error}</p>
						) : (
							<GridCardProduct classGrid="grid grid-cols-2 md:grid-cols-3 gap-4">
								<>
									{/* {similarProducts.map((item) => (
										<div key={item.id} className="w-full aspect-10/9">
											<CardProduct
												price={item.price.amount}
												smallDescription={item.smallDescription}
												title={item.title}
												notVariable={item.notVariable}
											/>
										</div>
									))} */}
								</>
							</GridCardProduct>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};