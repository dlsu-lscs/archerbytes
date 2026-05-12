ALTER TABLE "comments" ADD COLUMN "is_edited" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "is_edited" boolean DEFAULT false NOT NULL;