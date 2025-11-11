"use client";

import { useGetChildrenCategory } from "@/features/homepage/api/get-children-category";
import { getItem } from "@/lib/utils/local-storage";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import BottomHeader from "../molecules/header/bottom";
import NavBarHeaders from "../molecules/header/navbar";

const Header = ({ main_category }: { main_category: any }) => {
  const params = useParams();
  const [division] = useQueryState("division");
  const category = getItem("category");

  const { data: children_category, isLoading: secondaryLoading } =
    useGetChildrenCategory(params.id as string);

  // Récupérer le parent slug depuis l'URL ou depuis les params
  const parentSlug = useMemo(() => {
    // D'abord vérifier le query param division
    if (division) return division;

    // Sinon, essayer de trouver le parent dans main_category à partir de params.id
    if (params.id && main_category) {
      const found = main_category.find((cat: any) => cat.slug === params.id);
      return found?.slug;
    }

    return undefined;
  }, [division, params.id, main_category]);

  return (
    <header className="py-8 bg-white max-sm:h-fit ">
      <nav className="flex flex-col justify-start px-4 mx-auto gap-y-4 sm:px-6 lg:px-8 max-auto ">
        <NavBarHeaders
          main_category={main_category}
          secondary_category={children_category}
        />
        <BottomHeader
          secondary_category={children_category || category}
          loading={secondaryLoading}
          parentSlug={parentSlug}
        />
      </nav>
    </header>
  );
};

export default Header;
