import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PlaylistDetailPage } from './playlist-detail.page';
import { PlaylistDetailPageRoutingModule } from './playlist-detail-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, PlaylistDetailPageRoutingModule],
  declarations: [PlaylistDetailPage],
})
export class PlaylistDetailPageModule {}
