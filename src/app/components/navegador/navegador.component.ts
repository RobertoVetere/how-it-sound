

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { GoogleAuthService } from '../../services/authgoogle.service';

@Component({
  selector: 'app-navegador',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navegador.component.html',
  styleUrls: ['./navegador.component.css']
})
export class NavegadorComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  username: string = '';
  isUserMenuOpen = false;
  private routerSubscription: Subscription | undefined;
  profileImage: string = '';

  constructor(private router: Router, private googleAuthService: GoogleAuthService) {}

  ngOnInit() {
    // Suscripción a los cambios de autenticación
    this.googleAuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.updateUserProfile();
    });

    // Suscripción a los eventos de navegación
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Cerrar el menú de usuario al cambiar de página
        this.isUserMenuOpen = false;
        // Actualizar el perfil del usuario
        this.updateUserProfile();
      }
    });
  }

   private updateUserProfile() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = JSON.parse(loggedInUser);
      this.profileImage = user.picture ?? ''; // Usa '??' para establecer un valor por defecto si user.picture es null o undefined
      this.username = user.name ? user.name.split(' ')[0] : '';
    } else {
      this.profileImage = ''; // Otra lógica de imagen por defecto si no hay usuario logueado
      this.username = '';
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
    console.log('Menu state:', this.isUserMenuOpen);
  }

  handleSignout() {
    this.googleAuthService.signout();
    this.isLoggedIn = false;
  }
}