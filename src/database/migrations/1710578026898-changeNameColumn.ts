import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeNameColumn1710578026898 implements MigrationInterface {
    name = 'ChangeNameColumn1710578026898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "student" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "role" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "class" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "class" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "class" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "question" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "question" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "question" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "assignment" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "class" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "teacher" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "student" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "assignment" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "question" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "question" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "class" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "class" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "class" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "teacher" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "role" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "role" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "student" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "student" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
