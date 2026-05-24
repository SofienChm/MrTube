import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bottom-nav">
      <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L4 9v12h5v-7h6v7h5V9z"/></svg>
        <span>Accueil</span>
      </a>
      <a routerLink="/search" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <span>Rechercher</span>
      </a>
      <a routerLink="/library" routerLinkActive="active">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3 2v5l-2-.75L13 9V4h4z"/></svg>
        <span>Bibliothèque</span>
      </a>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 56px;
      background: #0f0f0f;
      border-top: 1px solid rgba(255,255,255,0.08);
      z-index: 100;
      justify-content: space-around;
      align-items: center;
      padding-bottom: env(safe-area-inset-bottom, 0);
    }
    .bottom-nav a {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      color: #888;
      text-decoration: none;
      font-size: 10px;
      padding: 4px 12px;
      transition: color 0.2s;
      min-width: 64px;
    }
    .bottom-nav a svg {
      width: 22px;
      height: 22px;
    }
    .bottom-nav a.active {
      color: white;
    }
    @media (max-width: 768px) {
      .bottom-nav {
        display: flex;
      }
    }
  `],
})
export class BottomNavComponent {}
