import { Module } from '@nestjs/common';
import { RecentlyPlayedController } from './recently-played.controller.js';
import { RecentlyPlayedService } from './recently-played.service.js';

@Module({
  controllers: [RecentlyPlayedController],
  providers: [RecentlyPlayedService],
})
export class RecentlyPlayedModule {}
