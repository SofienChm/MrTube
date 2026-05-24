import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentlyPlayedService } from '../../../services/recently-played.service';
import { PlayerService } from '../../../services/player.service';
import { Song } from '../../../interfaces/song.interface';

@Component({
  selector: 'app-listen-again',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="history-section">
      <div class="header-row">
        <h3>Listen again</h3>
      </div>
      <div class="carousel-wrapper">
        <div class="carousel" #carousel>
          <div class="carousel-card" *ngFor="let song of songs" (click)="onPlay(song)">
            <div class="thumb-wrapper">
              <img [src]="song.thumbnail" [alt]="song.title">
              <div class="play-overlay">▶</div>
            </div>
            <h4>{{ song.title }}</h4>
            <p>{{ song.artist }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .history-section { padding: 20px; color: white; margin-bottom: 40px; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .carousel-wrapper {
      overflow: hidden;
      margin: 0 -20px;
      padding: 0 20px;
    }
    .carousel {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 8px;
    }
    .carousel::-webkit-scrollbar { height: 4px; }
    .carousel::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
    .carousel-card {
      flex: 0 0 180px;
      scroll-snap-align: start;
      cursor: pointer;
    }
    .thumb-wrapper { position: relative; border-radius: 8px; overflow: hidden; }
    .thumb-wrapper img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
    .play-overlay {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-size: 30px;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .carousel-card:hover .play-overlay { opacity: 1; }
    .carousel-card h4 { margin: 10px 0 5px; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .carousel-card p { color: #aaa; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    @media (max-width: 768px) {
      .history-section { padding: 12px; margin-bottom: 20px; }
      .carousel-card { flex: 0 0 150px; }
      .carousel-wrapper { margin: 0 -12px; padding: 0 12px; }
    }
  `],
})
export class ListenAgainComponent implements OnInit {
  songs: Song[] = [];

  constructor(
    private readonly recentlyPlayed: RecentlyPlayedService,
    private readonly player: PlayerService,
  ) {}

  ngOnInit(): void {
    this.recentlyPlayed.getAll().subscribe(songs => {
      this.songs = songs.slice(0, 10);
    });
  }

  onPlay(song: Song): void {
    this.player.setQueue(this.songs, this.songs.indexOf(song));
  }
}
