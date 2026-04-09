import Medusa from "@medusajs/js-sdk"

let MEDUSA_BACKEND_URL = "https://admin.prettyfull.shop"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})