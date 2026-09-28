CREATE TABLE "content_highlights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"icon" varchar(64) NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" varchar(500) NOT NULL,
	"section_key" varchar(64) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"translations" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "content_highlights_section_idx" ON "content_highlights" USING btree ("section_key","status","position");