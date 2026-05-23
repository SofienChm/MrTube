import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { AddToPlaylistModalComponent } from '../../shared/components/add-to-playlist-modal/add-to-playlist-modal.component';

@Component({
  selector: 'app-mini-player',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <div class="mini-player" *ngIf="player.currentSong$ | async as song" [routerLink]="['/player']">
      <div class="progress-bar">
        <div class="progress-fill" [style.width.%]="progressPct"></div>
      </div>
      <img [src]="song.thumbnail" [alt]="song.title" />
      <div class="info">
        <span class="title">{{ song.title }}</span>
        <span class="artist">{{ song.artist }}</span>
      </div>
      <ion-button fill="clear" size="small" (click)="onAddToPlaylist(); $event.stopPropagation()">
        <ion-icon slot="icon-only" name="add-circle-outline"></ion-icon>
      </ion-button>
      <ion-button fill="clear" size="small" (click)="onTogglePlay(); $event.stopPropagation()">
        <ion-spinner *ngIf="player.isLoading$ | async" name="crescent" color="primary"></ion-spinner>
        <ion-icon *ngIf="!(player.isLoading$ | async)" slot="icon-only" [name]="(player.isPlaying$ | async) ? 'pause' : 'play'"></ion-icon>
      </ion-button>
      <ion-button fill="clear" size="small" (click)="player.next(); $event.stopPropagation()">
        <ion-icon slot="icon-only" name="play-skip-forward"></ion-icon>
      </ion-button>
    </div>
  `,
  styles: [`
    .mini-player {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: rgba(26,26,26,0.97);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255,255,255,0.08);
      cursor: pointer;
      overflow: hidden;
    }
    .progress-bar {
      position: absolute;
      top: 0; left: 0; right: 0; height: 2px;
      background: transparent;
    }
    .progress-fill {
      height: 100%;
      background: #f05d23;
      transition: width 1s linear;
    }
    img { width: 44px; height: 44px; border-radius: 6px; object-fit: cover; flex-shrink: 0; }
    .info { flex: 1; min-width: 0; }
    .title { display: block; font-size: 0.85rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #fff; }
    .artist { display: block; font-size: 0.75rem; color: #888; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `],
})
export class MiniPlayerComponent {
  progressPct = 0;

  constructor(
    readonly player: PlayerService,
    private readonly modal: ModalController,
  ) {
    player.currentTime$.subscribe(t => {
      const total = player.totalTime$.value;
      this.progressPct = total > 0 ? (t / total) * 100 : 0;
    });
  }

  onTogglePlay(): void {
    this.player.togglePlay();
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
}
