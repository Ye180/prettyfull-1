"use client";

import { ProductGallery } from "@/features/products/components/organims/product-gallery";
import ProductSuggestion from "@/features/products/components/organims/product-suggestion";
import ProductInfos from "@/features/products/components/organims/products-info";
import Reviews from "@/features/products/components/organims/reviews";
import { ProductTypes } from "@/features/products/types";
import { useState, useMemo } from "react";
import Container from "../../../../../../../../packages/ui/src/layouts/helpers/container";
import { NotifyMeModal } from "@/features/products/components/organims/notify-me";

const productData: ProductTypes = {
  category: "FEMME FASHION",
  title: "SWEET TOP",
  price: 79000,
  description: "Un haut élégant et confortable parfait pour toutes les occasions.",
  variants: [
    { size: "XS", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 10 },
    { size: "S", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 5 },
    { size: "M", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 15 },
    { size: "L", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 2 },
    { size: "XL", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 0 },
    { size: "XXL", color: { name: "Black", code: "#000000" }, images: ["/assets/product_1.jpg", "/assets/product_2.jpg"], stock: 1 },
    { size: "S", color: { name: "Bleue", code: "#3b82f6" }, images: ["/assets/product_2.jpg"], stock: 8 },
    { size: "M", color: { name: "Bleue", code: "#3b82f6" }, images: ["/assets/product_2.jpg"], stock: 12 },
    { size: "L", color: { name: "Bleue", code: "#3b82f6" }, images: ["/assets/product_2.jpg"], stock: 0 },
    { size: "M", color: { name: "Rouge", code: "#ef4444" }, images: ["/assets/product5.webp"], stock: 20 },
  ],
};

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<string>("Black");
  const [selectedSize, setSelectedSize] = useState<string>("M");

  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [outOfStockVariant, setOutOfStockVariant] = useState<{
    size: string;
    color: { name: string; code: string };
    image: string;
  } | null>(null);

  const availableColors = useMemo(() => {
    const colors = productData.variants.map(v => v.color);
    return [...new Map(colors.map(item => [item.name, item])).values()];
  }, []);

  const availableSizes = useMemo(() => {
    const sizes = productData.variants
      .filter(v => v.color.name === selectedColor)
      .map(v => ({ label: v.size, value: v.size }));
    return [...new Map(sizes.map(item => [item.label, item])).values()];
  }, [selectedColor]);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    const variant = productData.variants.find(
      v => v.color.name === selectedColor && v.size === size
    );

    if (variant && variant.stock === 0) {
      setOutOfStockVariant({
        size: variant.size,
        color: variant.color,
        image: variant.images[0] ?? "/assets/placeholder.jpg",
      });
      setIsNotifyModalOpen(true);
    }
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    const firstAvailableVariant = productData.variants.find(
      v => v.color.name === colorName
    );
    if (firstAvailableVariant?.size) {
      setSelectedSize(firstAvailableVariant.size);
    } else {
      setSelectedSize("M"); 
    }
  };

  const currentImages = useMemo(() => {
    return (
      productData.variants.find(v => v.color.name === selectedColor)?.images || []
    );
  }, [selectedColor]);

  const infoProductData = {
    category: productData.category,
    title: productData.title,
    price: productData.price,
    description: productData.description,
    sizes: availableSizes,
    colors: availableColors,
    images: currentImages,
  };

  return (
    <>
      <Container
        maxWidth="100vw"
        className="px-4 py-12 mx-auto lg:px-40 space-y-18"
      >
        <div className="flex flex-col justify-center gap-20 sm:flex-row">
          <div className="w-full space-y-8 lg:w-2/5">
            <ProductGallery images={currentImages} title={productData.title} />
            <Reviews className="max-sm:hidden sm:block" />
          </div>

          <ProductInfos
            productData={infoProductData}
            selectedColor={selectedColor}
            setSelectedColor={handleColorChange}
            selectedSize={selectedSize}
            setSelectedSize={handleSizeChange}
          />

          <div className="sm:hidden max-sm:block">
            <Reviews />
          </div>
        </div>

        <ProductSuggestion />
      </Container>

      <NotifyMeModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        product={productData}
        variant={outOfStockVariant}
      />
    </>
  );
}
