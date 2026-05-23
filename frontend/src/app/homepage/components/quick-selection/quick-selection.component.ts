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

      <div class="grid-container" #grid>
        <div class="item-card" *ngFor="let song of songs" (click)="onPlay(song)">
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
    .grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
    .item-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      border-radius: 8px;
      transition: background 0.2s;
      cursor: pointer;
    }
    .item-card:hover { background-color: #2a2a2a; }
    .thumb { width: 50px; height: 50px; border-radius: 4px; object-fit: cover; }
    .info h3 { margin: 0; font-size: 14px; }
    .info p { margin: 4px 0 0; font-size: 12px; color: #aaaaaa; }
    .play-all {
      background: transparent;
      color: white;
      border: 1px solid #444;
      padding: 8px 16px;
      border-radius: 20px;
      margin-right: 10px;
      cursor: pointer;
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
    const grid = document.querySelector('.quick-picks-section .grid-container');
    if (grid) {
      grid.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  }
}
