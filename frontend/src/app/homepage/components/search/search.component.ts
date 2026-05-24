import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <div class="search-box">
        <i class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg></i>
        <input type="text" [(ngModel)]="query" (keyup.enter)="onSearch()" placeholder="Rechercher des titres, albums, artistes ou podcasts">
      </div>
      <button class="search-icon-btn" (click)="openMobileSearch()">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </button>
    </div>
    @if (isMobileSearchOpen) {
      <div class="mobile-search-overlay open">
        <div class="mobile-search-header">
          <button class="back-btn" (click)="closeMobileSearch()">&larr;</button>
          <input class="mobile-search-input" type="text" [(ngModel)]="mobileQuery" (keyup.enter)="onMobileSearch()" placeholder="Rechercher...">
        </div>
      </div>
    }
  `,
  styles: [`
    .search-container { flex: 1; max-width: 500px; }
    .search-box {
      background-color: #2a2a2a;
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
    }
    .search-box input {
      background: transparent;
      border: none;
      color: white;
      width: 100%;
      padding-left: 10px;
      outline: none;
    }
    .search-box input::placeholder { color: #aaaaaa; }
    .search-icon-btn {
      display: none;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
    }
    .search-icon-btn svg {
      width: 24px;
      height: 24px;
    }
    .mobile-search-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #0f0f0f;
      z-index: 200;
      padding: 12px;
    }
    .mobile-search-overlay.open {
      display: flex;
      flex-direction: column;
    }
    .mobile-search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .mobile-search-input {
      flex: 1;
      background: #2a2a2a;
      border: none;
      border-radius: 20px;
      padding: 10px 16px;
      color: white;
      font-size: 16px;
      outline: none;
    }
    .back-btn {
      background: transparent;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 4px 8px;
    }
    @media (max-width: 768px) {
      .search-container { flex: 0; max-width: none; }
      .search-box { display: none; }
      .search-icon-btn { display: block; }
    }
  `],
})
export class SearchComponent {
  query = '';
  mobileQuery = '';
  isMobileSearchOpen = false;

  constructor(private readonly router: Router) {}

  onSearch(): void {
    const q = this.query.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }

  openMobileSearch(): void {
    this.isMobileSearchOpen = true;
    setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>('.mobile-search-input');
      el?.focus();
    }, 100);
  }

  closeMobileSearch(): void {
    this.isMobileSearchOpen = false;
    this.mobileQuery = '';
  }

  onMobileSearch(): void {
    const q = this.mobileQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.closeMobileSearch();
    }
  }
}
