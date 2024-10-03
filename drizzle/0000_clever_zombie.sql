DO $$ BEGIN
 CREATE TYPE "public"."userType" AS ENUM('common', 'shopkeeper');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"creditorId" integer NOT NULL,
	"debitorId" integer NOT NULL,
	"amount" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"type" "userType" DEFAULT 'common' NOT NULL,
	"hash" varchar NOT NULL,
	"cpf" varchar(14),
	"cnpj" varchar(18),
	"name" varchar(40) NOT NULL,
	"email" varchar(120) NOT NULL,
	CONSTRAINT "users_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "users_cnpj_unique" UNIQUE("cnpj"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallet" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"balance" bigint NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "wallet_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transferences" ADD CONSTRAINT "transferences_creditorId_users_id_fk" FOREIGN KEY ("creditorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transferences" ADD CONSTRAINT "transferences_debitorId_users_id_fk" FOREIGN KEY ("debitorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wallet" ADD CONSTRAINT "wallet_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
