import { Skeleton } from "@prettyfull/ui";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

export default function ProductSkeleton() {
  return (
    <Container maxWidth="100vw" className="px-4 py-2 mx-auto sm:py-12 md:px-40">
      <div className="flex flex-col gap-8 justify-center animate-pulse md:flex-row">
        {/* Images à gauche */}
        <div className="flex flex-col gap-4 max-md:hidden">
          <div className="w-20 h-20 bg-gray-200"></div>
          <div className="w-20 h-20 bg-gray-200"></div>
          <div className="w-20 h-20 bg-gray-200"></div>
        </div>

        {/* Image principale */}
        <Skeleton className=" bg-gray-200  w-full h-[400px] md:w-200! md:h-[600px]" />

        {/* Détails du produit */}
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          {/* Collection */}
          <div className="w-32 h-12 bg-gray-200 rounded"></div>

          {/* Titre */}
          <div className="w-1/4 bg-gray-300 rounded md:w-3/4 h-15"></div>

          {/* Prix */}
          <div className="flex gap-3 items-center">
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
            <div className="w-16 h-5 bg-gray-100 rounded"></div>
          </div>

          {/* Tailles */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Couleurs */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-20 h-10 bg-gray-200"></div>
              ))}
            </div>
          </div>

          {/* Bouton */}
          <div className="mt-4 w-40 h-12 bg-gray-300 rounded-full"></div>

          {/* Description */}
          <div className="mt-6">
            <Skeleton className=" bg-gray-200  w-200! h-[200px] max-md:hidden" />
          </div>
        </div>
      </div>
    </Container>
  );
}
