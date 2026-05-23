import { Component, OnInit } from '@angular/core';
import { PlayerService } from './services/player.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private readonly player: PlayerService) {}

  ngOnInit(): void {
    this.player.initYouTubeAPI();
  }
}
