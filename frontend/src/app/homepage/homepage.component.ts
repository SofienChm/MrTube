import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SearchComponent } from './components/search/search.component';
import { AccountComponent } from './components/account/account.component';
import { QuickSelectionComponent } from './components/quick-selection/quick-selection.component';
import { ListenAgainComponent } from './components/listen-again/listen-again.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    SearchComponent,
    AccountComponent,
    QuickSelectionComponent,
    ListenAgainComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent {}
