import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Song } from '../interfaces/song.interface';
import { RecentlyPlayedService } from './recently-played.service';

declare const YT: any;

export type RepeatMode = 'none' | 'one' | 'all';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentSong$ = new BehaviorSubject<Song | null>(null);
  readonly isPlaying$ = new BehaviorSubject<boolean>(false);
  readonly isLoading$ = new BehaviorSubject<boolean>(false);
  readonly queue$ = new BehaviorSubject<Song[]>([]);
  readonly currentIndex$ = new BehaviorSubject<number>(-1);
  readonly currentTime$ = new BehaviorSubject<number>(0);
  readonly totalTime$ = new BehaviorSubject<number>(0);
  readonly isShuffle$ = new BehaviorSubject<boolean>(false);
  readonly repeatMode$ = new BehaviorSubject<RepeatMode>('none');
  readonly volume$ = new BehaviorSubject<number>(80);

  private ytPlayer: any = null;
  private progressInterval: any = null;
  private apiReady = false;
  private pendingVideoId: string | null = null;

  constructor(
    private readonly zone: NgZone,
    private readonly recentlyPlayed: RecentlyPlayedService,
  ) {}

  /**
   * Initialize the YouTube IFrame API by injecting the script tag.
   */
  initYouTubeAPI(): void {
    if ((window as any).YT?.Player || document.getElementById('yt-api-script')) return;

    const tag = document.createElement('script');
    tag.id = 'yt-api-script';
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    first.parentNode!.insertBefore(tag, first);

    (window as any).onYouTubeIframeAPIReady = () => {
      this.apiReady = true;
      if (this.pendingVideoId) {
        this.createPlayer(this.pendingVideoId);
        this.pendingVideoId = null;
      }
    };
  }

  /**
   * Play a song immediately, updating queue and state.
   */
  play(song: Song): void {
    this.currentSong$.next(song);
    this.isLoading$.next(true);

    const queue = this.queue$.value;
    const idx = queue.findIndex(s => s.videoId === song.videoId);
    if (idx === -1) {
      this.queue$.next([...queue, song]);
      this.currentIndex$.next(queue.length);
    } else {
      this.currentIndex$.next(idx);
    }

    this.recentlyPlayed.record(song).subscribe();

    this.createPlayer(song.videoId);
  }

  /**
   * Create or reload the YouTube player with the given video ID.
   */
  private createPlayer(videoId: string): void {
    if (!this.apiReady) {
      this.pendingVideoId = videoId;
      return;
    }

    if (this.ytPlayer?.loadVideoById) {
      this.ytPlayer.loadVideoById(videoId);
      return;
    }

    const el = document.getElementById('yt-player-hidden');
    if (!el) return;

    this.ytPlayer = new YT.Player('yt-player-hidden', {
      height: 1,
      width: 1,
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        playsinline: 1,
        rel: 0,
      },
      events: {
        onReady: () => this.onPlayerReady(),
        onStateChange: (event: any) => this.onStateChange(event),
        onError: (event: any) => this.onPlayerError(event),
      },
    });
  }

  private onPlayerReady(): void {
    this.zone.run(() => {
      this.isLoading$.next(false);
      this.isPlaying$.next(true);
      this.totalTime$.next(this.ytPlayer.getDuration() || 0);
      this.startProgressTracking();
    });
  }

  private onStateChange(event: any): void {
    this.zone.run(() => {
      switch (event.data) {
        case 0:
          this.next();
          break;
        case 1:
          this.isPlaying$.next(true);
          this.isLoading$.next(false);
          this.totalTime$.next(this.ytPlayer.getDuration() || 0);
          break;
        case 2:
          this.isPlaying$.next(false);
          break;
        case 3:
          this.isLoading$.next(true);
          break;
      }
    });
  }

  private onPlayerError(event: any): void {
    this.zone.run(() => {
      this.isLoading$.next(false);
      this.isPlaying$.next(false);

      const code = event.data;
      if ([100, 101, 150].includes(code) || code === 2) {
        this.next();
      }
    });
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    this.progressInterval = setInterval(() => {
      if (this.ytPlayer?.getCurrentTime) {
        this.zone.run(() => {
          this.currentTime$.next(this.ytPlayer.getCurrentTime());
        });
      }
    }, 1000);
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  /**
   * Pause playback.
   */
  pause(): void {
    this.ytPlayer?.pauseVideo();
    this.isPlaying$.next(false);
  }

  /**
   * Resume playback.
   */
  resume(): void {
    this.ytPlayer?.playVideo();
    this.isPlaying$.next(true);
  }

  /**
   * Toggle between play and pause.
   */
  togglePlay(): void {
    if (this.isPlaying$.value) {
      this.pause();
    } else {
      this.resume();
    }
  }

  /**
   * Play the next track based on repeat/shuffle mode.
   */
  next(): void {
    const mode = this.repeatMode$.value;
    const queue = this.queue$.value;
    const idx = this.currentIndex$.value;

    if (mode === 'one') {
      this.ytPlayer?.seekTo(0, true);
      return;
    }

    if (this.isShuffle$.value) {
      let nextIdx: number;
      do {
        nextIdx = Math.floor(Math.random() * queue.length);
      } while (nextIdx === idx && queue.length > 1);
      this.currentIndex$.next(nextIdx);
      this.play(queue[nextIdx]);
      return;
    }

    if (idx < queue.length - 1) {
      this.currentIndex$.next(idx + 1);
      this.play(queue[idx + 1]);
    } else if (mode === 'all') {
      this.currentIndex$.next(0);
      this.play(queue[0]);
    } else {
      this.stop();
    }
  }

  /**
   * Play the previous track. If more than 3s in, restart current.
   */
  previous(): void {
    if (this.currentTime$.value > 3) {
      this.ytPlayer?.seekTo(0, true);
      this.currentTime$.next(0);
      return;
    }

    const idx = this.currentIndex$.value;
    if (idx > 0) {
      this.currentIndex$.next(idx - 1);
      this.play(this.queue$.value[idx - 1]);
    } else {
      this.ytPlayer?.seekTo(0, true);
      this.currentTime$.next(0);
    }
  }

  /**
   * Seek to a specific time in seconds.
   */
  seekTo(seconds: number): void {
    this.ytPlayer?.seekTo(seconds, true);
    this.currentTime$.next(seconds);
  }

  /**
   * Set volume (0–100).
   */
  setVolume(volume: number): void {
    this.ytPlayer?.setVolume(volume);
    this.volume$.next(volume);
  }

  /**
   * Set the entire queue and start playing at the given index.
   */
  setQueue(songs: Song[], startIndex: number): void {
    this.queue$.next(songs);
    this.currentIndex$.next(startIndex);
    this.play(songs[startIndex]);
  }

  /**
   * Add a single song to the end of the queue.
   */
  addToQueue(song: Song): void {
    this.queue$.next([...this.queue$.value, song]);
  }

  /**
   * Remove a song from the queue by index.
   */
  removeFromQueue(index: number): void {
    const queue = this.queue$.value;
    const idx = this.currentIndex$.value;
    queue.splice(index, 1);
    this.queue$.next([...queue]);
    if (index < idx) {
      this.currentIndex$.next(idx - 1);
    }
  }

  /**
   * Toggle shuffle mode.
   */
  toggleShuffle(): void {
    this.isShuffle$.next(!this.isShuffle$.value);
  }

  /**
   * Cycle repeat mode: none → one → all → none.
   */
  cycleRepeatMode(): void {
    const modes: RepeatMode[] = ['none', 'one', 'all'];
    const current = this.repeatMode$.value;
    const next = modes[(modes.indexOf(current) + 1) % modes.length];
    this.repeatMode$.next(next);
  }

  /**
   * Stop playback and reset state.
   */
  stop(): void {
    this.ytPlayer?.stopVideo();
    this.stopProgressTracking();
    this.isPlaying$.next(false);
    this.isLoading$.next(false);
    this.currentTime$.next(0);
  }

  /**
   * Destroy the YouTube player (on app destroy).
   */
  destroy(): void {
    this.stop();
    this.ytPlayer?.destroy();
    this.ytPlayer = null;
    this.currentSong$.next(null);
    this.queue$.next([]);
    this.currentIndex$.next(-1);
  }

  /**
   * Format seconds into a human-readable time string.
   * 0 → "0:00", 65 → "1:05", 3723 → "1:02:03"
   */
  formatTime(seconds: number): string {
    if (!seconds || seconds < 0) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
    return `${m}:${pad(s)}`;
  }
}
