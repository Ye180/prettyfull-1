import { defineConfig, loadEnv } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

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
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    disable: false,
    // backendUrl:process.env.MEDUSA_BACKEND_URL,
    backendUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
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
//           {
//    resolve: "@medusajs/file-s3",
//   options: {
//     s3_url: process.env.S3_ENDPOINT,
//     bucket: process.env.S3_BUCKET,
//     region: process.env.S3_REGION,
//     access_key_id: process.env.S3_ACCESS_KEY_ID,
//     secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
//     s3_force_path_style: true, // Très important pour les solutions auto-hébergées comme RustFS
//   },
// },
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