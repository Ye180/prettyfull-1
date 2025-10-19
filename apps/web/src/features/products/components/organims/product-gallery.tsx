"use client";

import { cn } from "@prettyfull/utils";
import Image, { StaticImageData } from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

interface ProductGalleryProps {
  images: (string | StaticImageData)[];
  title: string;
  className?: string;
  activeImage: number;
  setActiveImage: Dispatch<SetStateAction<number>>;
}

export function ProductGallery({
  images,
  title,
  className,
  activeImage,
  setActiveImage,
}: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn("relative w-full aspect-square bg-gray-100", className)}
      >
        <div className="flex items-center justify-center h-full text-gray-500">
          Aucune image disponible
        </div>
      </div>
    );
  }

  // 🔄 Gestion du swipe sur mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () =>
      setActiveImage((prev) => (prev < images.length - 1 ? prev + 1 : 0)),
    onSwipedRight: () =>
      setActiveImage((prev) => (prev > 0 ? prev - 1 : images.length - 1)),
    trackMouse: true,
  });

  return (
    <>
      <div className={cn("flex-row gap-4 w-fit relative sm:flex", className)}>
        {/* Thumbnails (desktop) */}
        <div className="hidden grid-cols-2 gap-4 sm:grid place-content-start">
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(index)}
              className={cn(
                "w-20 h-20 cursor-pointer border hover:border-black rounded-sm overflow-hidden transition-all",
                activeImage === index ? "border-black shadow-md" : "border-gray-200"
              )}
            >
              <Image
                src={image}
                alt={`${title} - vue ${index + 1}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Image principale (desktop) */}
        <div
          className="relative hidden sm:flex cursor-zoom-in w-fit"
          onClick={() => setIsZoomed(true)}
        >
          <Image
            src={images[activeImage] || "/placeholder.png"}
            alt={title}
            width={500}
            height={800}
            className="object-cover"
            priority
          />
        </div>

        {/* Mobile gallery horizontal */}
        <div className="w-full overflow-x-auto sm:hidden flex gap-2">
          {images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`${title} - vue ${index + 1}`}
              width={300}
              height={500}
              className="cursor-zoom-in rounded-lg"
              onClick={() => {
                setActiveImage(index);
                setIsZoomed(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Lightbox plein écran améliorée */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...swipeHandlers}
          >
            {/* Bouton fermeture */}
            <button
              className="absolute top-4 right-4 text-white text-3xl z-50"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>

            {/* Image principale centrée */}
            <div
              className="relative flex items-center justify-center max-h-[80vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[activeImage] || "/placeholder.png"}
                alt={title}
                width={900}
                height={1200}
                className="object-contain max-h-[80vh] w-auto mx-auto rounded-lg transition-all"
                priority
              />

              {/* Flèches desktop */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-5xl hidden sm:block"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-5xl hidden sm:block"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Miniatures visibles en bas */}
            <div className="mt-6 flex justify-center gap-2 overflow-x-auto max-w-[90vw] pb-2 scrollbar-hide">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "relative w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                    activeImage === index
                      ? "border-white scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${title} miniature ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
