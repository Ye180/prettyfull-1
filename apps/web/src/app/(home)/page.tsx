"use client";
import { Button, CardProduct, GridCardProduct } from "@prettyfull/ui";

const page = () => {
  return (
    <>
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
      </div>
      <div className="w-full flex justify-between  max-lg:flex-col p-4 bg-gradient-to-br from-slate-50 to-slate-100 lg:px-[8rem]">
        <GridCardProduct className="" action_grid={true}>
          <>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className=" w-full aspect-10/9 ">
                <CardProduct
                  notVariable={{
                    color: {
                      code: "#FF0000",
                      label: "Rouge",
                    },
                    image: "/assets/product_1.jpg",
                    quantity: 1,
                    size: ["S", "M", "L"],
                  }}
                  onClick={() => {}}
                  price={12000}
                  promotion={{
                    pourcentage: 50,
                    reduced_price: 6000,
                  }}
                  small_description="Top polyvalente á Manche"
                  title="Sweet-Top"
                />
              </div>
            ))}
          </>
        </GridCardProduct>
      </div>
    </>
  );
};

export default page;
