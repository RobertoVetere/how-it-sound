

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
  // Suscripción a los eventos de navegación
  this.routerSubscription = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Cerrar el menú de usuario al cambiar de página
      this.isUserMenuOpen = false;

      // Verificar si hay un usuario logado al cambiar de página
      const loggedInUser = sessionStorage.getItem('loggedInUser');
      this.isLoggedIn = !!loggedInUser; 

      // Asegurar que loggedInUser no sea null antes de acceder a 'picture'
      if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        this.profileImage = user.picture ?? ''; // Usa '??' para establecer un valor por defecto si user.picture es null o undefined
        this.username = user.name ? user.name.split(' ')[0] : '';
      } else {
        this.profileImage = ''; // Otra lógica de imagen por defecto si no hay usuario logueado
      }
    }
  });

  // Verificar si hay un usuario logado al iniciar el componente
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  this.isLoggedIn = !!loggedInUser; 

  // Otra lógica de inicialización si es necesaria
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
    sessionStorage.removeItem("loggedInUser");
    this.googleAuthService.signout();
    this.isLoggedIn = false;
  }
}