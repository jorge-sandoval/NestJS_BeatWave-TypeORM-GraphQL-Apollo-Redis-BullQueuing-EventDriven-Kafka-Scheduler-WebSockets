import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio-queue')
export class AudioProcessor {
  @Process('convert')
  async handleConvert(job: Job) {
    console.log(`Processing job ${job.id}...`);
    return Promise.resolve();
  }
}
