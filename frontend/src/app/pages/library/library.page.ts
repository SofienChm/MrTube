import { Component, OnInit } from '@angular/core';
import { PlaylistService } from '../../services/playlist.service';
import { Playlist } from '../../interfaces/song.interface';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-library',
  templateUrl: './library.page.html',
  styleUrls: ['./library.page.scss'],
  standalone: false,
})
export class LibraryPage implements OnInit {
  playlists: Playlist[] = [];

  constructor(
    private readonly playlist: PlaylistService,
    private readonly alert: AlertController,
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.playlist.getAll().subscribe(res => this.playlists = res.data);
  }

  async showCreatePrompt(): Promise<void> {
    const alert = await this.alert.create({
      header: 'New Playlist',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Playlist name' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Create', handler: (data) => {
          if (data.name?.trim()) {
            this.playlist.create(data.name.trim()).subscribe(() => this.loadPlaylists());
          }
        }},
      ],
    });
    await alert.present();
  }
}
