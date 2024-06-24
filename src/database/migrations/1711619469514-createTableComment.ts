import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableComment1711619469514 implements MigrationInterface {
    name = 'CreateTableComment1711619469514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "body" text NOT NULL, "teacher_id" integer, "student_id" integer, "assignment_session_id" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1f1ccfbb4ac7c067dcfa1022e5" ON "comment" ("assignment_session_id") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_42b7fca291344885279b7477bbe" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bcef9e0e5e097218833c21e9790" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_1f1ccfbb4ac7c067dcfa1022e5b" FOREIGN KEY ("assignment_session_id") REFERENCES "assignment_session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_1f1ccfbb4ac7c067dcfa1022e5b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bcef9e0e5e097218833c21e9790"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_42b7fca291344885279b7477bbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1f1ccfbb4ac7c067dcfa1022e5"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
