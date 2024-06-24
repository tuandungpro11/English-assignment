import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnQuestionBankIdTableQuestion1716016249430 implements MigrationInterface {
    name = 'AddColumnQuestionBankIdTableQuestion1716016249430'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ADD "question_bank_id" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "question_bank_id"`);
    }

}
