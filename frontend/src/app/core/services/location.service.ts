import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private country$: Observable<string | null>;

  constructor(private readonly http: HttpClient) {
    this.country$ = this.http.get<any>('https://ip-api.com/json/').pipe(
      map(res => res.country ?? null),
      catchError(() => of(null)),
      shareReplay(1),
    );
  }

  getCountry(): Observable<string | null> {
    return this.country$;
  }
}