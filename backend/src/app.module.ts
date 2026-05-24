import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MusicModule } from './music/music.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PlaylistModule } from './playlist/playlist.module.js';
import { RecentlyPlayedModule } from './recently-played/recently-played.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    MusicModule,
    AuthModule,
    PlaylistModule,
    RecentlyPlayedModule,
  ],
})
export class AppModule {}
