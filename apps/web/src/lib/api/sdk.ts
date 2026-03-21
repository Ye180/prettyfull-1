import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL ="https://admin.prettyfull.shop/"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "jwt",
  },
  publishableKey: "pk_1528422233a9c4c28cf0560e3270f8072fda717ed5793a9e2f5e57ea8ee41f46",
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

export const sdkStore = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  auth: {
    type: "session",
  },
  publishableKey: "pk_1528422233a9c4c28cf0560e3270f8072fda717ed5793a9e2f5e57ea8ee41f46",
  globalHeaders: {
    "Access-Control-Allow-Origin": "*",
  },
})

