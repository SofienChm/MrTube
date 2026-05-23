import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { PlayerService } from '../../services/player.service';
import { MusicService } from '../../services/music.service';
import { ShareService } from '../../core/services/share.service';
import { Song } from '../../interfaces/song.interface';
import { QueueModalComponent } from '../../shared/components/queue-modal/queue-modal.component';
import { AddToPlaylistModalComponent } from '../../shared/components/add-to-playlist-modal/add-to-playlist-modal.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.page.html',
  styleUrls: ['./player.page.scss'],
  standalone: false,
})
export class PlayerPage implements OnInit, OnDestroy {
  related: Song[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly player: PlayerService,
    private readonly music: MusicService,
    private readonly share: ShareService,
    private readonly modal: ModalController,
  ) {}

  ngOnInit(): void {
    this.player.currentSong$.pipe(
      takeUntil(this.destroy$),
      switchMap(song => {
        if (!song) return [];
        return this.music.getRelated(song.videoId);
      }),
    ).subscribe(res => {
      this.related = res.data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTogglePlay(): void {
    this.player.togglePlay();
  }

  onNext(): void {
    this.player.next();
  }

  onPrev(): void {
    this.player.previous();
  }

  onSeek(event: any): void {
    this.player.seekTo(event.detail.value);
  }

  onVolumeChange(event: any): void {
    this.player.setVolume(event.detail.value);
  }

  onDismiss(): void {
    window.history.back();
  }

  onActionSheet(event: any): void {
    const action = event.detail.data?.action;
    if (action === 'addtoplaylist') this.onAddToPlaylist();
    else if (action === 'queue') this.onOpenQueue();
    else if (action === 'download') this.onDownload();
    else if (action === 'share') this.onShare();
  }

  async onAddToPlaylist(): Promise<void> {
    const song = this.player.currentSong$.value;
    if (!song) return;
    const modal = await this.modal.create({
      component: AddToPlaylistModalComponent,
      componentProps: { song },
    });
    await modal.present();
  }

  async onOpenQueue(): Promise<void> {
    const modal = await this.modal.create({
      component: QueueModalComponent,
    });
    await modal.present();
  }

  onShare(): void {
    const song = this.player.currentSong$.value;
    if (song) this.share.shareSong(song);
  }

  onDownload(): void {
    const song = this.player.currentSong$.value;
    if (song) this.music.downloadSong(song.videoId);
  }
}
