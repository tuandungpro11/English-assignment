import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTableAssignmentSession1712120537241 implements MigrationInterface {
    name = 'AddColumnTableAssignmentSession1712120537241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment_session" ADD "answer_count" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment_session" DROP COLUMN "answer_count"`);
    }

}
