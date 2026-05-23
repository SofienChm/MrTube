import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../../services/playlist.service';
import { PlayerService } from '../../services/player.service';
import { MusicService } from '../../services/music.service';
import { ToastController } from '@ionic/angular';
import { Playlist, PlaylistSong } from '../../interfaces/song.interface';

@Component({
  selector: 'app-playlist-detail',
  templateUrl: './playlist-detail.page.html',
  styleUrls: ['./playlist-detail.page.scss'],
  standalone: false,
})
export class PlaylistDetailPage implements OnInit {
  playlist?: Playlist;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly playlistService: PlaylistService,
    private readonly player: PlayerService,
    private readonly music: MusicService,
    private readonly toast: ToastController,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.playlistService.getOne(id).subscribe(res => this.playlist = res.data);
  }

  onPlaySong(song: PlaylistSong): void {
    this.player.setQueue(this.playlist!.songs, this.playlist!.songs.indexOf(song));
  }

  onRemoveSong(songId: string, event: Event): void {
    event.stopPropagation();
    const id = this.route.snapshot.paramMap.get('id')!;
    this.playlistService.removeSong(id, songId).subscribe(() => {
      this.playlist = {
        ...this.playlist!,
        songs: this.playlist!.songs.filter(s => s.id !== songId),
      };
    });
  }

  onDelete(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.playlistService.remove(id).subscribe(() => this.router.navigate(['/library']));
  }

  onDownloadSong(song: PlaylistSong, event: Event): void {
    event.stopPropagation();
    this.music.downloadSong(song.videoId);
  }

  onDownloadAll(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.playlistService.downloadAll(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${this.playlist?.name || 'playlist'}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}
