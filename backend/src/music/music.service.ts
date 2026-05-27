import { Injectable, HttpException, HttpStatus, StreamableFile } from '@nestjs/common';
import { CacheService } from '../shared/cache/cache.service.js';
import { withTimeout } from '../shared/utils.js';
import { Song, SearchResult } from '../shared/interfaces/song.interface.js';
import { Readable } from 'stream';
import axios from 'axios';
import type { Response } from 'express';
import { execSync } from 'child_process';

import ytSearch from 'yt-search';
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

  async getRecommendations(videoIds: string[]): Promise<Song[]> {
    if (videoIds.length === 0) {
      return this.getQuickPicks();
    }
    try {
      const queries = videoIds.slice(0, 3).map((id) =>
        withTimeout(ytSearch({ videoId: id }), YT_TIMEOUT)
          .then((r: any) => (r.related ?? []).slice(0, 5))
          .catch(() => [] as any[]),
      );
      const results = await Promise.all(queries);
      const seen = new Set<string>();
      const songs: Song[] = [];
      for (const list of results) {
        for (const v of list) {
          if (seen.has(v.videoId)) continue;
          seen.add(v.videoId);
          songs.push(this.mapVideo(v));
          if (songs.length >= 10) break;
        }
        if (songs.length >= 10) break;
      }
      return songs;
    } catch {
      return [];
    }
  }

  async getQuickPicks(): Promise<Song[]> {
    const cacheKey = this.cache.buildKey('quickpicks');
    const cached = this.cache.get<Song[]>(cacheKey);
    if (cached) return cached;

    try {
      const queries = await Promise.all([
        withTimeout(ytSearch({ query: 'chill lofi hip hop', category: 'music' }), YT_TIMEOUT).catch(() => ({ videos: [] })),
        withTimeout(ytSearch({ query: 'rock classics 80s 90s', category: 'music' }), YT_TIMEOUT).catch(() => ({ videos: [] })),
        withTimeout(ytSearch({ query: 'electronic dance mix 2026', category: 'music' }), YT_TIMEOUT).catch(() => ({ videos: [] })),
      ]);

      const trendingCache = this.cache.get<Song[]>('trending');
      const trendingIds = new Set(trendingCache?.map((s) => s.videoId) ?? []);

      const seen = new Set<string>();
      const songs: Song[] = [];
      for (const result of queries) {
        const videos: any[] = (result as any).videos ?? [];
        for (const v of videos) {
          if (seen.has(v.videoId)) continue;
          if (trendingIds.has(v.videoId)) continue;
          seen.add(v.videoId);
          songs.push(this.mapVideo(v));
          if (songs.length >= 12) break;
        }
        if (songs.length >= 12) break;
      }
      this.cache.set(cacheKey, songs, 1200);
      return songs;
    } catch {
      return [];
    }
  }

  private getYtDlpAudioUrl(videoId: string): string | null {
    try {
      const url = execSync(
        `python -m yt_dlp -g -f "249/140/251" --no-warnings "https://www.youtube.com/watch?v=${videoId}"`,
        { timeout: 15000, encoding: 'utf-8' },
      ).trim();
      return url || null;
    } catch {
      return null;
    }
  }

  private getYtDlpBestAudioUrl(videoId: string): { url: string; mimeType: string } | null {
    try {
      const output = execSync(
        `python -m yt_dlp -g -f "140/251/249" --no-warnings --print "%(url)s|%(ext)s" "https://www.youtube.com/watch?v=${videoId}"`,
        { timeout: 15000, encoding: 'utf-8' },
      ).trim();
      const parts = output.split('|');
      if (parts.length >= 2 && parts[0]) {
        const ext = parts[1];
        const mimeType = ext === 'm4a' ? 'audio/mp4' : ext === 'webm' ? 'audio/webm' : 'audio/webm';
        return { url: parts[0], mimeType };
      }
      if (parts[0]) return { url: parts[0], mimeType: 'audio/webm' };
      return null;
    } catch {
      return null;
    }
  }

  async getStreamUrl(videoId: string): Promise<string | null> {
    const result = this.getYtDlpBestAudioUrl(videoId);
    return result?.url ?? null;
  }

  async streamAudio(videoId: string, res: Response, range?: string): Promise<void> {
    const result = this.getYtDlpBestAudioUrl(videoId);
    if (!result?.url) throw new Error('No audio URL found');

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.youtube.com/',
    };
    if (range) {
      headers['Range'] = range;
    }

    const response = await axios.get(result.url, {
      responseType: 'stream',
      timeout: 30000,
      headers,
      validateStatus: (status) => (range ? status === 206 : status === 200),
    });

    res.setHeader('Content-Type', result.mimeType);
    res.setHeader('Accept-Ranges', 'bytes');

    if (range) {
      const contentRange = response.headers['content-range'] as string | undefined;
      const contentLength = response.headers['content-length'] as string | undefined;
      if (contentRange) res.setHeader('Content-Range', contentRange);
      if (contentLength) res.setHeader('Content-Length', contentLength);
      res.status(206);
    }

    response.data.pipe(res);
  }

  async getDownloadStream(videoId: string): Promise<{ stream: Readable; title: string; artist: string }> {
    const result = this.getYtDlpBestAudioUrl(videoId);
    if (!result?.url) throw new Error('No audio URL found');
    const response = await axios.get(result.url, {
      responseType: 'stream',
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.youtube.com/',
      },
    });
    const stream = response.data as Readable;
    const title = videoId;
    const artist = 'Unknown';
    return { stream, title, artist };
  }
}
