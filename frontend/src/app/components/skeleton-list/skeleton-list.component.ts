import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-skeleton-list',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-list>
      <ion-item *ngFor="let _ of [].constructor(10)">
        <ion-thumbnail slot="start">
          <ion-skeleton-text animated style="width: 48px; height: 48px;"></ion-skeleton-text>
        </ion-thumbnail>
        <ion-label>
          <h3><ion-skeleton-text animated style="width: 60%"></ion-skeleton-text></h3>
          <p><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></p>
        </ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    ion-thumbnail { --size: 48px; border-radius: 4px; overflow: hidden; }
  `],
})
export class SkeletonListComponent {}
