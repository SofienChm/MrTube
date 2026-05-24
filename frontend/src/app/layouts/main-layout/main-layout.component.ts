import { Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../homepage/components/sidebar/sidebar.component';
import { SearchComponent } from '../../homepage/components/search/search.component';
import { AccountComponent } from '../../homepage/components/account/account.component';
import { MiniPlayerComponent } from '../../components/mini-player/mini-player.component';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, SearchComponent, AccountComponent, MiniPlayerComponent, BottomNavComponent],
  template: `
    <div class="app-shell">
      <div class="app-body">
        <app-sidebar></app-sidebar>
        <main class="main-content">
          <header class="top-header">
            <div class="header-left">
              <img src="assets/icon/mrtube1.png" class="mobile-logo" alt="MrTube">
            </div>
            <app-search></app-search>
            <app-account></app-account>
          </header>
          <router-outlet></router-outlet>
        </main>
      </div>
      <div class="bottom-wrapper">
        <app-mini-player></app-mini-player>
        <app-bottom-nav></app-bottom-nav>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: #0f0f0f;
      color: white;
    }
    .app-body {
      display: flex;
      flex: 1;
      min-height: 0;
    }
    .main-content {
      flex-grow: 1;
      overflow-y: auto;
      position: relative;
      z-index: 1;
    }
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .header-left {
      display: none;
      align-items: center;
    }
    .mobile-logo {
      width: 28px;
      height: 28px;
    }
    .bottom-wrapper {
      display: contents;
    }
    @media (max-width: 768px) {
      .app-shell {
        padding-bottom: 56px;
      }
      .top-header {
        padding: 8px 12px;
      }
      .header-left {
        display: flex;
      }
      .bottom-wrapper {
        display: block;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 50;
      }
    }
  `],
})
export class MainLayoutComponent {}
