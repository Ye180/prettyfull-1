import { z } from "zod";

const schema = z.object({
	NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
	PORT: z.coerce.number().default(7777),
	DATABASE_URL: z.string().url(),
	REDIS_URL: z.string().url().optional(),
	CORS_ORIGINS: z
		.string()
		.default("http://localhost:3000,http://localhost:3001")
		.transform((v) => v.split(",").map((s) => s.trim())),
});

export const env = schema.parse(process.env);
