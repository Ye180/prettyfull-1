import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
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
 * Get the current session from the Better Auth API
 * Works in getServerSideProps, API routes or any Node context.
 */
export const getServerSession = cache(
  async (sessionToken?: string): Promise<Session | null> => {
    try {
      if (!sessionToken) return null;

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

      if (!response.ok) return null;

      const session = await response.json();
      return session;
    } catch (error) {
      console.error("Error fetching server session:", error);
      return null;
    }
  }
);

/**
 * Require authentication (for getServerSideProps or API routes)
 */
export async function requireAuth(
  context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }
): Promise<Session | null> {
  const sessionToken =
    (context as any).req?.cookies?.["better-auth.session_token"] || null;
  const session = await getServerSession(sessionToken);
  return session ?? null;
}

/**
 * Get current user (for getServerSideProps or API routes)
 */
export async function getCurrentUser(
  context: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse }
): Promise<ExtendedUser | null> {
  const session = await requireAuth(context);
  return session?.user ?? null;
}
