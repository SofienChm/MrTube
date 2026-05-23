import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { CacheService } from '../shared/cache/cache.service';

@Module({
  controllers: [MusicController],
  providers: [MusicService, CacheService],
  exports: [MusicService],
})
export class MusicModule {}
