import { Injectable, HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import { CacheService } from '../shared/cache/cache.service';
import { withTimeout } from '../shared/utils';
import { Song, SearchResult } from '../shared/interfaces/song.interface';
import { Readable } from 'stream';

const ytSearch = require('yt-search');
const ytdl = require('@distube/ytdl-core');
const YT_TIMEOUT = 8000;

@Injectable()
export class MusicService {
  constructor(private readonly cache: CacheService) {}

  formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) return `${hrs}:${pad(mins)}:${pad(secs)}`;
    return `${mins}:${pad(secs)}`;
  }

  private mapVideo(v: any): Song {
    return {
      videoId: v.videoId,
      title: v.title,
      artist: v.author?.name ?? 'Unknown',
      thumbnail: v.thumbnail ?? v.image ?? '',
      duration: v.seconds ?? parseInt(v.timestamp?.split(':').reduce((a: number, t: string) => a * 60 + parseInt(t), 0) ?? '0'),
      durationFormatted: v.timestamp ?? this.formatDuration(v.seconds ?? 0),
      views: v.views,
    };
  }

  async searchMusic(query: string, _filter: string = 'music_songs'): Promise<SearchResult> {
    const cacheKey = this.cache.buildKey('search', query);
    const cached = this.cache.get<SearchResult>(cacheKey);
    if (cached) return cached;

    try {
      const result: any = await withTimeout(ytSearch({ query, category: 'music' }), YT_TIMEOUT);
      const songs: Song[] = (result.videos ?? []).map(this.mapVideo);
      const res: SearchResult = { songs };
      this.cache.set(cacheKey, res, 300);
      return res;
    } catch {
      return { songs: [] };
    }
  }

  async getSongDetails(videoId: string): Promise<Song> {
    const cacheKey = this.cache.buildKey('details', videoId);
    const cached = this.cache.get<Song>(cacheKey);
    if (cached) return cached;

    try {
      const result: any = await withTimeout(ytSearch({ videoId }), YT_TIMEOUT);
      const song: Song = {
        videoId,
        title: result.title ?? '',
        artist: result.author?.name ?? 'Unknown',
        thumbnail: result.thumbnail ?? result.image ?? '',
        duration: result.seconds ?? 0,
        durationFormatted: this.formatDuration(result.seconds ?? 0),
        views: result.views,
      };
      this.cache.set(cacheKey, song, 600);
      return song;
    } catch {
      return { videoId, title: '', artist: 'Unknown', thumbnail: '', duration: 0, durationFormatted: '0:00' };
    }
  }

  async getRelatedSongs(videoId: string): Promise<Song[]> {
    try {
      const result: any = await withTimeout(ytSearch({ videoId }), YT_TIMEOUT);
      return (result.related ?? []).slice(0, 10).map(this.mapVideo);
    } catch {
      return [];
    }
  }

  async getTrending(): Promise<Song[]> {
    const cacheKey = this.cache.buildKey('trending');
    const cached = this.cache.get<Song[]>(cacheKey);
    if (cached) return cached;

    try {
      const result: any = await withTimeout(ytSearch('trending music'), YT_TIMEOUT);
      const songs: Song[] = (result.videos ?? result.all ?? []).slice(0, 20).map(this.mapVideo);
      this.cache.set(cacheKey, songs, 1800);
      return songs;
    } catch {
      return [];
    }
  }

  async getDownloadStream(videoId: string): Promise<{ stream: Readable; title: string; artist: string }> {
    const info = await ytdl.getInfo(videoId);
    const title = info.videoDetails.title.replace(/[^\w\s()-]/g, '');
    const artist = info.videoDetails.author?.name ?? 'Unknown';
    const stream = ytdl(videoId, { quality: 'lowestaudio', filter: 'audioonly' });
    return { stream, title, artist };
  }
}
