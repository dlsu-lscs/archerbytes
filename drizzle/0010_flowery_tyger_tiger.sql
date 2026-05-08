ALTER TABLE "article_categories" ALTER COLUMN "cms_category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "cms_article_id" DROP NOT NULL;