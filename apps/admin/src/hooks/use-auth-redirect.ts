"use client";

import { authClient } from "@/shared/lib/auth-client";
import { useRouter } from "next/router";
import { useEffect } from "react";

/**
 * Hook to redirect authenticated users
 * Use this in auth pages (login, register) to redirect if already logged in
 */
export function useAuthRedirect(redirectTo: string = "/") {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isPending };
}

/**
 * Hook to protect client-side routes
 * Use this to redirect unauthenticated users to login
 */
export function useRequireAuth(redirectTo: string = "/auth/login") {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  return { session, isPending };
}
