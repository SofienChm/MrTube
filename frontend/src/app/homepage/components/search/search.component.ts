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
    </div>
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
  `],
})
export class SearchComponent {
  query = '';

  constructor(private readonly router: Router) {}

  onSearch(): void {
    const q = this.query.trim();
    if (q) {
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }
}
