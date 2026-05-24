import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller.js';
import { PlaylistService } from './playlist.service.js';

@Module({
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
