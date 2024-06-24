import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableClassStudentManyToMany1711517058754 implements MigrationInterface {
    name = 'CreateTableClassStudentManyToMany1711517058754'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "class_student" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "classId" integer, "studentId" integer, CONSTRAINT "UQ_abd78b2233fdcfc9180bd077319" UNIQUE ("classId", "studentId"), CONSTRAINT "PK_8d3c340b466d4fd988673b28a62" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cb51ecfbd132b9e67e8a228b22" ON "class_student" ("classId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2f2ae1a74eb75947f56e3804da" ON "class_student" ("studentId") `);
        await queryRunner.query(`ALTER TABLE "class_student" ADD CONSTRAINT "FK_cb51ecfbd132b9e67e8a228b22b" FOREIGN KEY ("classId") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_student" ADD CONSTRAINT "FK_2f2ae1a74eb75947f56e3804dae" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class_student" DROP CONSTRAINT "FK_2f2ae1a74eb75947f56e3804dae"`);
        await queryRunner.query(`ALTER TABLE "class_student" DROP CONSTRAINT "FK_cb51ecfbd132b9e67e8a228b22b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2f2ae1a74eb75947f56e3804da"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cb51ecfbd132b9e67e8a228b22"`);
        await queryRunner.query(`DROP TABLE "class_student"`);
    }

}
