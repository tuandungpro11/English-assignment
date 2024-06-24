import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableConversation1711187857425 implements MigrationInterface {
    name = 'CreateTableConversation1711187857425'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversation" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "teacher_id" integer, "student_id" integer, CONSTRAINT "PK_864528ec4274360a40f66c29845" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_3bf9f744e55b3f60a14e8d6f7b6" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation" ADD CONSTRAINT "FK_0c1cdc5bddf0193c179a385dd3f" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_0c1cdc5bddf0193c179a385dd3f"`);
        await queryRunner.query(`ALTER TABLE "conversation" DROP CONSTRAINT "FK_3bf9f744e55b3f60a14e8d6f7b6"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
    }

}
