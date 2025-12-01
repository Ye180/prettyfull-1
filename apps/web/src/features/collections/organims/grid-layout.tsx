"use client";

import ProductCardSkeleton from "@/shared/components/organims/product-loading";
import {
  CardProduct,
  GridCardProduct,
  normalizeCollectionProducts,
  RawCollectionProduct,
} from "@prettyfull/ui";

const GridCollectionLayout = ({
  products,
  loading,
}: {
  products: RawCollectionProduct[];
  loading: boolean;
}) => {
  // Fetch products using the custom hook

  if (!products || loading) {
    return (
      <div className="grid grid-cols-4 gap-x-4 gap-y-8 px-2 w-full rounded-md max-sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 scrolbar">
        {Array.from({ length: 16 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  return (
    <div className="px-2 rounded-md max-md:w-full md:w-6/6 scrolbar">
      <GridCardProduct action_grid className="max-sm:gap-y-8">
        <>
          {products?.map((group: RawCollectionProduct) => {
            const normalized = normalizeCollectionProducts(
              group as RawCollectionProduct
            );
            return (
              <CardProduct key={normalized.collectionId} product={normalized} />
            );
          })}
        </>
      </GridCardProduct>
    </div>
  );
};

export default GridCollectionLayout;
