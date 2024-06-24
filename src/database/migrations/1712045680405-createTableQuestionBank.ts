import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableQuestionBank1712045680405 implements MigrationInterface {
    name = 'CreateTableQuestionBank1712045680405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_bank_type_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "question_bank" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "is_parent" boolean NOT NULL DEFAULT false, "parent_id" integer, "body" text NOT NULL, "choices" text NOT NULL, "instruction" text NOT NULL, "response" text NOT NULL, "type" "public"."question_bank_type_enum" NOT NULL, CONSTRAINT "PK_ddf9cd18bcda25d31e7ef21b519" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "question_bank"`);
        await queryRunner.query(`DROP TYPE "public"."question_bank_type_enum"`);
    }

}
