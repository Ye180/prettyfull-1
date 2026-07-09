import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL!,
  auth: {
    type: "jwt",
  },
  publishableKey: MEDUSA_PUBLISHABLE_KEY!,
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL!,
  auth: {
    type: "session",
  },
  publishableKey: MEDUSA_PUBLISHABLE_KEY!,
})

