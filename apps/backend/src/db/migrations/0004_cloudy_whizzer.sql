CREATE TYPE "public"."discount_type" AS ENUM('percentage', 'fixed');--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(40) NOT NULL,
	"description" text,
	"discount_type" "discount_type" NOT NULL,
	"discount_value" integer NOT NULL,
	"min_order_amount" integer,
	"max_discount_amount" integer,
	"usage_limit" integer,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"status" "activation_status" DEFAULT 'active' NOT NULL,
	"starts_at" timestamp with time zone,
	"ends_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_value_positive" CHECK ("promo_codes"."discount_value" > 0),
	CONSTRAINT "promo_codes_percentage_range" CHECK ("promo_codes"."discount_type" <> 'percentage' or "promo_codes"."discount_value" <= 100),
	CONSTRAINT "promo_codes_schedule_order" CHECK ("promo_codes"."starts_at" is null or "promo_codes"."ends_at" is null or "promo_codes"."ends_at" > "promo_codes"."starts_at")
);
--> statement-breakpoint
ALTER TABLE "carts" ADD COLUMN "discount_code_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_code_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discount_code" varchar(40);--> statement-breakpoint
CREATE UNIQUE INDEX "promo_codes_code_unique" ON "promo_codes" USING btree ("code");--> statement-breakpoint
CREATE INDEX "promo_codes_status_idx" ON "promo_codes" USING btree ("status");--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_discount_code_id_promo_codes_id_fk" FOREIGN KEY ("discount_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_code_id_promo_codes_id_fk" FOREIGN KEY ("discount_code_id") REFERENCES "public"."promo_codes"("id") ON DELETE set null ON UPDATE no action;