import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn()) {
      return true; // Permite el acceso si el usuario está autenticado
    } else {
      this.router.navigate(['/login']); // Redirige a la página de inicio de sesión si el usuario no está autenticado
      return false;
    }
  }

  isLoggedIn(): boolean {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    return !!loggedInUser; // Devuelve true si hay un usuario autenticado en sessionStorage
  }
}