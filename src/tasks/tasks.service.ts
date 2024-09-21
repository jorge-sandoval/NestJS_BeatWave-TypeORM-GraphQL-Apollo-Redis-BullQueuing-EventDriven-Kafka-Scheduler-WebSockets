import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);

  onModuleInit() {
    this.hourlyTask('on Start Up');
  }

  @Cron('0 * * * *')
  hourlyTask(schedule: string = '') {
    this.logger.debug(`Hourly Cron Task Called ${schedule}`);
  }
}
