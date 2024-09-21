import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AudioConvertedListener {
  private readonly logger = new Logger(AudioConvertedListener.name);

  @OnEvent('audio.converted')
  handleAudioConvertedEvent(event) {
    this.logger.debug(event, 'Audio was successfully converted');
  }
}
