import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse, Song } from '../interfaces/song.interface';
import { AuthService } from './auth.service';

const LOCAL_KEY = 'recently_played';
const MAX_LOCAL = 20;

@Injectable({ providedIn: 'root' })
export class RecentlyPlayedService {
  private readonly apiUrl = environment.apiUrl + '/recently-played';

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {}

  /**
   * Record a played song. Saves to backend if logged in, otherwise locally.
   */
  record(song: Song): Observable<any> {
    if (this.auth.isAuthenticated) {
      const payload = {
        videoId: song.videoId,
        title: song.title,
        artist: song.artist,
        thumbnail: song.thumbnail,
        duration: song.duration,
      };
      return this.http.post(`${this.apiUrl}`, payload).pipe(
        catchError(() => of(null)),
      );
    }
    return of(this.saveLocally(song));
  }

  /**
   * Get recently played songs from backend or local storage.
   */
  getAll(): Observable<Song[]> {
    if (this.auth.isAuthenticated) {
      return this.http.get<ApiResponse<Song[]>>(this.apiUrl).pipe(
        map(res => res.data),
        catchError(() => of(this.getLocally())),
      );
    }
    return of(this.getLocally());
  }

  private saveLocally(song: Song): void {
    const list = this.getLocally();
    const existing = list.findIndex(s => s.videoId === song.videoId);
    if (existing !== -1) list.splice(existing, 1);
    list.unshift(song);
    if (list.length > MAX_LOCAL) list.length = MAX_LOCAL;
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  }

  private getLocally(): Song[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
