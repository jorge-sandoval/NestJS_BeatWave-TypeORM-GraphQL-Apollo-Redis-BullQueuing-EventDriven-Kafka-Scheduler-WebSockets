import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [SeedsService],
})
export class SeedsModule {}
