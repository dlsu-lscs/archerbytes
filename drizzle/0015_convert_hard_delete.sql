ALTER TABLE "bookmarks" DROP COLUMN "is_bookmarked";--> statement-breakpoint
ALTER TABLE "bookmarks" DROP COLUMN "updated_at";--> statement-breakpoint
DROP INDEX "bookmarks_user_bookmarked_idx";
