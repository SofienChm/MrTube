import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../services/music.service';
import { PlayerService } from '../../../services/player.service';
import { Song } from '../../../interfaces/song.interface';

@Component({
  selector: 'app-quick-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="quick-picks-section">
      <div class="header-row">
        <h2>Quick selection</h2>
        <div class="controls">
          <button class="play-all" (click)="playAll()">Tout lire</button>
          <button class="nav-btn" (click)="scrollGrid(-1)">‹</button>
          <button class="nav-btn" (click)="scrollGrid(1)">›</button>
        </div>
      </div>

      <div class="carousel-track" #grid>
        <div class="carousel-item" *ngFor="let song of songs" (click)="onPlay(song)">
          <img [src]="song.thumbnail" alt="Album" class="thumb">
          <div class="info">
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .quick-picks-section { padding: 20px; color: white; }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .carousel-track {
      display: flex;
      gap: 12px;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }
    .carousel-item {
      flex: 0 0 calc(33.333% - 8px);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      transition: background 0.2s;
      cursor: pointer;
      min-width: 0;
    }
    .carousel-item:hover { background-color: #2a2a2a; }
    .thumb { width: 50px; height: 50px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
    .info { min-width: 0; overflow: hidden; }
    .info h3 { margin: 0; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .info p { margin: 4px 0 0; font-size: 12px; color: #aaaaaa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .play-all {
      background: transparent;
      color: white;
      border: 1px solid #444;
      padding: 8px 16px;
      border-radius: 20px;
      margin-right: 10px;
      cursor: pointer;
      font-size: 13px;
      white-space: nowrap;
    }
    .nav-btn {
      background: #2a2a2a;
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-left: 8px;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
    }
    .nav-btn:hover { background: #3f3f3f; }
    @media (max-width: 768px) {
      .quick-picks-section { padding: 12px; }
      .carousel-track {
        gap: 10px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scroll-snap-type: x mandatory;
      }
      .carousel-item {
        flex: 0 0 85%;
        scroll-snap-align: start;
        background: #1a1a1a;
        border-radius: 10px;
        padding: 10px;
      }
      .thumb { width: 44px; height: 44px; }
      .info h3 { font-size: 13px; }
      .info p { font-size: 11px; }
      .nav-btn { display: none; }
      .play-all { display: none; }
    }
  `],
})
export class QuickSelectionComponent implements OnInit {
  songs: Song[] = [];

  constructor(
    private readonly music: MusicService,
    private readonly player: PlayerService,
  ) {}

  ngOnInit(): void {
    this.music.getTrending().subscribe(res => {
      this.songs = res.data.slice(0, 6);
    });
  }

  onPlay(song: Song): void {
    this.player.setQueue(this.songs, this.songs.indexOf(song));
  }

  playAll(): void {
    if (this.songs.length > 0) {
      this.player.setQueue(this.songs, 0);
    }
  }

  scrollGrid(dir: number): void {
    const track = document.querySelector('.quick-picks-section .carousel-track');
    if (track) {
      const itemWidth = (track as HTMLElement).querySelector('.carousel-item')?.clientWidth ?? 300;
      track.scrollBy({ left: dir * (itemWidth + 12), behavior: 'smooth' });
    }
  }
}
