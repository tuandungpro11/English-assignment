import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumnTypeQuestion1713103312903 implements MigrationInterface {
    name = 'AlterColumnTypeQuestion1713103312903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_aedc307c7e60ecb138e3f90ff8"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "is_read"`);
        await queryRunner.query(`ALTER TYPE "public"."question_type_enum" RENAME TO "question_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "type" TYPE "public"."question_type_enum" USING "type"::"text"::"public"."question_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."question_bank_type_enum" RENAME TO "question_bank_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."question_bank_type_enum" AS ENUM('1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "type" TYPE "public"."question_bank_type_enum" USING "type"::"text"::"public"."question_bank_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."question_bank_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."question_bank_type_enum_old" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "question_bank" ALTER COLUMN "type" TYPE "public"."question_bank_type_enum_old" USING "type"::"text"::"public"."question_bank_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."question_bank_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."question_bank_type_enum_old" RENAME TO "question_bank_type_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."question_type_enum_old" AS ENUM('1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "question" ALTER COLUMN "type" TYPE "public"."question_type_enum_old" USING "type"::"text"::"public"."question_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."question_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."question_type_enum_old" RENAME TO "question_type_enum"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "is_read" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_aedc307c7e60ecb138e3f90ff8" ON "notification" ("is_read") `);
    }

}
