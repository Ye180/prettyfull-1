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
              <h3>Create an account</h3>
              {/* SSO Button */}
              <Flex>
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
            <div className="grid grid-cols-2 gap-8">
              <Input label="First Name" />
              <Input label="Last Name" />
              <div className="col-span-2">
                <Input label="Email" />
              </div>
              <div className="col-span-2">
                <Input label="Password" />
              </div>
            </div>
          </main>
          <Flex
            as="footer"
            settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
            className="mt-[5.2rem]"
          >
            <Button fullWidth>Create Account</Button>
            <p className="font-medium text-grey">
              Already have an account?{" "}
              <Link href="/login" className="text-black underline">
                Login
              </Link>
            </p>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};

export default LoginPage;
