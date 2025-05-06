DROP SCHEMA IF EXISTS "refunds" CASCADE;
DROP TYPE IF EXISTS "public"."error_refund" CASCADE;
DROP TYPE IF EXISTS "public"."type_refund" CASCADE;
DROP TABLE IF EXISTS "refunds"."re_logs" CASCADE;
DROP TABLE IF EXISTS "refunds"."re_rfc_failed" CASCADE;
DROP TABLE IF EXISTS "refunds"."re_rfc_success" CASCADE;

CREATE SCHEMA "refunds";
--> statement-breakpoint
CREATE TYPE "public"."error_refund" AS ENUM('RFC no encontrado', 'plaza no encontrada', 'RFC, plaza no activa');--> statement-breakpoint
CREATE TYPE "public"."type_refund" AS ENUM('cierre_vigencia', 'creacion', 'eliminacion_responsabilidades');--> statement-breakpoint
CREATE TABLE "refunds"."re_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refunds"."re_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"process_fortnight" char(6) NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"rfc_created" smallint DEFAULT 0 NOT NULL,
	"rfc_deleted_responsabilities" smallint DEFAULT 0 NOT NULL,
	"rfc_deleted_employee_concept" smallint DEFAULT 0 NOT NULL,
	"rfc_closed_term" smallint DEFAULT 0 NOT NULL,
	"rfc_succesed" smallint DEFAULT 0 NOT NULL,
	"rfc_failed" smallint DEFAULT 0 NOT NULL,
	"has_error" boolean DEFAULT false NOT NULL,
	"active_before" integer DEFAULT 0 NOT NULL,
	"active_after" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds"."re_rfc_failed" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refunds"."re_rfc_failed_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"refund_logs_id" integer NOT NULL,
	"rfc" char(13) NOT NULL,
	"type" "type_refund" NOT NULL,
	"error" "error_refund" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds"."re_rfc_success" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "refunds"."re_rfc_success_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"refund_logs_id" integer NOT NULL,
	"rfc" char(13) NOT NULL,
	"type" "type_refund" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "refunds"."re_logs" ADD CONSTRAINT "re_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds"."re_rfc_failed" ADD CONSTRAINT "re_rfc_failed_refund_logs_id_re_logs_id_fk" FOREIGN KEY ("refund_logs_id") REFERENCES "refunds"."re_logs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds"."re_rfc_success" ADD CONSTRAINT "re_rfc_success_refund_logs_id_re_logs_id_fk" FOREIGN KEY ("refund_logs_id") REFERENCES "refunds"."re_logs"("id") ON DELETE no action ON UPDATE no action;