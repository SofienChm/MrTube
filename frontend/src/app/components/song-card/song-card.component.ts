import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Song } from '../../interfaces/song.interface';

@Component({
  selector: 'app-song-card',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-item button (click)="onPlay()">
      <ion-thumbnail slot="start">
        <img [src]="song.thumbnail" [alt]="song.title" />
      </ion-thumbnail>
      <ion-label>
        <h3>{{ song.title }}</h3>
        <p>{{ song.artist }}</p>
      </ion-label>
      <ion-note slot="end">{{ song.durationFormatted }}</ion-note>
    </ion-item>
  `,
  styles: [`
    ion-thumbnail { --size: 48px; border-radius: 4px; overflow: hidden; }
    h3 { margin: 0; font-size: 0.95rem; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    p { margin: 2px 0 0; font-size: 0.8rem; color: var(--ion-color-medium); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  `],
})
export class SongCardComponent {
  @Input({ required: true }) song!: Song;
  @Output() play = new EventEmitter<Song>();

  onPlay(): void {
    this.play.emit(this.song);
  }
}
