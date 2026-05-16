CREATE TABLE "comment_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" integer NOT NULL,
	"reaction_type" "reaction_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_comment" UNIQUE("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"occupation" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "article_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"cms_category_id" integer,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "article_categories_cms_category_id_unique" UNIQUE("cms_category_id"),
	CONSTRAINT "article_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "article_reactions" DROP CONSTRAINT "article_reactions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "article_reactions" ALTER COLUMN "reaction_type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "comment_reactions" ALTER COLUMN "reaction_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."reaction_type";--> statement-breakpoint
CREATE TYPE "public"."reaction_type" AS ENUM('like', 'heart', 'care', 'haha', 'wow', 'sad', 'angry');--> statement-breakpoint
ALTER TABLE "article_reactions" ALTER COLUMN "reaction_type" SET DATA TYPE "public"."reaction_type" USING "reaction_type"::"public"."reaction_type";--> statement-breakpoint
ALTER TABLE "comment_reactions" ALTER COLUMN "reaction_type" SET DATA TYPE "public"."reaction_type" USING "reaction_type"::"public"."reaction_type";--> statement-breakpoint
ALTER TABLE "comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "article_categories_cms_category_id_idx" ON "article_categories" USING btree ("cms_category_id");--> statement-breakpoint
CREATE INDEX "article_categories_deleted_at_idx" ON "article_categories" USING btree ("deleted_at");--> statement-breakpoint
ALTER TABLE "article_reactions" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "article_reactions" ADD CONSTRAINT "unique_user_article" UNIQUE("user_id","article_id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_cms_article_id_unique" UNIQUE("cms_article_id");--> statement-breakpoint
DROP SEQUENCE "public"."article_categories_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."article_reactions_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."articles_id_seq";--> statement-breakpoint
DROP SEQUENCE "public"."comments_id_seq";