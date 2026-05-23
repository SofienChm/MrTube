import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomepageComponent } from './homepage/homepage.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
      { path: 'search', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule) },
      { path: 'library', loadChildren: () => import('./pages/library/library.module').then(m => m.LibraryPageModule) },
      { path: 'player', loadChildren: () => import('./pages/player/player.module').then(m => m.PlayerPageModule) },
      { path: 'playlist/:id', loadChildren: () => import('./pages/playlist-detail/playlist-detail.module').then(m => m.PlaylistDetailPageModule) },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthPageModule),
  },
  {
    path: 'homepage',
    component: HomepageComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
