import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { MusicModule } from './music/music.module';
import { AuthModule } from './auth/auth.module';
import { PlaylistModule } from './playlist/playlist.module';
import { RecentlyPlayedModule } from './recently-played/recently-played.module';

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
