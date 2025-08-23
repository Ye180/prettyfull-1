import Image from "next/image";
import { PropsWithChildren } from "react";
import AuthLayout from "../../../../../packages/ui/src/layouts/auth-layout";

const AuthRootLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <AuthLayout
      children={children}
      rightChildren={
        <div>
          <Image
            className="object-cover"
            src="/assets/auth-bg.png"
            fill
            alt="Auth Right Background"
          />
        </div>
      }
    />
  );
};

export default AuthRootLayout;
