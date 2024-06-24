import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AssignmentService } from '../student/assignment/assignment.service';

@Injectable()
export class DefaultCronService {
  constructor(
    private readonly assignmentService: AssignmentService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleFinishSession() {
    try {
      await this.assignmentService.finishSession();
      console.info('handle finish session success')
    } catch (error) {
      console.info('handle finish session failed');
    }
  }
}