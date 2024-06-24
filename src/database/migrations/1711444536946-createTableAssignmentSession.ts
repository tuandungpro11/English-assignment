import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAssignmentSession1711444536946 implements MigrationInterface {
    name = 'CreateTableAssignmentSession1711444536946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."assignment_session_status_enum" AS ENUM('1', '2')`);
        await queryRunner.query(`CREATE TABLE "assignment_session" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "mark" numeric(10,0) NOT NULL DEFAULT '0', "time_start" TIMESTAMP, "time_end" TIMESTAMP, "invalid_at" TIMESTAMP, "student_answer" text, "status" "public"."assignment_session_status_enum" NOT NULL DEFAULT '1', "student_id" integer, "assignment_id" integer, CONSTRAINT "PK_a800776b4974ad09fc7c641d48f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d6447fd1cf87c6967be46f251e" ON "assignment_session" ("status") `);
        await queryRunner.query(`ALTER TABLE "assignment_session" ADD CONSTRAINT "FK_913684a4b447ca2aa9f056d7618" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assignment_session" ADD CONSTRAINT "FK_df3fa410621771e0293f1a2a8ed" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment_session" DROP CONSTRAINT "FK_df3fa410621771e0293f1a2a8ed"`);
        await queryRunner.query(`ALTER TABLE "assignment_session" DROP CONSTRAINT "FK_913684a4b447ca2aa9f056d7618"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d6447fd1cf87c6967be46f251e"`);
        await queryRunner.query(`DROP TABLE "assignment_session"`);
        await queryRunner.query(`DROP TYPE "public"."assignment_session_status_enum"`);
    }

}
