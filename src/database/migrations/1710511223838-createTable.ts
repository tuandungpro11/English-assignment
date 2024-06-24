import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1710511223838 implements MigrationInterface {
    name = 'CreateTable1710511223838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."student_gender_enum" AS ENUM('MALE', 'FEMALE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "student" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "avatar" character varying, "gender" "public"."student_gender_enum" NOT NULL, "role_id" integer, CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_name_enum" AS ENUM('TEACHER', 'STUDENT')`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" "public"."role_name_enum" NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teacher" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "email" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "avatar" character varying, "role_id" integer, CONSTRAINT "UQ_00634394dce7677d531749ed8e8" UNIQUE ("email"), CONSTRAINT "PK_2f807294148612a9751dacf1026" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "description" text, "creator_id" integer, CONSTRAINT "PK_0b9024d21bdfba8b1bd1c300eae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "is_parent" boolean NOT NULL DEFAULT false, "parent_id" integer, "body" text NOT NULL, "choices" text NOT NULL, "instruction" text NOT NULL, "response" text NOT NULL, "type" "public"."question_type_enum" NOT NULL, "assignment_id" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assignment" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "total_mark" numeric(10,0) NOT NULL, "time_start" TIMESTAMP, "time_end" TIMESTAMP, "time_allow" integer, "question_count" integer NOT NULL DEFAULT '0', "class_id" integer, CONSTRAINT "PK_43c2f5a3859f54cedafb270f37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "student" ADD CONSTRAINT "FK_ffc0d7fecec8c0b216986095154" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD CONSTRAINT "FK_50d7d7078c2b1f018f57518fc1e" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class" ADD CONSTRAINT "FK_6d8fd8c7a375180dd8f785b5593" FOREIGN KEY ("creator_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_6f8b1fecfcd97f7007d2e59007c" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD CONSTRAINT "FK_7b0a1a817f6330532a2f1b44d16" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP CONSTRAINT "FK_7b0a1a817f6330532a2f1b44d16"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_6f8b1fecfcd97f7007d2e59007c"`);
        await queryRunner.query(`ALTER TABLE "class" DROP CONSTRAINT "FK_6d8fd8c7a375180dd8f785b5593"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP CONSTRAINT "FK_50d7d7078c2b1f018f57518fc1e"`);
        await queryRunner.query(`ALTER TABLE "student" DROP CONSTRAINT "FK_ffc0d7fecec8c0b216986095154"`);
        await queryRunner.query(`DROP TABLE "assignment"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
        await queryRunner.query(`DROP TABLE "class"`);
        await queryRunner.query(`DROP TABLE "teacher"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TYPE "public"."student_gender_enum"`);
    }

}
