import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PlayerPage } from './player.page';
import { PlayerPageRoutingModule } from './player-routing.module';

@NgModule({
  imports: [CommonModule, IonicModule, PlayerPageRoutingModule],
  declarations: [PlayerPage],
})
export class PlayerPageModule {}
