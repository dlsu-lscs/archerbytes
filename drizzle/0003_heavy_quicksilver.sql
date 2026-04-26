CREATE INDEX IF NOT EXISTS "articles_status_idx" ON "articles" ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_published_at_idx" ON "articles" ("published_at" DESC);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_category_id_idx" ON "articles" ("category_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_status_published_at_idx" ON "articles" ("status", "published_at" DESC);