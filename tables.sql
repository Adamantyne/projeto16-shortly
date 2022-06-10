CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"email" TEXT NOT NULL,
	"token" TEXT NOT NULL,
	"createdDate" TIMESTAMP NOT NULL DEFAULT NOW(),
	"expiredDate" TIMESTAMP,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "urls" (
	"id" serial NOT NULL,
	"userEmail" TEXT NOT NULL,
	"shortUrl" TEXT NOT NULL UNIQUE,
	"url" TEXT NOT NULL,
	"visitCount" integer NOT NULL DEFAULT 0,
	"createdData" TIMESTAMP NOT NULL DEFAULT NOW(),
	CONSTRAINT "urls_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("email") REFERENCES "users"("email");

ALTER TABLE "urls" ADD CONSTRAINT "urls_fk0" FOREIGN KEY ("userEmail") REFERENCES "users"("email");