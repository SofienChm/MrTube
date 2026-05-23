import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MusicService } from '../../services/music.service';
import { PlayerService } from '../../services/player.service';
import { Song } from '../../interfaces/song.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {
  query = '';
  results: Song[] = [];
  loading = false;
  private readonly search$ = new Subject<string>();

  constructor(
    private readonly music: MusicService,
    private readonly player: PlayerService,
    private readonly route: ActivatedRoute,
  ) {
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(q => {
        this.loading = true;
        return this.music.search(q);
      }),
    ).subscribe(res => {
      this.results = res.data.songs;
      this.loading = false;
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (q) {
        this.query = q;
        this.search$.next(q);
      }
    });
  }

  onSearch(): void {
    if (this.query.trim().length > 0) {
      this.search$.next(this.query.trim());
    }
  }

  onPlay(song: Song, queue: Song[]): void {
    this.player.setQueue(queue, queue.indexOf(song));
  }
}
