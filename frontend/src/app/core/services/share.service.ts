import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Song } from '../../interfaces/song.interface';

@Injectable({ providedIn: 'root' })
export class ShareService {
  constructor(private readonly toast: ToastController) {}

  /**
   * Share a song using the Web Share API or fallback to clipboard.
   */
  async shareSong(song: Song): Promise<void> {
    const url = `https://youtube.com/watch?v=${song.videoId}`;
    const text = `Listen to ${song.title} by ${song.artist} on StreamFlow`;

    if (navigator.share) {
      try {
        await navigator.share({ title: song.title, text, url });
        return;
      } catch {
        // user cancelled or error
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    const toast = await this.toast.create({
      message: 'Link copied to clipboard',
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
