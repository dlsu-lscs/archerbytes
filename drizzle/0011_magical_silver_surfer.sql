ALTER TABLE "article_categories" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
CREATE INDEX "article_categories_deleted_at_idx" ON "article_categories" USING btree ("deleted_at");