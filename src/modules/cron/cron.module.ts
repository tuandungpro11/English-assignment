import { Module } from '@nestjs/common';
import { AssignmentModule } from '../student';

import { DefaultCronService } from './default.cron.service';

@Module({
  imports: [AssignmentModule],
  providers: [DefaultCronService],
})
export class CronModule {}
