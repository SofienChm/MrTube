import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { PlaylistService } from '../../../services/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  template: `
    <aside class="sidebar">
      <div class="logo">
        <img src="assets/icon/mrtube1.png" class="logo-img" alt="YouTube Music"> <span>MrTube</span>
      </div>

      <nav>
        <ul class="nav-links">
          <li routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
            <span class="icon-sidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M341.8 72.6C329.5 61.2 310.5 61.2 298.3 72.6L74.3 280.6C64.7 289.6 61.5 303.5 66.3 315.7C71.1 327.9 82.8 336 96 336L112 336L112 512C112 547.3 140.7 576 176 576L464 576C499.3 576 528 547.3 528 512L528 336L544 336C557.2 336 569 327.9 573.8 315.7C578.6 303.5 575.4 289.5 565.8 280.6L341.8 72.6zM304 384L336 384C362.5 384 384 405.5 384 432L384 528L256 528L256 432C256 405.5 277.5 384 304 384z"/></svg></span>
            <span>Accueil</span>
          </li>
          <li>
            <span class="icon-sidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M371.8 82.4C359.8 87.4 352 99 352 112L352 192L240 192C142.8 192 64 270.8 64 368C64 481.3 145.5 531.9 164.2 542.1C166.7 543.5 169.5 544 172.3 544C183.2 544 192 535.1 192 524.3C192 516.8 187.7 509.9 182.2 504.8C172.8 496 160 478.4 160 448.1C160 395.1 203 352.1 256 352.1L352 352.1L352 432.1C352 445 359.8 456.7 371.8 461.7C383.8 466.7 397.5 463.9 406.7 454.8L566.7 294.8C579.2 282.3 579.2 262 566.7 249.5L406.7 89.5C397.5 80.3 383.8 77.6 371.8 82.6z"/></svg></span>
            <span>Explorer</span>
          </li>
          <li routerLink="/library" routerLinkActive="active">
            <span class="icon-sidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="rgb(255, 255, 255)" d="M192 64C156.7 64 128 92.7 128 128L128 544C128 555.5 134.2 566.2 144.2 571.8C154.2 577.4 166.5 577.3 176.4 571.4L320 485.3L463.5 571.4C473.4 577.3 485.7 577.5 495.7 571.8C505.7 566.1 512 555.5 512 544L512 128C512 92.7 483.3 64 448 64L192 64z"/></svg></span> <span>Bibliothèque</span>
          </li>
        </ul>
      </nav>

      <hr class="divider">

      <button class="new-playlist-btn" (click)="onNewPlaylist()">
        <span class="icon-sidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M352 128C352 110.3 337.7 96 320 96C302.3 96 288 110.3 288 128L288 288L128 288C110.3 288 96 302.3 96 320C96 337.7 110.3 352 128 352L288 352L288 512C288 529.7 302.3 544 320 544C337.7 544 352 529.7 352 512L352 352L512 352C529.7 352 544 337.7 544 320C544 302.3 529.7 288 512 288L352 288L352 128z"/></svg></span>
        <span>Nouvelle playlist</span>
      </button>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      background-color: #0f0f0f;
      padding: 20px;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
      .logo-img { width: 24px; height: 24px; }
      .logo {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 20px;
        font-weight: bold;
        color: white;
        margin-bottom: 30px;
      }
    .sidebar ul { list-style: none; padding: 0; }
    .sidebar li { margin-bottom: 15px; cursor: pointer; }
    .nav-links {
      list-style: none;
      padding: 0;
      margin-top: 20px;
    }
    .nav-links li {
      padding: 12px 16px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 20px;
      cursor: pointer;
      border-radius: 8px;
      color: white;
      font-weight: 500;
    }
    .nav-links li.active {
      background-color: #2a2a2a;
    }
    .nav-links li:hover:not(.active) {
      background-color: #1f1f1f;
    }
    .divider {
      border: 0;
      border-top: 1px solid #333;
      margin: 16px 0;
    }
    .new-playlist-btn {
      background-color: transparent;
      color: white;
      border: 1px solid #444;
      padding: 10px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.3s;
    }
    .new-playlist-btn:hover { background-color: #2a2a2a; }
    .icon-sidebar { width: 20px; height: 20px; }
  `],
})
export class SidebarComponent {
  constructor(
    private readonly playlistService: PlaylistService,
    private readonly alert: AlertController,
    private readonly router: Router,
  ) {}

  async onNewPlaylist(): Promise<void> {
    const alert = await this.alert.create({
      header: 'Nouvelle playlist',
      inputs: [{ name: 'name', type: 'text', placeholder: 'Nom de la playlist' }],
      buttons: [
        { text: 'Annuler', role: 'cancel' },
        {
          text: 'Créer',
          handler: (data) => {
            if (data.name?.trim()) {
              this.playlistService.create(data.name.trim()).subscribe(res => {
                this.router.navigate(['/playlist', res.data.id]);
              });
            }
          },
        },
      ],
    });
    await alert.present();
  }
}
