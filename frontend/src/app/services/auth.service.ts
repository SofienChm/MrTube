import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/song.interface';

interface AuthResponse {
  access_token: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl + '/auth';
  private readonly tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));

  readonly token$ = this.tokenSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  /**
   * Whether the user is authenticated.
   */
  get isAuthenticated(): boolean {
    return !!this.tokenSubject.value;
  }

  /**
   * Get the stored token.
   */
  get token(): string | null {
    return this.tokenSubject.value;
  }

  /**
   * Register a new user and store the token.
   */
  register(email: string, password: string, name: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/register`, { email, password, name })
      .pipe(tap(res => this.setToken(res.data.access_token)));
  }

  /**
   * Log in and store the token.
   */
  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => this.setToken(res.data.access_token)));
  }

  /**
   * Get the current authenticated user's profile.
   */
  getCurrentUser(): Observable<ApiResponse<CurrentUser>> {
    return this.http.get<ApiResponse<CurrentUser>>(`${this.apiUrl}/me`);
  }

  /**
   * Log out and clear the stored token.
   */
  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }
}
