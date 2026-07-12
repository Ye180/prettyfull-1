import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL!,
  auth: {
    type: "jwt",
  },
  publishableKey: "pk_cb2ca28666774adf4ba4fb2e40ed551184de75fc035d3434c4c680cd47ae6337",
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL!,
  auth: {
    type: "session",
  },
  publishableKey: "pk_cb2ca28666774adf4ba4fb2e40ed551184de75fc035d3434c4c680cd47ae6337",
})

