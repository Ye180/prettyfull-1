import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL, // The base URL of your auth server
  plugins: [
    inferAdditionalFields({
      user: {
        lastName: {
          type: "string",
          required: true,
          defaultValue: "",
        },
        phone: {
          type: "string",
          required: false,
        },
        role: {
          type: "string",
          required: false,      
          defaultValue: "user",
        },
        status: {
          type: "string",
          required: false,
          defaultValue: "active",
        },
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
        country: {
          type: "string",
          required: false,
          defaultValue: "CI",
        },
        dateOfBirth: {
          type: "date",
          required: false,
        },
        lastLoginAt: {
          type: "date",
          required: false,
        },
      },
    }),
  ],
});

export const signIn: typeof authClient.signIn = authClient.signIn;

export const signUp: typeof authClient.signUp = authClient.signUp;

export const signOut: typeof authClient.signOut = authClient.signOut;

export const getSession: typeof authClient.getSession = authClient.getSession;
