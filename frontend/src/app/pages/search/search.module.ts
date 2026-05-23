import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { SearchPageRoutingModule } from './search-routing.module';
import { SkeletonListComponent } from '../../components/skeleton-list/skeleton-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SearchPageRoutingModule, SkeletonListComponent],
  declarations: [SearchPage],
})
export class SearchPageModule {}
