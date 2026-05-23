import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TabsPage } from './tabs.page';
import { TabsPageRoutingModule } from './tabs-routing.module';
import { MiniPlayerComponent } from '../components/mini-player/mini-player.component';

@NgModule({
  imports: [CommonModule, IonicModule, TabsPageRoutingModule, MiniPlayerComponent],
  declarations: [TabsPage],
})
export class TabsPageModule {}
