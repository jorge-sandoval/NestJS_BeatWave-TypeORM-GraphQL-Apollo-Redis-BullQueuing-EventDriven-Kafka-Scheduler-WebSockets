import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';

@Processor('audio-queue')
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  constructor(private eventEmitter: EventEmitter2) {}

  @Process('convert')
  async handleConvert(job: Job) {
    this.logger.debug(`Processing job ${job.id}...`);

    //Emit event
    this.eventEmitter.emit('audio.converted', job.data);
    return Promise.resolve();
  }
}
