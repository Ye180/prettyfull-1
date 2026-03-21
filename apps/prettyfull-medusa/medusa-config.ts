import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

const STORE_CORS = process.env.STORE_CORS!;
const ADMIN_CORS = process.env.ADMIN_CORS!;
const AUTH_CORS = process.env.AUTH_CORS!;

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    databaseDriverOptions: {
      ssl: process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
    },
  http: {
      storeCors: STORE_CORS,
      adminCors: ADMIN_CORS,
      authCors: AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: false,
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    path: "/app",
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "garage",
            options: {
              file_url: process.env.GARAGE_PUBLIC_URL,
              access_key_id: process.env.GARAGE_ACCESS_KEY,
              secret_access_key: process.env.GARAGE_SECRET_KEY,
              region: process.env.GARAGE_REGION,
              bucket: process.env.GARAGE_BUCKET,
              endpoint: process.env.GARAGE_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
    {
      resolve: "./src/modules/product-media",
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@medusajs/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
            },
          },
        ],
      },
    },
  ],
});