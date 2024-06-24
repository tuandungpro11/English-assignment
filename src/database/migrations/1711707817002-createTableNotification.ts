import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableNotification1711707817002 implements MigrationInterface {
    name = 'CreateTableNotification1711707817002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "body" text NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "class_id" integer, "teacher_id" integer, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_aedc307c7e60ecb138e3f90ff8" ON "notification" ("is_read") `);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_67c4732ed5bc4347d01251416a4" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_2332563e5246c74e6b7ce30e6c8" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_2332563e5246c74e6b7ce30e6c8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_67c4732ed5bc4347d01251416a4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aedc307c7e60ecb138e3f90ff8"`);
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
