// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { IntroComponent } from './pages/intro/intro.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: IntroComponent, pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery.component').then(m => m.GalleryComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'home' }
];

export { routes };
