ALTER TABLE "comments" ALTER COLUMN "article_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "article_reactions" ALTER COLUMN "article_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "occupation" text;--> statement-breakpoint
ALTER TABLE "article_categories" ADD COLUMN "cms_category_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "cms_article_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_reactions" ADD CONSTRAINT "article_reactions_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_categories_cms_category_id_idx" ON "article_categories" USING btree ("cms_category_id");--> statement-breakpoint
CREATE INDEX "articles_cms_article_id_idx" ON "articles" USING btree ("cms_article_id");--> statement-breakpoint
CREATE INDEX "articles_deleted_at_idx" ON "articles" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "article_categories" ADD CONSTRAINT "article_categories_cms_category_id_unique" UNIQUE("cms_category_id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_cms_article_id_unique" UNIQUE("cms_article_id");