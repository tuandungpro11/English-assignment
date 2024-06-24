import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HealthCheckController } from './modules/health-check/health-check.controller';
import { CronModule } from './modules/cron/cron.module';
import { DefaultCronService } from './modules/cron/default.cron.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppModule, CronModule],
})
export class MainModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(MainModule);
  } catch (error) {
    console.log('Error-StandAlone: ', error);
  }
}

bootstrap();