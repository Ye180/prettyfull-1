import HeaderWishlist from "@/features/wishlist/components/molecules/header-wishlist";
import GridWishlistLayout from "@/features/wishlist/components/organims/grid-wishlist";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";

const Page = () => {
  return (
    <Container
      maxWidth="100vw"
      className="py-4 space-y-8 max-lg:px-4 lg:px-40 "
    >
      <HeaderWishlist />

      <GridWishlistLayout />
    </Container>
  );
};

export default Page;
