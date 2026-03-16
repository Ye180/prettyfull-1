import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL ="https://admin.prettyfull.shop/"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "jwt",
  },
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "session",
  },
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

