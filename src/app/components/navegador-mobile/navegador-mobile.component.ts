import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { GoogleAuthService } from '../../services/authgoogle.service';

@Component({
  selector: 'app-navegador-mobile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navegador-mobile.component.html',
  styleUrls: ['./navegador-mobile.component.css']
})
export class NavegadorMobileComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false;
  private routerSubscription: Subscription | undefined;
  private authSubscription: Subscription | undefined;

  constructor(private router: Router, private googleAuthService: GoogleAuthService) {}

  ngOnInit() {
    // Suscripción a los cambios de autenticación
    this.authSubscription = this.googleAuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    // Suscripción a los eventos de navegación
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Verificar si hay un usuario logado al cambiar de página
        this.updateLoginStatus();
      }
    });

    // Verificar si hay un usuario logado al iniciar el componente
    this.updateLoginStatus();
  }

  private updateLoginStatus() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    this.isLoggedIn = !!loggedInUser;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  handleSignout() {
    this.googleAuthService.signout();
  }
}