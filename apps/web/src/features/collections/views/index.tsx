"use client";

import Banner from "@/features/collections/organims/banner";

import FilterLayout from "@/features/collections/organims/filter-layout";

import GridCollectionLayout from "@/features/collections/organims/grid-layout";

import CategoryCollection from "@/features/collections/organims/mini-category";

import NavbarCollection from "@/features/collections/organims/mini-navbar";

import { ScrollArea } from "@prettyfull/ui";
import { useParams } from "next/navigation";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import { useGetProductsByCategorySlug } from "../api/get-product-of-cat-by-slug";

const CollectionViews = () => {
  const params = useParams();

  console.log("Collection Params:", params);

  const { data: productsBySlug, isLoading: isLoadingBySlug } =
    useGetProductsByCategorySlug(params.slug as string);

  console.log("Fetched products by slug:", productsBySlug);
  // console.log("Fetched products by slug:", isLoadingBySlug);
  return (
    <div className="pb-32 space-y-16 ">
      <div className="relative h-[20vh] md:h-[35vh] px-4 bg-white">
        <Banner />
      </div>
      <Container maxWidth="100vw" className="px-4 space-y-12 lg:px-32">
        <div className="flex items-center justify-center">
          <CategoryCollection />
        </div>
        <div className="pb-4 border-b border-neutral-200">
          <NavbarCollection />
        </div>
        <div className="flex items-start justify-center gap-8 !w-full ">
          <FilterLayout className="h-[200vh] mt-4 border bg-white backdrop-blur-md border-gray-200" />
          <ScrollArea className="py-4 max-md:hidden md:flex-1 h-[200vh]  scrolbarRecomandation">
            <GridCollectionLayout
              products={productsBySlug}
              loading={isLoadingBySlug}
            />
          </ScrollArea>
          <div className="hidden max-md:flex md:hidden">
            <GridCollectionLayout
              products={productsBySlug}
              loading={isLoadingBySlug}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};
export default CollectionViews;
