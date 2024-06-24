import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnTypeAssignment1713106232827 implements MigrationInterface {
    name = 'AddColumnTypeAssignment1713106232827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."assignment_type_enum" AS ENUM('100', '1', '2', '3', '4', '5', '6')`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "type" "public"."assignment_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."assignment_type_enum"`);
    }

}
