import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, AlertController, ToastController } from '@ionic/angular';
import { PlaylistService } from '../../../services/playlist.service';
import { Playlist, Song } from '../../../interfaces/song.interface';

@Component({
  selector: 'app-add-to-playlist-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Add to Playlist</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item button (click)="onCreateNew()">
          <ion-icon slot="start" name="add-circle" color="primary"></ion-icon>
          <ion-label>
            <h3>Create new playlist</h3>
            <p>Name and add this song</p>
          </ion-label>
        </ion-item>

        <ion-item *ngFor="let pl of playlists" button (click)="onAddToPlaylist(pl)">
          <ion-thumbnail slot="start">
            <img [src]="pl.cover || 'assets/default-playlist.svg'" />
          </ion-thumbnail>
          <ion-label>
            <h3>{{ pl.name }}</h3>
            <p>{{ pl.songs.length }} songs</p>
          </ion-label>
          <ion-icon *ngIf="isSongInPlaylist(pl)" slot="end" name="checkmark-circle" color="success"></ion-icon>
        </ion-item>

        <ion-item *ngIf="playlists.length === 0">
          <ion-label class="ion-text-center" color="medium">No playlists yet</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    ion-thumbnail { --size: 44px; border-radius: 4px; overflow: hidden; }
    h3 { margin: 0; font-size: 0.9rem; font-weight: 500; }
    p { margin: 2px 0 0; font-size: 0.75rem; color: var(--ion-color-medium); }
  `],
})
export class AddToPlaylistModalComponent implements OnInit {
  song!: Song;
  playlists: Playlist[] = [];

  constructor(
    private readonly playlistService: PlaylistService,
    private readonly modal: ModalController,
    private readonly alert: AlertController,
    private readonly toast: ToastController,
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  private loadPlaylists(): void {
    this.playlistService.getAll().subscribe(res => this.playlists = res.data);
  }

  isSongInPlaylist(playlist: Playlist): boolean {
    return playlist.songs.some(s => s.videoId === this.song?.videoId);
  }

  async onCreateNew(): Promise<void> {
    const alert = await this.alert.create({
      header: 'New Playlist',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Playlist name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Create & Add',
          handler: (data) => {
            if (data.name?.trim()) {
              this.playlistService.create(data.name.trim()).subscribe(res => {
                this.addSongToPlaylist(res.data.id, res.data.name);
                this.loadPlaylists();
              });
            }
          },
        },
      ],
    });
    await alert.present();
  }

  onAddToPlaylist(playlist: Playlist): void {
    if (this.isSongInPlaylist(playlist)) return;
    this.addSongToPlaylist(playlist.id, playlist.name);
  }

  private addSongToPlaylist(playlistId: string, playlistName: string): void {
    this.playlistService.addSong(playlistId, {
      videoId: this.song.videoId,
      title: this.song.title,
      artist: this.song.artist,
      thumbnail: this.song.thumbnail,
      duration: this.song.duration,
    }).subscribe(() => {
      this.showToast(`Added to ${playlistName}`);
      this.loadPlaylists();
    });
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2000, position: 'bottom' });
    await toast.present();
  }

  dismiss(): void {
    this.modal.dismiss();
  }
}
