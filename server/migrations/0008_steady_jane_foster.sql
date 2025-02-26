ALTER TABLE "user" ALTER COLUMN "twoFactorEnabled" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "twoFactorEnabled" SET DEFAULT 0;