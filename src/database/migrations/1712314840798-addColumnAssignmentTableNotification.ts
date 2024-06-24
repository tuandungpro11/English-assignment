import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnAssignmentTableNotification1712314840798 implements MigrationInterface {
    name = 'AddColumnAssignmentTableNotification1712314840798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "assignment_id" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_5fbaf2eb9126c054fbe9cb99924" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_5fbaf2eb9126c054fbe9cb99924"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "assignment_id"`);
    }

}
