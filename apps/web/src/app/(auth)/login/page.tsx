import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Button, Input, Logo } from "@prettyfull/ui";
import Link from "next/link";
import Container from "../../../../../../packages/ui/src/layouts/helpers/container";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

const LoginPage = () => {
  return (
    <Flex className="h-full  w-full [&>*]:w-full ">
      <Container maxWidth="70rem" className="space-y-28">
        <Logo className="mt-20 " />
        <Flex settings={{ justify: "center", isColumn: true }}>
          {/* Form */}
          {/* Form Header */}
          <header>
            <div className="space-y-8">
              <div className="mb-20">
                <h3>Welcome Back to Snaely</h3>
                <p className="text-neutral-500">
                  Log in to your account to shopping the newest fashion style
                </p>
              </div>
              {/* SSO Button */}
              <Flex className="flex-col">
                <Button
                  variant="outline"
                  icon={<AppleIcon className="size-12" />}
                  fullWidth
                >
                  Continue with Apple
                </Button>
                <Button
                  variant="outline"
                  icon={<GoogleIcon className="size-11" />}
                  fullWidth
                >
                  Continue with Google
                </Button>
              </Flex>
              <Flex
                settings={{ align: "center" }}
                className="text-center my-12 font-medium w-full  "
              >
                <div className=" w-1/2  border-t border-black/10" />
                or
                <div className=" w-1/2  border-t border-black/10" />
              </Flex>
            </div>
          </header>
          <main>
            <div className="space-y-8">
              <Input label="Email" />

              <Input type="password" label="Password" />
            </div>
          </main>
          <Flex
            as="footer"
            settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
            className="mt-[5.2rem]"
          >
            <Button fullWidth>Login</Button>
            <p className="font-medium text-grey">
              Don’t have an account?{" "}
              <Link href="/create-account" className="text-black underline">
                Create Account
              </Link>
            </p>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default LoginPage;
