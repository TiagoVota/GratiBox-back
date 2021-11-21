CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(42) NOT NULL,
	"email" varchar(42) NOT NULL UNIQUE,
	"password" TEXT NOT NULL UNIQUE,
	"is_subscriber" BOOLEAN NOT NULL DEFAULT FALSE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "plans" (
	"id" serial NOT NULL,
	"name" varchar(42) NOT NULL UNIQUE,
	CONSTRAINT "plans_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "frequencies" (
	"id" serial NOT NULL,
	"week_day" integer UNIQUE,
	"month_day" integer UNIQUE,
	CONSTRAINT "frequencies_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(42) NOT NULL UNIQUE,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "subscriptions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"frequency_id" integer NOT NULL,
	"date_start" DATE NOT NULL DEFAULT 'now()',
	"date_end" DATE,
	CONSTRAINT "subscriptions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "signatures_products" (
	"id" serial NOT NULL,
	"subscription_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "signatures_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "addresses" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"full_name" varchar(42) NOT NULL,
	"address" varchar(100) NOT NULL,
	"cep" varchar(8) NOT NULL,
	"city" varchar(42) NOT NULL,
	"state_id" integer NOT NULL,
	CONSTRAINT "addresses_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "states" (
	"id" serial NOT NULL,
	"name" varchar(42) NOT NULL UNIQUE,
	CONSTRAINT "states_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);







ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk1" FOREIGN KEY ("plan_id") REFERENCES "plans"("id");
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_fk2" FOREIGN KEY ("frequency_id") REFERENCES "frequencies"("id");

ALTER TABLE "signatures_products" ADD CONSTRAINT "signatures_products_fk0" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id");
ALTER TABLE "signatures_products" ADD CONSTRAINT "signatures_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_fk1" FOREIGN KEY ("state_id") REFERENCES "states"("id");










