

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

  isUserMenuOpen = false;
  private routerSubscription: Subscription | undefined;

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