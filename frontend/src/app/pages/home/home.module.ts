import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { QuickSelectionComponent } from '../../homepage/components/quick-selection/quick-selection.component';
import { ListenAgainComponent } from '../../homepage/components/listen-again/listen-again.component';

@NgModule({
  imports: [CommonModule, IonicModule, HomePageRoutingModule, QuickSelectionComponent, ListenAgainComponent],
  declarations: [HomePage],
})
export class HomePageModule {}
