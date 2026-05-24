import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MusicService } from '../../../services/music.service';
import { PlayerService } from '../../../services/player.service';
import { Song } from '../../../interfaces/song.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container" #searchContainer>
      <div class="search-box">
        <i class="search-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(255, 255, 255)" d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z"/></svg></i>
        <input #searchInput type="text" [(ngModel)]="query" (keyup.enter)="onSearch()" (input)="onQueryChange()" (focus)="onFocus()" (blur)="onBlur()" placeholder="Rechercher des titres, albums, artistes ou podcasts" autocomplete="off">
        @if (showDropdown && suggestions.length > 0) {
          <div class="search-dropdown">
            <div class="dropdown-item" *ngFor="let s of suggestions" (mousedown)="onPlaySuggestion(s)">
              <img [src]="s.thumbnail" [alt]="s.title">
              <div class="dropdown-info">
                <span class="dropdown-title">{{ s.title }}</span>
                <span class="dropdown-artist">{{ s.artist }}</span>
              </div>
              <span class="dropdown-duration">{{ s.durationFormatted }}</span>
            </div>
          </div>
        }
      </div>
      <button class="search-icon-btn" (click)="openMobileSearch()">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      </button>
    </div>
    @if (isMobileSearchOpen) {
      <div class="mobile-search-overlay" (mousedown)="closeMobileSearch()">
        <div class="mobile-search-inner" (mousedown)="$event.stopPropagation()">
          <div class="mobile-search-header">
            <button class="back-btn" (click)="closeMobileSearch()">&larr;</button>
            <input class="mobile-search-input" type="text" [(ngModel)]="mobileQuery" (keyup.enter)="onMobileSearch()" (input)="onMobileQueryChange()" placeholder="Rechercher..." autocomplete="off">
          </div>
          @if (mobileSuggestions.length > 0) {
            <div class="mobile-results">
              <div class="mobile-result-item" *ngFor="let s of mobileSuggestions" (mousedown)="onPlaySuggestionMobile(s)">
                <img [src]="s.thumbnail" [alt]="s.title">
                <div class="dropdown-info">
                  <span class="dropdown-title">{{ s.title }}</span>
                  <span class="dropdown-artist">{{ s.artist }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .search-container { flex: 1; max-width: 500px; position: relative; }
    .search-box {
      background-color: #2a2a2a;
      border-radius: 20px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      position: relative;
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
    .search-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #2a2a2a;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      z-index: 100;
      max-height: 400px;
      overflow-y: auto;
      margin-top: 4px;
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .dropdown-item:hover { background-color: #3f3f3f; }
    .dropdown-item img { width: 36px; height: 36px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
    .dropdown-info { flex: 1; min-width: 0; }
    .dropdown-title { display: block; font-size: 13px; color: white; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dropdown-artist { display: block; font-size: 11px; color: #aaa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dropdown-duration { font-size: 11px; color: #888; flex-shrink: 0; }
    .search-icon-btn {
      display: none;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
    }
    .search-icon-btn svg { width: 24px; height: 24px; }
    .mobile-search-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 200;
    }
    .mobile-search-overlay:has(.mobile-search-inner) {
      display: block;
    }
    .mobile-search-inner {
      background: #0f0f0f;
      padding: 12px;
      min-height: 100%;
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
    .mobile-results {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .mobile-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: 8px;
      cursor: pointer;
    }
    .mobile-result-item:hover { background-color: #2a2a2a; }
    .mobile-result-item img { width: 40px; height: 40px; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
    @media (max-width: 768px) {
      .search-container { flex: 0; max-width: none; }
      .search-box { display: none; }
      .search-icon-btn { display: block; }
    }
  `],
})
export class SearchComponent implements OnInit, OnDestroy {
  query = '';
  suggestions: Song[] = [];
  showDropdown = false;

  mobileQuery = '';
  mobileSuggestions: Song[] = [];
  isMobileSearchOpen = false;

  private readonly searchSubject = new Subject<string>();
  private readonly mobileSearchSubject = new Subject<string>();
  private searchSub?: Subscription;
  private mobileSearchSub?: Subscription;

  constructor(
    private readonly router: Router,
    private readonly music: MusicService,
    private readonly player: PlayerService,
  ) {}

  ngOnInit(): void {
    this.searchSub = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.trim().length < 2) return [];
        return this.music.search(q.trim());
      }),
    ).subscribe(res => {
      this.suggestions = (res as any)?.data?.songs?.slice(0, 6) ?? [];
    });

    this.mobileSearchSub = this.mobileSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        if (q.trim().length < 2) return [];
        return this.music.search(q.trim());
      }),
    ).subscribe(res => {
      this.mobileSuggestions = (res as any)?.data?.songs?.slice(0, 10) ?? [];
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.mobileSearchSub?.unsubscribe();
  }

  onQueryChange(): void {
    this.searchSubject.next(this.query);
    this.showDropdown = this.query.trim().length >= 2;
  }

  onFocus(): void {
    if (this.suggestions.length > 0) {
      this.showDropdown = true;
    }
  }

  onBlur(): void {
    setTimeout(() => { this.showDropdown = false; }, 200);
  }

  onSearch(): void {
    const q = this.query.trim();
    this.showDropdown = false;
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }

  onPlaySuggestion(song: Song): void {
    this.showDropdown = false;
    this.query = '';
    this.player.setQueue([song], 0);
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
    this.mobileSuggestions = [];
  }

  onMobileQueryChange(): void {
    this.mobileSearchSubject.next(this.mobileQuery);
  }

  onMobileSearch(): void {
    const q = this.mobileQuery.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
      this.closeMobileSearch();
    }
  }

  onPlaySuggestionMobile(song: Song): void {
    this.closeMobileSearch();
    this.player.setQueue([song], 0);
  }
}
