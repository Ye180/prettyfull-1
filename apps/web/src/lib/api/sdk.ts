import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://admin.prettyfull.shop"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "jwt",
  },
  // debug: false, // Désactivé pour éviter les logs en double
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "session",
  },
  // debug: false, // Désactivé pour éviter les logs en double
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})