import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerService } from '../../../services/player.service';
import { Song } from '../../../interfaces/song.interface';

@Component({
  selector: 'app-queue-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Queue</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onClearAll()" *ngIf="remaining.length > 0">
            <ion-label>Clear All</ion-label>
          </ion-button>
          <ion-button (click)="dismiss()">
            <ion-icon slot="icon-only" name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>Now Playing</ion-list-header>
        <ion-item *ngIf="current">
          <ion-thumbnail slot="start">
            <img [src]="current.thumbnail" />
          </ion-thumbnail>
          <ion-label>
            <h3>{{ current.title }}</h3>
            <p>{{ current.artist }}</p>
          </ion-label>
          <ion-icon slot="end" name="musical-note" color="primary"></ion-icon>
        </ion-item>
      </ion-list>

      <ion-list>
        <ion-list-header>Next Up</ion-list-header>
        <ion-item *ngFor="let song of remaining; let i = index" button (click)="onSelect(i)">
          <ion-thumbnail slot="start">
            <img [src]="song.thumbnail" />
          </ion-thumbnail>
          <ion-label>
            <h3>{{ song.title }}</h3>
            <p>{{ song.artist }}</p>
          </ion-label>
          <ion-button slot="end" fill="clear" color="danger" (click)="onRemove(i); $event.stopPropagation()">
            <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
          </ion-button>
        </ion-item>
        <ion-item *ngIf="remaining.length === 0">
          <ion-label class="ion-text-center" color="medium">No upcoming songs</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    ion-thumbnail { --size: 44px; border-radius: 4px; overflow: hidden; }
    h3 { margin: 0; font-size: 0.9rem; font-weight: 500; }
    p { margin: 2px 0 0; font-size: 0.75rem; color: var(--ion-color-medium); }
  `],
})
export class QueueModalComponent implements OnInit, OnDestroy {
  current: Song | null = null;
  remaining: Song[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    readonly player: PlayerService,
    private readonly modal: ModalController,
  ) {}

  ngOnInit(): void {
    this.player.currentSong$.pipe(takeUntil(this.destroy$)).subscribe(s => this.current = s);
    this.player.queue$.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateRemaining());
    this.player.currentIndex$.pipe(takeUntil(this.destroy$)).subscribe(() => this.updateRemaining());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateRemaining(): void {
    const idx = this.player.currentIndex$.value;
    this.remaining = this.player.queue$.value.filter((_, i) => i > idx);
  }

  private queueIndex(displayIndex: number): number {
    return this.player.currentIndex$.value + displayIndex + 1;
  }

  onSelect(displayIndex: number): void {
    const actualIdx = this.queueIndex(displayIndex);
    const queue = this.player.queue$.value;
    this.player.setQueue(queue, actualIdx);
  }

  onRemove(displayIndex: number): void {
    this.player.removeFromQueue(this.queueIndex(displayIndex));
  }

  onClearAll(): void {
    const current = this.player.currentSong$.value;
    if (current) {
      this.player['queue$'].next([current]);
      this.player['currentIndex$'].next(0);
      this.updateRemaining();
    }
  }

  dismiss(): void {
    this.modal.dismiss();
  }
}
