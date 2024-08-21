import { Inject, Injectable } from '@nestjs/common';
import { Connection } from './common/constants/connection';

@Injectable()
export class AppService {
  constructor(@Inject('connection') private readonly connection: Connection) {
    console.log('CONNECTION :', connection);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
