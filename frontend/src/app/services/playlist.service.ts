import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Playlist, PlaylistSong } from '../interfaces/song.interface';

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  private readonly apiUrl = environment.apiUrl + '/playlist';

  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new playlist.
   */
  create(name: string, cover?: string): Observable<ApiResponse<Playlist>> {
    return this.http.post<ApiResponse<Playlist>>(this.apiUrl, { name, cover });
  }

  /**
   * Get all playlists for the current user.
   */
  getAll(): Observable<ApiResponse<Playlist[]>> {
    return this.http.get<ApiResponse<Playlist[]>>(this.apiUrl);
  }

  /**
   * Get a single playlist by ID.
   */
  getOne(id: string): Observable<ApiResponse<Playlist>> {
    return this.http.get<ApiResponse<Playlist>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Delete a playlist.
   */
  remove(id: string): Observable<ApiResponse<{ deleted: boolean }>> {
    return this.http.delete<ApiResponse<{ deleted: boolean }>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a song to a playlist.
   */
  addSong(playlistId: string, song: { videoId: string; title: string; artist: string; thumbnail: string; duration: number }): Observable<ApiResponse<PlaylistSong>> {
    return this.http.post<ApiResponse<PlaylistSong>>(`${this.apiUrl}/${playlistId}/songs`, song);
  }

  /**
   * Remove a song from a playlist.
   */
  removeSong(playlistId: string, songId: string): Observable<ApiResponse<{ deleted: boolean }>> {
    return this.http.delete<ApiResponse<{ deleted: boolean }>>(`${this.apiUrl}/${playlistId}/songs/${songId}`);
  }

  downloadAll(playlistId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${playlistId}/download`, { responseType: 'blob' });
  }
}
