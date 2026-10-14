import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadPageModule)
  },
  {
    path: 'review',
    loadChildren: () => import('./pages/review/review.module').then(m => m.ReviewPageModule)
  },
  // ── Desktop direct routes (bypasses ion-tabs shell) ──────────
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule)
  },
  {
    path: 'browse',
    loadChildren: () => import('./pages/browse/browse.module').then(m => m.BrowsePageModule)
  },
  {
    path: 'wizard',
    loadChildren: () => import('./pages/wizard/wizard.module').then(m => m.WizardPageModule)
  },
  // ── Default redirect ─────────────────────────────────────────
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  // ── Mobile Ionic tabs shell ───────────────────────────────────
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
