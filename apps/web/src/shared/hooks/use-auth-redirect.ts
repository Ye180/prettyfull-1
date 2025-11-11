"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../lib/auth.client";

/**
 * Redirige l'utilisateur s'il est déjà connecté
 * ✅ Supporte les redirections dynamiques via ?callbackUrl=/checkout
 */
export function useAuthRedirect(defaultRedirect: string = "/account") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      // Vérifie si on a une URL de callback
      const callbackUrl = searchParams.get("callbackUrl") || defaultRedirect;
      router.push(callbackUrl);
    }
  }, [session, isPending, router, searchParams, defaultRedirect]);

  return { session, isPending };
}
