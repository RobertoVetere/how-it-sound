import { Component , OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GoogleAuthService } from '../../services/authgoogle.service';
@Component({
  selector: 'app-navegador-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navegador-mobile.component.html',
  styleUrl: './navegador-mobile.component.css'
})
export class NavegadorMobileComponent  implements OnInit, OnDestroy{


  isLoggedIn: boolean = false;
  private routerSubscription: Subscription | undefined;

  constructor(private router: Router, private googleAuthService: GoogleAuthService){}

  ngOnInit() {
  // Suscripción a los eventos de navegación
  this.routerSubscription = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      // Cerrar el menú de usuario al cambiar de página
      
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

  handleSignout() {
this.googleAuthService.signout();
}

}
