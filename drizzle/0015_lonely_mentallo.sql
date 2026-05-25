CREATE TYPE "public"."occupation_enum" AS ENUM('Alumni', 'Student', 'Faculty');--> statement-breakpoint
DROP INDEX "bookmarks_user_bookmarked_idx";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "occupation" SET DATA TYPE "public"."occupation_enum" USING "occupation"::"public"."occupation_enum";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "bookmarks" DROP COLUMN "is_bookmarked";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP COLUMN "updated_at";