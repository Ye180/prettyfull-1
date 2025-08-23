import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
import Flex from "../../../../../../packages/ui/src/layouts/helpers/flex";

const LoginPage = () => {
  return (
    <Flex className="h-full w-full [&>*]:w-full pd-8">
      <Flex settings={{ justify: "center", isColumn: true }}>
        {/* Form */}
        {/* Form Header */}
        <header>
          <div className="space-y-8">
            <h3>Create an account</h3>
            {/* SSO Button */}
            <Flex>
              <Button variant="outline" fullWidth>
                Continue with Apple
              </Button>
              <Button variant="outline" fullWidth>
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
            <Input label="Email" />
            <Input label="Password" />
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
    </Flex>
  );
};

export default LoginPage;
