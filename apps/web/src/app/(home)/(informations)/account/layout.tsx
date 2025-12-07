// web/src/app/(home)/(informations)/account/layout.tsx
import React, { PropsWithChildren } from "react";
import { AccountMenu } from "@/features/account/components/account-menu"; 

const AccountLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="md:hidden mb-6">
           <h1 className="text-3xl font-bold text-gray-900">Mon Espace</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          <aside className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-28">
              <AccountMenu />
            </div>
          </aside>

          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
};

export default AccountLayout;