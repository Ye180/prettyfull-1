import { Button } from "@prettyfull/ui";

const page = () => {
  return (
    <div className="min-h-screen  space-y-12 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4">
        {/* Logo */}
        <div className="mb-2">
          <h1 className="text-6xl font-extralight text-slate-900">
            PrettyFull Shop
          </h1>
        </div>

        {/* Subtitle - reduced spacing with mb-2 instead of default gap */}
        <div>
          <p className="text-xl text-slate-600 font-medium">
            Beautiful Ecommerce In Construction
          </p>
        </div>

        {/* <Card_Product /> */}

        {/* Call to action */}
        <div className="mt-8">
          <Button>Get Started</Button>
        </div>
      </div>

      <div className="  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
  );
};

export default page;
