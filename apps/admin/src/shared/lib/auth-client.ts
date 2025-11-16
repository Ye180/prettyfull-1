import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

/**
 * Client-side Better Auth setup
 * Works in Next.js Page Router (only in the browser or client components)
 */
export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "http://localhost:3000/api/auth", // fallback for local dev
  fetchOptions: {
    credentials: "include", // Required for cookies
  },
  plugins: [
    inferAdditionalFields({
      user: {
        lastName: { type: "string", required: true, defaultValue: "" },
        phone: { type: "string", required: false },
        role: { type: "string", required: false, defaultValue: "user" },
        status: { type: "string", required: false, defaultValue: "active" },
        preferredLanguage: {
          type: "string",
          required: false,
          defaultValue: "fr",
        },
        preferredCurrency: {
          type: "string",
          required: false,
          defaultValue: "XOF",
        },
        country: { type: "string", required: false, defaultValue: "CI" },
        dateOfBirth: { type: "date", required: false },
        lastLoginAt: { type: "date", required: false },
      },
    }),
  ],
});

// Re-export main auth actions
export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const getSession = authClient.getSession;
