import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTableNotification1712310666733 implements MigrationInterface {
    name = 'AddColumnTableNotification1712310666733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "student_id" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_f7c4568599f41af9d555cabbf27" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_f7c4568599f41af9d555cabbf27"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "student_id"`);
    }

}
