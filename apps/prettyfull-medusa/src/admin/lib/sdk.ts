import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = __BACKEND_URL__ ?? ""

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})