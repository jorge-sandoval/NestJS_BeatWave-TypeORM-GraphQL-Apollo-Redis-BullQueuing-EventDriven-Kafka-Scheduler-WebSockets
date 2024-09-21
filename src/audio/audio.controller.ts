import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';

@Controller('audio')
@ApiTags('Queues with Redis')
export class AudioController {
  constructor(
    @InjectQueue('audio-queue')
    private readonly audioQueue: Queue,
  ) {}

  /**
   * Let's imagine we would like to convert .wav file into .mp3
   * And I will take long
   */
  @Post('convert')
  async convert() {
    await this.audioQueue.add('convert', {
      file: 'sample.wav',
      id: 1,
    });
  }

  @Get('jobs')
  async getJobs() {
    const jobs = await this.audioQueue.getJobs([
      'waiting',
      'completed',
      'failed',
    ]);
    return jobs.map(this.mapJob);
  }

  @Get('jobs/:id')
  async getJob(@Param('id') id: string) {
    const job = await this.audioQueue.getJob(id);

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return this.mapJob(job);
  }

  @Delete('jobs/:id')
  async removeJob(@Param('id') id: string) {
    const job = await this.audioQueue.getJob(id);

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    await job.remove();
    return { message: `Job ${id} removed` };
  }

  private mapJob(job) {
    return {
      id: job.id,
      name: job.name,
      data: job.data,
      status: job.finishedOn
        ? 'completed'
        : job.failedReason
          ? 'failed'
          : 'waiting',
      createdAt: job.timestamp,
      updatedAt: job.finishedOn || job.failedReason ? job.finishedOn : null,
    };
  }
}
