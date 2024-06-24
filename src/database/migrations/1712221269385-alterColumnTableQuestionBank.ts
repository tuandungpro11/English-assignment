import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnTableQuestionBank1712221269385 implements MigrationInterface {
    name = 'AlterColumnTableQuestionBank1712221269385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "body" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "choices" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "instruction" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "instruction" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "choices" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "body" SET NOT NULL`);
    }

}
