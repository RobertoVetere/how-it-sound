import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'gallery', component: GalleryComponent,  canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' }
];
