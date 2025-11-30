"use client";

import Title from "@/shared/components/molecules/core/title";
import {
  CardProduct,
  GridCardProduct,
  normalizeCollectionProducts,
  RawCollectionProduct,
} from "@prettyfull/ui";
import { useTranslations } from "next-intl";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsSameCollection } from "@/shared/api/medusa/get-products-same-collection";

const ShopGrid = () => {
  const t = useTranslations("HomePage.news");

  const {
    data: productSameCollection,
    isLoading: loadingProductsSameCollection,
  } = useGetProductsSameCollection();

  return (
    <Container maxWidth="100vw" className="px-4 space-y-8 w-full lg:px-40">
      <Title title="$4 & UNDER BLOWOUT!" buttonLabel={t("viewAll")} />
      <GridCardProduct>
        <>
          {productSameCollection?.map((group) => {
            const normalized = normalizeCollectionProducts(
              group as RawCollectionProduct
            );
            return (
              <CardProduct key={normalized.collectionId} product={normalized} />
            );
          })}
        </>
      </GridCardProduct>
    </Container>
  );
};

export default ShopGrid;
