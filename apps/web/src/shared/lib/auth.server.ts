import { cookies } from "next/headers";
import { cache } from "react";

/**
 * Extended User type with additional fields from Better Auth
 */
export interface ExtendedUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  // Additional fields from backend
  lastName?: string;
  phone?: string;
  role?: string;
  status?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  country?: string;
  dateOfBirth?: Date;
  lastLoginAt?: Date;
}

export interface Session {
  user: ExtendedUser;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * Get the current session on the server side (Server Components, Server Actions, Route Handlers)
 * This function is cached per request using React cache
 */
export const getServerSession = cache(async (): Promise<Session | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    // Call Better Auth API to validate session
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/get-session`,
      {
        method: "GET",
        headers: {
          Cookie: `better-auth.session_token=${sessionToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const session = await response.json();
    return session;
  } catch (error) {
    console.error("Error fetching server session:", error);
    return null;
  }
});

/**
 * Require authentication - returns session or null if not authenticated
 * Use this in Server Components or Server Actions
 */
export async function requireAuth(): Promise<Session | null> {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  return session;
}

/**
 * Get the current user on the server side
 */
export async function getCurrentUser(): Promise<ExtendedUser | null> {
  const session = await getServerSession();
  return session?.user ?? null;
}
