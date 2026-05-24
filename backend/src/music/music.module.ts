import { Module } from '@nestjs/common';
import { MusicController } from './music.controller.js';
import { MusicService } from './music.service.js';
import { CacheService } from '../shared/cache/cache.service.js';

@Module({
  controllers: [MusicController],
  providers: [MusicService, CacheService],
  exports: [MusicService],
})
export class MusicModule {}
