import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnTableQuestion1712219012819 implements MigrationInterface {
    name = 'AlterColumnTableQuestion1712219012819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "body" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "choices" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "instruction" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "instruction" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "choices" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "body" SET NOT NULL`);
    }

}
