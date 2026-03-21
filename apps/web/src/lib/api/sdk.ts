import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL  || "https://admin.prettyfull.shop/",
  auth: {
    type: "jwt",
  },
  publishableKey: MEDUSA_PUBLISHABLE_KEY || "pk_1528422233a9c4c28cf0560e3270f8072fda717ed5793a9e2f5e57ea8ee41f46",
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL || "https://admin.prettyfull.shop/",
  auth: {
    type: "session",
  },
  publishableKey: MEDUSA_PUBLISHABLE_KEY || "pk_1528422233a9c4c28cf0560e3270f8072fda717ed5793a9e2f5e57ea8ee41f46",
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

