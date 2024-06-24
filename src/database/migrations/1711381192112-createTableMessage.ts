import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableMessage1711381192112 implements MigrationInterface {
    name = 'CreateTableMessage1711381192112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("body" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "conversation_id" integer, "student_id" integer, "teacher_id" integer, CONSTRAINT "PK_1cda48d81e05c56e715fe6dc780" PRIMARY KEY ("id", "created_at")) PARTITION BY RANGE (created_at)`);
        await queryRunner.query(`CREATE INDEX "IDX_4689a6dbbf685fd2198bc6221e" ON "message" ("is_read") `);
        await queryRunner.query(`CREATE INDEX "IDX_7fe3e887d78498d9c9813375ce" ON "message" ("conversation_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_de6395a8a015e5a5070a9c0183" ON "message" ("student_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_9f6774ed486264684a23d276fc" ON "message" ("teacher_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bf9f744e55b3f60a14e8d6f7b" ON "conversation" ("teacher_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_0c1cdc5bddf0193c179a385dd3" ON "conversation" ("student_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_de6395a8a015e5a5070a9c0183e" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_9f6774ed486264684a23d276fce" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_9f6774ed486264684a23d276fce"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_de6395a8a015e5a5070a9c0183e"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c1cdc5bddf0193c179a385dd3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bf9f744e55b3f60a14e8d6f7b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9f6774ed486264684a23d276fc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de6395a8a015e5a5070a9c0183"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7fe3e887d78498d9c9813375ce"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4689a6dbbf685fd2198bc6221e"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
