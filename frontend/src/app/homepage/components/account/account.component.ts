import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, CurrentUser } from '../../../services/auth.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="account-container">
      <div class="account-icon" (click)="toggleMenu()">
        <img src="https://ui-avatars.com/api/?name={{ getUserName() }}&background=f05d23&color=fff&size=32" alt="Profile">
      </div>

      @if (isMenuOpen) {
        <div class="popup-menu">
          <div class="menu-header">
            <img src="https://ui-avatars.com/api/?name={{ getUserName() }}&background=f05d23&color=fff&size=40" class="avatar-big">
            <div class="user-info">
              <p>{{ user?.name }}</p>
              <p class="email">{{ user?.email }}</p>
            </div>
          </div>
          <hr>
          <ul class="menu-list">
            <li (click)="onLogout()"><span class="icon-sidebar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path fill="rgb(255, 255, 255)" d="M409 337C418.4 327.6 418.4 312.4 409 303.1L265 159C258.1 152.1 247.8 150.1 238.8 153.8C229.8 157.5 224 166.3 224 176L224 256L112 256C85.5 256 64 277.5 64 304L64 336C64 362.5 85.5 384 112 384L224 384L224 464C224 473.7 229.8 482.5 238.8 486.2C247.8 489.9 258.1 487.9 265 481L409 337zM416 480C398.3 480 384 494.3 384 512C384 529.7 398.3 544 416 544L480 544C533 544 576 501 576 448L576 192C576 139 533 96 480 96L416 96C398.3 96 384 110.3 384 128C384 145.7 398.3 160 416 160L480 160C497.7 160 512 174.3 512 192L512 448C512 465.7 497.7 480 480 480L416 480z"/></svg></span> Logout</li>
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .account-container { display: flex; justify-content: flex-end; padding-right: 10px; position: relative; }
    .account-icon img { width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }
    .popup-menu {
      position: absolute;
      top: 50px;
      right: 0;
      width: 300px;
      background-color: #2a2a2a;
      border-radius: 12px;
      padding: 16px 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      z-index: 1000;
      color: white;
    }
    .menu-header { display: flex; align-items: center; padding: 0 16px 16px; gap: 12px; }
    .avatar-big { width: 40px; height: 40px; border-radius: 50%; }
    .menu-list { list-style: none; padding: 0; margin: 0; }
    .menu-list li {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
    }
    .menu-list li:hover { background-color: #3f3f3f; }
    hr { border: 0; border-top: 1px solid #444; margin: 8px 0; }
    .email { color: #aaa; font-size: 13px; }
    .icon-sidebar { width: 20px; height: 20px; }
    .user-info p { margin: 0; }
  `],
})
export class AccountComponent implements OnInit {
  isMenuOpen = false;
  user: CurrentUser | null = null;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe(res => {
      this.user = res.data;
    });
  }

  getUserName(): string {
    return encodeURIComponent(this.user?.name || 'User');
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }
}
