"use client";

import { AppleIcon } from "@/components/icons/apple-icon";
import { GoogleIcon } from "@/components/icons/google-icon";
import { useActionEvent } from "@/hooks/use-action-event";
import { useAuthRedirect } from "@/shared/hooks/use-auth-redirect";
import { authClient } from "@/shared/lib/auth.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@prettyfull/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Flex from "../../../../../../../packages/ui/src/layouts/helpers/flex";
import {
  registerSchema,
  type RegisterFormData,
} from "../../schemas/register.schema";

export function RegisterForm() {
  const router = useRouter();

  // Redirect if already authenticated
  useAuthRedirect("/account");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { startLoading, endLoading, loading } = useActionEvent();

  const onSubmit = async (data: RegisterFormData) => {
    startLoading();
    const { error } = await authClient.signUp.email({
      name: data.firstName,
      email: data.email,
      password: data.password,
      // Additional fields
      lastName: data.lastName,
    });

    if (error) {
      console.error("Registration error:", error);
      endLoading();
      return;
    }

    // Redirect to account page after successful registration
    endLoading();
    router.push("/account");
  };

  return (
    <Flex settings={{ justify: "center", isColumn: true }}>
      <header>
        <div className="space-y-8">
          <h3>Create an account</h3>
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
            className="w-full my-12 font-medium text-center"
          >
            <div className="w-1/2 border-t border-black/10" />
            or
            <div className="w-1/2 border-t border-black/10" />
          </Flex>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)}>
        <main>
          <div className="grid grid-cols-2 gap-8">
            <Input
              label="First Name"
              {...register("firstName")}
              errorMessage={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              {...register("lastName")}
              errorMessage={errors.lastName?.message}
            />
            <div className="col-span-2">
              <Input
                label="Email"
                type="email"
                {...register("email")}
                errorMessage={errors.email?.message}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="Password"
                type="password"
                {...register("password")}
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
        </main>

        <Flex
          as="footer"
          settings={{ isColumn: true, align: "center", spacing: "gap-10" }}
          className="mt-[5.2rem]"
        >
          <Button type="submit" isLoading={loading} fullWidth>
            Create Account
          </Button>
          <p className="font-medium text-grey">
            Already have an account?{" "}
            <Link href="/login" className="text-black underline">
              Login
            </Link>
          </p>
        </Flex>
      </form>
    </Flex>
  );
}
