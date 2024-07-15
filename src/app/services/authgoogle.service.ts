declare var google: any;

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

//TODO: refactorizar service, añade un service para update de profile para ambos navegadores

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private scriptLoaded = false;

  constructor(private router: Router) {}

  private hasToken(): boolean {
    if (this.isBrowser()) {
      return !!sessionStorage.getItem('loggedInUser'); 
    }
    return false;
  }

  
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }


  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.scriptLoaded) {
        resolve();
        return;
      }

      if (typeof document === 'undefined') {
        reject(new Error('Document is not defined'));
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  private decodeToken(token: string){
    return JSON.parse(atob(token.split(".")[1]))
  }

  handleLogin(response: any){
    if(response){
      const payLoad = this.decodeToken(response.credential);
      sessionStorage.setItem("loggedInUser", JSON.stringify(payLoad));
      this.isLoggedInSubject.next(true); 
      this.router.navigate(['/home']);
    }
  }

  signout(){
    sessionStorage.removeItem('loggedInUser');
    google.accounts.id.disableAutoSelect();
    this.isLoggedInSubject.next(false); 
    this.router.navigate(['/login']);
  }
}