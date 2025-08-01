import { Button } from "@prettyfull/ui";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center space-y-4">
        {/* Logo */}
        <div className="mb-2">
          <h1 className="text-6xl font-bold text-slate-900">PrettyFull Shop</h1>
        </div>

        {/* Subtitle - reduced spacing with mb-2 instead of default gap */}
        <div>
          <p className="text-xl text-slate-600 font-medium">
            Beautiful Ecommerce In Construction
          </p>
        </div>

        {/* Call to action */}
        <div className="mt-8">
          <Button className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
