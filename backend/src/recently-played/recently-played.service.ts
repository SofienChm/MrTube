import { Injectable } from '@nestjs/common';
import { prisma } from '../shared/prisma.js';

@Injectable()
export class RecentlyPlayedService {

  /**
   * Record a played song. Updates the timestamp if the song was already played before.
   */
  async record(userId: string, song: {
    videoId: string; title: string; artist: string; thumbnail: string; duration: number;
  }) {
    const { videoId, title, artist, thumbnail, duration } = song;

    const existing = await prisma.recentlyPlayed.findFirst({
      where: { userId, videoId },
    });

    if (existing) {
      return prisma.recentlyPlayed.update({
        where: { id: existing.id },
        data: { playedAt: new Date() },
      });
    }

    const count = await prisma.recentlyPlayed.count({ where: { userId } });
    if (count >= 50) {
      const oldest = await prisma.recentlyPlayed.findFirst({
        where: { userId },
        orderBy: { playedAt: 'asc' },
      });
      if (oldest) {
        await prisma.recentlyPlayed.update({
          where: { id: oldest.id },
          data: { videoId, title, artist, thumbnail, duration, playedAt: new Date() },
        });
        return;
      }
    }

    return prisma.recentlyPlayed.create({
      data: { userId, videoId, title, artist, thumbnail, duration },
    });
  }

  /**
   * Get recently played songs for a user, ordered by most recent first.
   */
  async findAll(userId: string) {
    return prisma.recentlyPlayed.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
      take: 50,
    });
  }
}
