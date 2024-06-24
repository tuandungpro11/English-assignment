import { MigrationInterface, QueryRunner } from "typeorm"

export class CreatePartitionTableMessage1711389897912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE "message_202403" PARTITION OF "message" FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202404" PARTITION OF "message" FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202405" PARTITION OF "message" FOR VALUES FROM ('2024-05-01') TO ('2024-06-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202406" PARTITION OF "message" FOR VALUES FROM ('2024-06-01') TO ('2024-07-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202407" PARTITION OF "message" FOR VALUES FROM ('2024-07-01') TO ('2024-08-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202408" PARTITION OF "message" FOR VALUES FROM ('2024-08-01') TO ('2024-09-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202409" PARTITION OF "message" FOR VALUES FROM ('2024-09-01') TO ('2024-10-01');
      `);
      await queryRunner.query(`
        CREATE TABLE "message_202410" PARTITION OF "message" FOR VALUES FROM ('2024-10-01') TO ('2024-11-01');
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        DROP TABLE "message_202403";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202404";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202405";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202406";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202407";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202408";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202409";
      `);
      await queryRunner.query(`
        DROP TABLE "message_202410";
      `);
    }

}
