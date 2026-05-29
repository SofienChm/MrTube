import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, SearchResult, Song } from '../interfaces/song.interface';

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly apiUrl = environment.apiUrl + '/music';

  constructor(private readonly http: HttpClient) {}

  search(query: string, filter = 'music_songs'): Observable<ApiResponse<SearchResult>> {
    return this.http.get<ApiResponse<SearchResult>>(`${this.apiUrl}/search`, { params: { q: query, filter } });
  }

  getDetails(videoId: string): Observable<ApiResponse<Song>> {
    return this.http.get<ApiResponse<Song>>(`${this.apiUrl}/details/${videoId}`);
  }

  getRelated(videoId: string): Observable<ApiResponse<Song[]>> {
    return this.http.get<ApiResponse<Song[]>>(`${this.apiUrl}/related/${videoId}`);
  }

  getTrending(region?: string): Observable<ApiResponse<Song[]>> {
    const params: any = {};
    if (region) params.region = region;
    return this.http.get<ApiResponse<Song[]>>(`${this.apiUrl}/trending`, { params });
  }

  getDownloadUrl(videoId: string): string {
    return `${this.apiUrl}/download/${videoId}`;
  }

  downloadSong(videoId: string): void {
    window.open(this.getDownloadUrl(videoId), '_blank');
  }
}
