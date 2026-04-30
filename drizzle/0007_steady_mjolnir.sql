ALTER TABLE "article_reactions" DROP CONSTRAINT IF EXISTS "unique_user_article";--> statement-breakpoint
ALTER TABLE "article_reactions" ADD COLUMN "article_id_int" integer;--> statement-breakpoint
UPDATE "article_reactions"
SET "article_id_int" = "article_id"::integer
WHERE "article_id" ~ '^[0-9]+$';--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "article_reactions"
    WHERE "article_id_int" IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot migrate article_reactions.article_id to integer because non-numeric values exist.';
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "article_reactions" ALTER COLUMN "article_id_int" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "article_reactions" ADD CONSTRAINT "article_reactions_article_id_articles_id_fk" FOREIGN KEY ("article_id_int") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_reactions" DROP COLUMN "article_id";--> statement-breakpoint
ALTER TABLE "article_reactions" RENAME COLUMN "article_id_int" TO "article_id";--> statement-breakpoint
ALTER TABLE "article_reactions" ADD CONSTRAINT "unique_user_article" UNIQUE("user_id","article_id");--> statement-breakpoint

ALTER TABLE "comments" ADD COLUMN "article_id_int" integer;--> statement-breakpoint
UPDATE "comments"
SET "article_id_int" = "article_id"::integer
WHERE "article_id" ~ '^[0-9]+$';--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "comments"
    WHERE "article_id_int" IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot migrate comments.article_id to integer because non-numeric values exist.';
  END IF;
END $$;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "article_id_int" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_article_id_articles_id_fk" FOREIGN KEY ("article_id_int") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" DROP COLUMN "article_id";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "article_id_int" TO "article_id";